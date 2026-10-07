import { browser } from '$app/environment';

// used when the api response has no usable `exp`. the config rarely changes, so tune this freely
const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
// never trust an api expiry longer than this (guards against `exp` being an absolute timestamp)
const MAX_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type CacheEntry = { expiry: number; data: any };

let storageOk: boolean | undefined;
const isStorageAvailable = (): boolean => {
	if (!browser) return false;
	if (storageOk === undefined) {
		try {
            //checking if localStorage is available or not
            //by setting a key and then removing it
            //if not then it will throw an error
			const probe = '__flights_probe__';
			localStorage.setItem(probe, probe);
			localStorage.removeItem(probe);
			storageOk = true;
		} catch {
			storageOk = false; // private mode / storage blocked
		}
	}
	return storageOk;
};

export class FlightsConfigCacheUtil {
	static CONFIG_CACHE_NAME = 'FlightsLandingConfigCache';

	// one entry per scope (we use the app language), so a language switch never shows old text
	private static keyFor(scope: string) {
		return `${FlightsConfigCacheUtil.CONFIG_CACHE_NAME}:${scope}`;
	}

    // read the cache entry for the given scope
	private static read(scope: string): CacheEntry | undefined {
		if (!isStorageAvailable()) return undefined;
		try {
			const raw = localStorage.getItem(FlightsConfigCacheUtil.keyFor(scope));
			if (!raw) return undefined;
			const entry = JSON.parse(raw) as CacheEntry;
			return typeof entry?.expiry === 'number' && entry.data ? entry : undefined;
		} catch {
			return undefined; // corrupt json counts as "no cache"
		}
	}

	private static write(scope: string, entry: CacheEntry) {
		try {
			localStorage.setItem(FlightsConfigCacheUtil.keyFor(scope), JSON.stringify(entry));
		} catch {
			// quota exceeded or storage blocked: caching is best-effort, so ignore
		}
	}

	// to be used only right after the getConfig api succeeded
	static cacheNewConfig(response: any, scope = 'default') {
		// the backend sends how long the config may be cached (24h = "86400000") in the config map
		const apiTtl = Number.parseInt(
			response?.searchRequest?.configMap?.CACHING_TIME_IN_MILLISECOND ?? response?.exp,
			10
		);
		const ttl =
			Number.isFinite(apiTtl) && apiTtl > 0 ? Math.min(apiTtl, MAX_TTL_MS) : DEFAULT_TTL_MS;
		FlightsConfigCacheUtil.write(scope, { expiry: Date.now() + ttl, data: response });
	}

	// the cached getConfig response. an expired copy is returned only when allowExpired is true
	// (used as a fallback when the api is down)
	static getCachedConfig(scope = 'default', allowExpired = false) {
		const entry = FlightsConfigCacheUtil.read(scope);
		if (!entry) return undefined;
		if (!allowExpired && entry.expiry <= Date.now()) return undefined;
		return entry.data;
	}
}