import { derived, writable } from 'svelte/store';
import type {
	FlightListingResponse,
	FlightSegment,
	PartnerFare,
	QuickFilter,
	WarningMessage
} from '$lib/flights-commons/messages/flights-listing-msg.ts';

interface FlightListingState {
	onwardFlights: FlightSegment[];
	returnFlights: FlightSegment[];
	quickFilters: QuickFilter[];
	warningMessages: WarningMessage[];
	isRoundTrip: boolean;
	isInternational: boolean;
	fareType: string;
	/** seconds, as sent by the backend */
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

// ---- write helpers ----

/** store only what the UI uses from the API response */
export function setFlightListing(res: FlightListingResponse) {
	flightListingStore.set({
		onwardFlights: res.onwardFlights ?? [],
		returnFlights: res.returnFlights ?? [],
		quickFilters: res.quickFilters ?? [],
		warningMessages: res.warningMessages ?? [],
		isRoundTrip: res.isRoundTrip,
		isInternational: res.isInternational,
		fareType: res.fareType,
		minimumTimeGapForRoundTrip: res.minimumTimeGapForRoundTrip
	});
}

export function resetFlightListing() {
	flightListingStore.set(initialState);
}

/** quickFilter `id` is not unique (all airline chips share 6), so match on type + value */
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

// ---- derived values ----

export const onwardFlights = derived(flightListingStore, ($s) => $s.onwardFlights);
export const quickFilters = derived(flightListingStore, ($s) => $s.quickFilters);
export const hasFlights = derived(onwardFlights, ($f) => $f.length > 0);

/** badge number on the Sort & Filter button */
export const appliedFilterCount = derived(
	quickFilters,
	($q) => $q.filter((f) => f.isSelected).length
);

// ---- helpers for the flight card (not stores) ----

/** the fare the card should show: the one flagged lowest, else the cheapest */
export function getBestFare(segment: FlightSegment): PartnerFare | undefined {
	return (
		segment.fareList.find((f) => f.isLowestPrice) ??
		[...segment.fareList].sort((a, b) => a.fare - b.fare)[0]
	);
}