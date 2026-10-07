import { fetchFlightsCoreConfig } from '$flights/api/flights-api.js';
import { flightsLanguageCode } from '$flights/i18n.js';
import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
import { get } from 'svelte/store';
import { FlightsConfigCacheUtil } from './flights-config-cache-util.js';

// searchRequest is set on success; error is set only when the api failed and there was no cached copy
export type FlightConfigResult = { searchRequest?: any; error?: any };

const loadConfig = async (): Promise<FlightConfigResult> => {
	const scope = get(flightsLanguageCode) || 'default';

	// 1. a fresh cached copy: no api call
	const cached = FlightsConfigCacheUtil.getCachedConfig(scope);
	if (cached?.searchRequest) return { searchRequest: cached.searchRequest };

	// 2. nothing cached, or it expired: call the api and cache the response
	const result = await fetchFlightsCoreConfig();
	if (!result.hasError()) {
		const response = result.response as { searchRequest?: any } | undefined;
		if (response?.searchRequest) FlightsConfigCacheUtil.cacheNewConfig(response, scope);
		return { searchRequest: response?.searchRequest };
	}

	// 3. the api failed: an expired copy is better than an empty screen
	const stale = FlightsConfigCacheUtil.getCachedConfig(scope, true);
	if (stale?.searchRequest) {
		NucleiLogger.logWarn('FlightConfig', 'Config api failed, using the expired cached config');
		return { searchRequest: stale.searchRequest };
	}

	return { error: result.error };
};

// two callers asking at the same time share one api call
let inFlight: Promise<FlightConfigResult> | null = null;
export const getFlightConfig = (): Promise<FlightConfigResult> => {
	if (!inFlight) {
		inFlight = loadConfig().finally(() => {
			inFlight = null;
		});
	}
	return inFlight;
};

// puts the config parameters into the store
export const applyConfigToStore = (searchRequest: any) => {
	flightConfigStore.set({
		guests: searchRequest.guests ?? [],
		travellers: searchRequest.travellers ?? [],
		configMap: searchRequest.configMap ?? {},
		vendorDetails: searchRequest.vendorDetails ?? [],
		partnerCountry: searchRequest.partnerCountry ?? 'IN'
	});
};

// listing screen: after a hard reload the store is empty 
export const ensureFlightConfig = async () => {
	// if the config has already been loaded in this page session no need to fetch it again
	if (get(flightConfigStore).travellers.length > 0) return;

	const { searchRequest } = await getFlightConfig();
	if (!searchRequest) {
		NucleiLogger.logWarn('FlightConfig', 'Config unavailable, class/traveller options missing');
		return;
	}
	applyConfigToStore(searchRequest);
};