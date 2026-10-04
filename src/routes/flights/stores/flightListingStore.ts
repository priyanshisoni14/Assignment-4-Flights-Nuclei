import { derived, writable } from 'svelte/store';
import type {
	FlightListingResponse,
	FlightSegment,
	PartnerFare,
	QuickFilter,
	WarningMessage
} from '$lib/flights-commons/messages/flights-listing-msg.js';

// a picked flight + the booking partner's fare picked for it
export interface FlightSelection {
	segmentId: string;
	fareId: string;
}

interface FlightListingState {
	onwardFlights: FlightSegment[];
	returnFlights: FlightSegment[];
	quickFilters: QuickFilter[];
	warningMessages: WarningMessage[];
	isRoundTrip: boolean;
	isInternational: boolean;
	fareType: string;
	minimumTimeGapForRoundTrip: string;
	// round trip: what was picked in each direction
	selectedOnward: FlightSelection | null;
	selectedReturn: FlightSelection | null;
}

const initialState: FlightListingState = {
	onwardFlights: [],
	returnFlights: [],
	quickFilters: [],
	warningMessages: [],
	isRoundTrip: false,
	isInternational: false,
	fareType: '',
	minimumTimeGapForRoundTrip: '0',
	selectedOnward: null,
	selectedReturn: null
};

export const flightListingStore = writable<FlightListingState>(initialState);

// a pick stays only while that flight + fare is still in the (filtered) list
const stillListed = (sel: FlightSelection | null, list: FlightSegment[]) =>
	sel &&
	list.some((f) => f.segmentId === sel.segmentId && f.fareList.some((p) => p.fareId === sel.fareId))
		? sel
		: null;
// the api can send the same segmentId more than once: keep one card and merge its partner fares
const dedupeSegments = (list: FlightSegment[]): FlightSegment[] => {
	const map = new Map<string, FlightSegment>();
	for (const seg of list) {
		const existing = map.get(seg.segmentId);
		if (!existing) {
			map.set(seg.segmentId, seg);
			continue;
		}
		const known = new Set(existing.fareList.map((f) => f.fareId));
		map.set(seg.segmentId, {
			...existing,
			fareList: [...existing.fareList, ...seg.fareList.filter((f) => !known.has(f.fareId))]
		});
	}
	return [...map.values()];
};
// takes the api response and updates the store.
// Chips are only taken from the response the first time; after that we keep our own
// list so selections survive every filtered refetch.
export function setFlightListing(res: FlightListingResponse) {
	flightListingStore.update((s) => {
				const onward = dedupeSegments(res.onwardFlights ?? []);
		const returning = dedupeSegments(res.returnFlights ?? []);
		return {
			onwardFlights: onward,
			returnFlights: returning,
			quickFilters: s.quickFilters.length > 0 ? s.quickFilters : (res.quickFilters ?? []),
			warningMessages: res.warningMessages ?? [],
			isRoundTrip: res.isRoundTrip,
			isInternational: res.isInternational,
			fareType: res.fareType,
			minimumTimeGapForRoundTrip: res.minimumTimeGapForRoundTrip,
			selectedOnward: stillListed(s.selectedOnward, onward),
			selectedReturn: stillListed(s.selectedReturn, returning)
		};
	});
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

// filters returned nothing (or the server errored while filters were applied):
// empty the list but keep the chips so the user can see / clear them
export function setNoFlights() {
	flightListingStore.update((s) => ({
		...s,
		onwardFlights: [],
		returnFlights: [],
		selectedOnward: null,
		selectedReturn: null
	}));
}

// pick a partner's fare for a flight; picking the same one again un-picks it
export function selectFlight(leg: 'onward' | 'return', segmentId: string, fareId: string) {
	const toggle = (current: FlightSelection | null): FlightSelection | null =>
		current?.segmentId === segmentId && current.fareId === fareId ? null : { segmentId, fareId };

	flightListingStore.update((s) =>
		leg === 'onward'
			? { ...s, selectedOnward: toggle(s.selectedOnward) }
			: { ...s, selectedReturn: toggle(s.selectedReturn) }
	);
}

// ---- derived stores ----

// flights exactly as the api returned them (already filtered by the server)
export const onwardFlights = derived(flightListingStore, ($s) => $s.onwardFlights);
export const returnFlights = derived(flightListingStore, ($s) => $s.returnFlights);
export const isRoundTripListing = derived(flightListingStore, ($s) => $s.isRoundTrip);
export const quickFilters = derived(flightListingStore, ($s) => $s.quickFilters);
export const selectedOnward = derived(flightListingStore, ($s) => $s.selectedOnward);
export const selectedReturn = derived(flightListingStore, ($s) => $s.selectedReturn);

// the fare of the picked partner (the cheapest one if that partner is gone from the response)
const pickedFare = (list: FlightSegment[], sel: FlightSelection | null): number => {
	const seg = sel ? list.find((f) => f.segmentId === sel.segmentId) : undefined;
	if (!seg || !sel) return 0;
	return seg.fareList.find((p) => p.fareId === sel.fareId)?.fare ?? getBestFare(seg)?.fare ?? 0;
};

// bottom bar: the two picked fares added up, and Proceed needs both
export const selectedTotal = derived(
	flightListingStore,
	($s) => pickedFare($s.onwardFlights, $s.selectedOnward) + pickedFare($s.returnFlights, $s.selectedReturn)
);
export const canProceed = derived(
	flightListingStore,
	($s) => $s.selectedOnward !== null && $s.selectedReturn !== null
);

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
// TODO: this is a temporary workaround for the backend not returning the lowest fare
export function getBestFare(segment: FlightSegment): PartnerFare | undefined {
	return (
		segment.fareList.find((f) => f.isLowestPrice) ??
		[...segment.fareList].sort((a, b) => a.fare - b.fare)[0]
	);
}