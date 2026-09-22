import { ApiUtil } from '@CDNA-Technologies/svelte-vitals/api-util';

export async function fetchFlightsCoreConfig() {
	return await ApiUtil.post(
		'/com.gonuclei.flights.v1.LandingService/getConfig'
	);
}

export async function getPopularCities() {
	return await ApiUtil.post(
		'/com.gonuclei.flights.v1.LandingService/getPopularCities'
	);
}

export async function getAirportSearchResults(searchText: string) {
	return await ApiUtil.post(
		'/com.gonuclei.flights.v1.LandingService/getAirportSearchResults',
		{ searchText: searchText.trim() }
	);
}