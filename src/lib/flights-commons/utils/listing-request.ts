import type {
	FlightListingRequest,
	QuickFilter
} from '$lib/flights-commons/messages/flights-listing-msg.js';
import { buildAppliedSortFilter } from './flight-filter-utils.js';
import type { ListingParams } from './listing-url.js';

// the listing api request for the search in the url, plus the selected quick-filter chips
export const buildListingRequest = (
	p: ListingParams,
	chips: QuickFilter[]
): FlightListingRequest => ({
	src: {
		iataCode: p.src.iataCode,
		city: p.src.city,
		name: p.src.city,
		countryCode: p.src.countryCode,
		iconUrl: ''
	},
	des: {
		iataCode: p.des.iataCode,
		city: p.des.city,
		name: p.des.city,
		countryCode: p.des.countryCode,
		iconUrl: ''
	},
	// callGetFlightsSearchListV2 reformats these to DD-MM-YYYY itself
	departDate: p.departDate,
	returnDate: p.returnDate ?? '',
	travellerClass: p.travelClass as FlightListingRequest['travellerClass'],
	passenger: { adultCount: p.adults, childCount: p.children, infantCount: p.infants },
	appliedSortFilter: buildAppliedSortFilter(chips),
	is_round_trip: p.returnDate !== null,
	partnerCountry: p.partnerCountry,
	fareType: p.fareType
});