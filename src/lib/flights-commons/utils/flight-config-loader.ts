import { fetchFlightsCoreConfig } from '$flights/api/flights-api.js';
import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
import { get } from 'svelte/store';

// Landing fills flightConfigStore itself. After a hard reload on the listing screen the store is
// empty, so the class/traveller options would be blank: fetch the config once in that case.
export const ensureFlightConfig = async () => {
	if (get(flightConfigStore).travellers.length > 0) return;

	const result = await fetchFlightsCoreConfig();
	const searchRequest = (result.response as { searchRequest?: any } | undefined)?.searchRequest;

	if (result.hasError() || !searchRequest) {
		NucleiLogger.logWarn('FlightConfig', 'Config api failed, class/traveller options unavailable');
		return;
	}

	flightConfigStore.set({
		guests: searchRequest.guests ?? [],
		travellers: searchRequest.travellers ?? [],
		configMap: searchRequest.configMap ?? {},
		vendorDetails: searchRequest.vendorDetails ?? [],
		partnerCountry: searchRequest.partnerCountry ?? 'IN'
	});
};