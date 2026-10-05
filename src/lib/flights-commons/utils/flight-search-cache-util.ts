import { browser } from '$app/environment';
import type { FlightSearchState } from '$flights/stores/flightSearchStore.js';
import { fromFareType } from './special-fare.js';
export const SEARCH_CACHE_KEY = 'flightLandingSearchCityCache';

// dates are stored as epoch-ms strings, like the backend's searchRequest
interface CachedSearchRequest {
	source: FlightSearchState['source'];
	destination: FlightSearchState['destination'];
	departDate: string;
	returnDate: string; // '0' = none
	isRoundTrip: boolean;
	adultCount: number;
	childCount: number;
	infantCount: number;
	travellerClass: string;
	nonStopOnly: boolean;
	specialFare: string | null;
}

export const saveSearchToCache = (s: FlightSearchState) => {
	if (!browser) return;
	const searchRequest: CachedSearchRequest = {
		source: s.source,
		destination: s.destination,
		departDate: String(new Date(s.departureDate).getTime()),
		returnDate: s.isRoundTrip && s.returnDate ? String(new Date(s.returnDate).getTime()) : '0',
		isRoundTrip: s.isRoundTrip,
		adultCount: s.adults,
		childCount: s.children,
		infantCount: s.infants,
		travellerClass: s.travelClass,
		nonStopOnly: s.nonStopOnly,
		specialFare: s.specialFare
	};
	try {
		localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify([{ searchRequest }]));
	} catch {
		// storage unavailable, ignore
	}
};

export const loadSearchFromCache = (): FlightSearchState | null => {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(SEARCH_CACHE_KEY);
		const r: CachedSearchRequest | undefined = raw ? JSON.parse(raw)?.[0]?.searchRequest : undefined;
		if (!r?.source?.iataCode || !r?.destination?.iataCode) return null;

		const depart = new Date(Number(r.departDate));
		// a cached date in the past is useless: fall back to today
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const departureDate = depart.getTime() >= today.getTime() ? depart : new Date();

		// a cached return before the (possibly moved) departure is dropped, together with the
		// round-trip flag: otherwise the listing url would carry a return earlier than the departure
		const cachedReturn = r.returnDate !== '0' ? new Date(Number(r.returnDate)) : undefined;
		const departDay = new Date(departureDate);
		departDay.setHours(0, 0, 0, 0);
		const returnDate =
			cachedReturn && cachedReturn.getTime() >= departDay.getTime() ? cachedReturn : undefined;

		return {
			source: r.source,
			destination: r.destination,
			departureDate,
			returnDate,
			isRoundTrip: r.isRoundTrip && returnDate !== undefined,
			adults: r.adultCount,
			children: r.childCount,
			infants: r.infantCount,
			travelClass: r.travellerClass,
			nonStopOnly: r.nonStopOnly,
			specialFare: fromFareType(r.specialFare)
		};
	} catch {
		return null;
	}
};

// updates only the non-stop flag of the cached search (no-op when nothing is cached yet),
// so a landing tick survives search-city / refresh like the other selections
export const saveNonStopToCache = (nonStopOnly: boolean) => {
	if (!browser) return;
	try {
		const raw = localStorage.getItem(SEARCH_CACHE_KEY);
		const list = raw ? JSON.parse(raw) : null;
		if (!list?.[0]?.searchRequest) return;
		list[0].searchRequest.nonStopOnly = nonStopOnly;
		localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(list));
	} catch {
		// storage unavailable, ignore
	}
};