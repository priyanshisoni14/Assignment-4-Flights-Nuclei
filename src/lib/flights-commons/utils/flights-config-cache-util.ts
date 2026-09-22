import { browser } from '$app/environment';
import { StringUtils } from '@CDNA-Technologies/svelte-vitals/util';

// TODO: add proper types once messages are added, verify the caching logic.
export class FlightsConfigCacheUtil {
	static CONFIG_CACHE_NAME = 'FlightsLandingConfigCache';
	static CONFIG_EXPIRY_CACHE_NAME = 'FlightsLandingConfigCacheExpiry';
	
	//This is to be used in the whole Flights app, to update the cached config
	static updateExistingConfig(response: any) {
		if (!_validateBrowserCondition()) {
			return;
		}
		localStorage?.setItem(this.CONFIG_CACHE_NAME, JSON.stringify(response));
	}

	//This is to be used only when we call the getConfigApi
	static cacheNewConfig(response: any) {
		if (!_validateBrowserCondition()) {
			return;
		}
		const currentDate = new Date();
		let expiry = currentDate.getTime() + parseInt(response['exp']); // TODO: add expiry time for the particular category from the config
		localStorage?.setItem(this.CONFIG_EXPIRY_CACHE_NAME, JSON.stringify(expiry));
		localStorage?.setItem(this.CONFIG_CACHE_NAME, JSON.stringify(response));
	}

	//To check if the existing config is expired or not
	static isConfigExpired() {
		if (!_validateBrowserCondition()) {
			return;
		}
		const currentDate = new Date();
		const currentMillis = currentDate.getTime();
		let cachedExpiry = JSON.parse(localStorage?.getItem(this.CONFIG_EXPIRY_CACHE_NAME) ?? '0');
		if (cachedExpiry > currentMillis) {
			return false;
		} else {
			return true;
		}
	}

	//This is to be used in the whole Flights app, to access the cached config.
	//Just one case where we make the getConfig API call we don't use this.
	static getCachedConfig() {
		if (!_validateBrowserCondition()) {
			return;
		}
		let config = localStorage?.getItem(this.CONFIG_CACHE_NAME) ?? '';
		if (StringUtils.isNotEmpty(config)) {
			return JSON.parse(config);
		}
		// return mockLandingConfig; TODO: return mockLanding config in case config API failed.
	}
}

function _validateBrowserCondition() {
	return browser && _isLocalStorageAvailable();
}

function _isLocalStorageAvailable() {
	let test = 'test';
	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch (e) {
		return false;
	}
}
