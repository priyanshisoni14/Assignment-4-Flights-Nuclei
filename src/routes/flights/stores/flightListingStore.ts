import { derived, writable } from 'svelte/store';
import type {
	FlightListingResponse,
	FlightSegment,
	PartnerFare,
	QuickFilter,
	WarningMessage
} from '$lib/flights-commons/messages/flights-listing-msg.js';
import { applyQuickFilters } from '$lib/flights-commons/utils/flight-filter-utils.js';

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

// takes the api response and updates the store
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

// resets the store to initial state when starting a new search
export function resetFlightListing() {
	flightListingStore.set(initialState);
}

// quickfilter id is not unique so we need to find the right one
// to toggle so map on the filterType and filterValue
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

// deselects every chip for a "Clear filters" button
export function clearQuickFilters() {
	flightListingStore.update((s) => ({
		...s,
		quickFilters: s.quickFilters.map((f) => ({ ...f, isSelected: false }))
	}));
}

// ---- derived stores ----

// stores the onward flights from the main flightlisting store
export const onwardFlights = derived(flightListingStore, ($s) => $s.onwardFlights);
// the quick-filter chips that are applied to the onward flights
export const quickFilters = derived(flightListingStore, ($s) => $s.quickFilters);
// true when the API returned flights but the selected chips hide all of them
export const hasFlights = derived(onwardFlights, ($f) => $f.length > 0);


// badge number on the Sort & Filter button returns the number of chips selected
export const appliedFilterCount = derived(
	quickFilters,
	($q) => $q.filter((f) => f.isSelected).length
);

// onward flights after the selected quick-filter chips are applied
export const filteredFlights = derived(
	[onwardFlights, quickFilters],
	([$flights, $chips]) => applyQuickFilters($flights, $chips)
);

// true when the API returned flights but the selected chips hide all of them
export const noFlightsMatchFilters = derived(
	[hasFlights, filteredFlights],
	([$has, $filtered]) => $has && $filtered.length === 0
);

// ---- helpers for the flight card (not stores) ----

//the fare the card should show: the one flagged lowest, else the cheapest 
export function getBestFare(segment: FlightSegment): PartnerFare | undefined {
	return (
		segment.fareList.find((f) => f.isLowestPrice) ??
		[...segment.fareList].sort((a, b) => a.fare - b.fare)[0]
	);
}