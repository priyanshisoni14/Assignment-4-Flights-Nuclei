import { ApiUtil } from '@CDNA-Technologies/svelte-vitals/api-util';

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