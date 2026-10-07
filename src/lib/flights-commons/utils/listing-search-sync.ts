import type { FlightSearchState } from '$flights/stores/flightSearchStore.js';
import type { ListingParams } from './listing-url.js';
import { parseListingDate } from './listing-url.js';
import { fromFareType } from './special-fare.js';

// the search state described by the listing url. The url has no airport names,
// so they are taken from whichever known location has the same iata code
export const searchStateFromParams = (
	p: ListingParams,
	nonStop: boolean,
	current: FlightSearchState,
	cached: FlightSearchState | null
): FlightSearchState => {
	const airportName = (iata: string) =>
		[current.source, current.destination, cached?.source, cached?.destination].find(
			(l) => l?.iataCode === iata && l.airportName
		)?.airportName;

	return {
		...current,
		source: {
			locationName: p.src.city,
			iataCode: p.src.iataCode,
			airportName: airportName(p.src.iataCode),
			countryCode: p.src.countryCode
		},
		destination: {
			locationName: p.des.city,
			iataCode: p.des.iataCode,
			airportName: airportName(p.des.iataCode),
			countryCode: p.des.countryCode
		},
		departureDate: parseListingDate(p.departDate),
		isRoundTrip: p.returnDate !== null,
		returnDate: p.returnDate ? parseListingDate(p.returnDate) : undefined,
		adults: p.adults,
		children: p.children,
		infants: p.infants,
		travelClass: p.travelClass.key,
		nonStopOnly: nonStop,
		specialFare: fromFareType(p.fareType)
	};
};