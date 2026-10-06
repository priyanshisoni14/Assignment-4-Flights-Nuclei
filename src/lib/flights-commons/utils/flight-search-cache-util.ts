import { browser } from '$app/environment';
import type { FlightSearchState } from '$flights/stores/flightSearchStore.js';
import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
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

// ---- cities picked on the search-city screen ----
// search-city saves the pick here; landing applies it. The keys live in this one place only,
// so the three screens can never disagree about them
type PickedType = 'source' | 'destination';
type PickedLocation = FlightSearchState['source'];

const PICKED_KEYS: Record<PickedType, string> = {
	source: 'flights_selected_source',
	destination: 'flights_selected_destination'
};

export const savePickedLocation = (type: PickedType, location: PickedLocation) => {
	if (!browser) return;
	try {
		sessionStorage.setItem(PICKED_KEYS[type], JSON.stringify(location));
	} catch {
		// storage unavailable, ignore
	}
};

// reads without removing. A broken or old-format value gives null instead of throwing
export const peekPickedLocation = (type: PickedType): PickedLocation | null => {
	if (!browser) return null;
	try {
		const raw = sessionStorage.getItem(PICKED_KEYS[type]);
		const parsed = raw ? JSON.parse(raw) : null;
		return parsed && typeof parsed.iataCode === 'string' ? (parsed as PickedLocation) : null;
	} catch {
		NucleiLogger.logWarn('Flights', 'Failed to read picked location from session storage');
		return null;
	}
};

// reads and removes, even when the value was broken, so it can never get stuck
export const consumePickedLocation = (type: PickedType): PickedLocation | null => {
	const value = peekPickedLocation(type);
	try {
		sessionStorage.removeItem(PICKED_KEYS[type]);
	} catch {
		// ignore
	}
	return value;
};

// the edit was abandoned: neither pick may leak to landing
export const clearPickedLocations = () => {
	if (!browser) return;
	try {
		Object.values(PICKED_KEYS).forEach((key) => sessionStorage.removeItem(key));
	} catch {
		// ignore
	}
};