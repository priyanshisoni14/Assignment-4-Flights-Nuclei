import { browser } from '$app/environment';
import type { FlightSearchState } from '$flights/stores/flightSearchStore.js';

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
		return {
			source: r.source,
			destination: r.destination,
			departureDate: depart.getTime() >= today.getTime() ? depart : new Date(),
			returnDate: r.returnDate !== '0' ? new Date(Number(r.returnDate)) : undefined,
			isRoundTrip: r.isRoundTrip,
			adults: r.adultCount,
			children: r.childCount,
			infants: r.infantCount,
			travelClass: r.travellerClass,
			nonStopOnly: r.nonStopOnly,
			specialFare: r.specialFare ?? null
		};
	} catch {
		return null;
	}
};