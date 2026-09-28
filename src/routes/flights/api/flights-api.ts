import { ApiUtil } from '@CDNA-Technologies/svelte-vitals/api-util';
import { deepCopy } from '@CDNA-Technologies/svelte-vitals/util';
import dayjs from 'dayjs';
import type { FlightListingRequest, FlightListingResponse } from '$lib/flights-commons/messages/flights-listing-msg.js';

// fetch the backend config
export async function fetchFlightsCoreConfig() {
	return await ApiUtil.post(
		'/com.gonuclei.flights.v1.LandingService/getConfig'
	);
}
// fetch the flights
export async function getPopularCities() {
	return await ApiUtil.post(
		'/com.gonuclei.flights.v1.LandingService/getPopularCities'
	);
}
// fetch the airport search results
export async function getAirportSearchResults(searchText: string) {
	return await ApiUtil.post(
		'/com.gonuclei.flights.v1.LandingService/getAirportSearchResults',
		{ searchText: searchText.trim() }
	);
}

// listing api - fetch the flights
export function callGetFlightsSearchListV2(request: FlightListingRequest) {
	const flightListingRequest = deepCopy(request);
	flightListingRequest.departDate = dayjs(flightListingRequest.departDate).format('DD-MM-YYYY');
	if (flightListingRequest.is_round_trip) {
		flightListingRequest.returnDate = dayjs(flightListingRequest.returnDate).format('DD-MM-YYYY');
	}
	return ApiUtil.post<FlightListingRequest, FlightListingResponse>(
		'/com.gonuclei.flights.v1.ListingService/GetFlightsSearchListV2',
		flightListingRequest,
		false
	);
}