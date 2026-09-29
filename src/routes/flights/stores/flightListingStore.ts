import { derived, writable } from 'svelte/store';
import type {
	FlightListingResponse,
	FlightSegment,
	PartnerFare,
	QuickFilter,
	WarningMessage
} from '$lib/flights-commons/messages/flights-listing-msg.js';

interface FlightListingState {
	onwardFlights: FlightSegment[];
	returnFlights: FlightSegment[];
	quickFilters: QuickFilter[];
	warningMessages: WarningMessage[];
	isRoundTrip: boolean;
	isInternational: boolean;
	fareType: string;
	minimumTimeGapForRoundTrip: string;
}

const initialState: FlightListingState = {
	onwardFlights: [],
	returnFlights: [],
	quickFilters: [],
	warningMessages: [],
	isRoundTrip: false,
	isInternational: false,
	fareType: '',
	minimumTimeGapForRoundTrip: '0'
};

export const flightListingStore = writable<FlightListingState>(initialState);

// takes the api response and updates the store.
// Chips are only taken from the response the first time; after that we keep our own
// list so selections survive every filtered refetch.
export function setFlightListing(res: FlightListingResponse) {
	flightListingStore.update((s) => ({
		onwardFlights: res.onwardFlights ?? [],
		returnFlights: res.returnFlights ?? [],
		quickFilters: s.quickFilters.length > 0 ? s.quickFilters : (res.quickFilters ?? []),
		warningMessages: res.warningMessages ?? [],
		isRoundTrip: res.isRoundTrip,
		isInternational: res.isInternational,
		fareType: res.fareType,
		minimumTimeGapForRoundTrip: res.minimumTimeGapForRoundTrip
	}));
}

// resets the store to initial state (call when the listing screen is opened)
export function resetFlightListing() {
	flightListingStore.set(initialState);
}

// quickfilter id is not unique so map on filterType and filterValue.
// The caller must re-call the listing api after this.
export function toggleQuickFilter(filterType: string, filterValue: string) {
	flightListingStore.update((s) => ({
		...s,
		quickFilters: s.quickFilters.map((f) =>
			f.filterType === filterType && f.filterValue === filterValue
				? { ...f, isSelected: !f.isSelected }
				: f
		)
	}));
}

// deselects every chip; the caller must re-call the listing api after this
export function clearQuickFilters() {
	flightListingStore.update((s) => ({
		...s,
		quickFilters: s.quickFilters.map((f) => ({ ...f, isSelected: false }))
	}));
}

// ---- derived stores ----

// flights exactly as the api returned them (already filtered by the server)
export const onwardFlights = derived(flightListingStore, ($s) => $s.onwardFlights);
export const quickFilters = derived(flightListingStore, ($s) => $s.quickFilters);

// badge number on the Sort & Filter button = number of chips selected
export const appliedFilterCount = derived(
	quickFilters,
	($q) => $q.filter((f) => f.isSelected).length
);

// server returned nothing while filters are applied -> show "clear filters"
export const noFlightsMatchFilters = derived(
	[onwardFlights, appliedFilterCount],
	([$flights, $count]) => $flights.length === 0 && $count > 0
);

// ---- helpers for the flight card (not stores) ----

// the fare the card should show: the one flagged lowest, else the cheapest
export function getBestFare(segment: FlightSegment): PartnerFare | undefined {
	return (
		segment.fareList.find((f) => f.isLowestPrice) ??
		[...segment.fareList].sort((a, b) => a.fare - b.fare)[0]
	);
}