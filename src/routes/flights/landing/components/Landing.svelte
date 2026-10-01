<script context="module" lang="ts">
	// module-scope: survives Landing.svelte remounting when you navigate to
	// SearchCity and back, so fetchScreenData's overwrite logic only runs once
	// per real page load, not once per visit to this screen
	let hasFetchedConfig = false;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { flightSearchStore, modifySheetOpen } from '$flights/stores/flightSearchStore.js';
	import FlightSearchBox from '$lib/flights-commons/flight-search-box/FlightSearchBox.svelte';
	import {
		applyConfigToStore,
		getFlightConfig
	} from '$lib/flights-commons/utils/flight-config-loader.js';
	import { loadSearchFromCache } from '$lib/flights-commons/utils/flight-search-cache-util.js';
	import PrimaryLoader from '@CDNA-Technologies/svelte-vitals/components/primary-loader';
	import {
		ErrorHandling,
		lceStore,
		setContentLce,
		setErrorLce,
		setLoadingLce
	} from '@CDNA-Technologies/svelte-vitals/error-handling';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { onMount } from 'svelte';
	import CompareAndFlyStrip from './CompareAndFlyStrip.svelte';
	import LandingAppBar from './LandingAppBar.svelte';
	import PromoBanner from './PromoBanner.svelte';
	import RecentSearches from './recent-search-flights/RecentSearches.svelte';
	import UpcomingFlights from './upcoming-flights/UpcomingFlights.svelte';
	// when the landing screen is mounted
	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Landing screen mounted');
		modifySheetOpen.set(false); // a half-finished edit from the listing screen is dropped
		setLoadingLce();
		// fetch the backend config and update the store
		await fetchScreenData();
		const hasCache = applyCachedSearch();
		applySavedSelectionFromSessionStorage();
		applyNonStopFromUrl(hasCache);
	});
	// when API fails
	function handleRetry() {
		setLoadingLce();
		fetchScreenData();
	}
	// returns whether a cached search existed
	function applyCachedSearch(): boolean {
		const cached = loadSearchFromCache();
		if (cached) flightSearchStore.set(cached);
		return cached !== null;
	}

	// the cache (updated by landing ticks and by the listing) is the truth.
	// the url's nonStop is only used when there is no cache yet, e.g. a shared link.
	function applyNonStopFromUrl(hasCache: boolean) {
		const param = $page.url.searchParams.get('nonStop');
		if (param === null) return;

		if (!hasCache) {
			flightSearchStore.update((s) => ({ ...s, nonStopOnly: param === 'true' }));
			return;
		}
		// the landing url can be stale (the listing changed non-stop after it was written):
		// make it match the box instead of the other way round
		if (param !== String($flightSearchStore.nonStopOnly)) {
			const url = new URL(location.href);
			url.searchParams.set('nonStop', String($flightSearchStore.nonStopOnly));
			goto(url, { replaceState: true, noScroll: true, keepFocus: true });
		}
	}
	// fetch the backend config and update the store
	const fetchScreenData = async () => {
		// if the config has already been loaded in this page session, don't touch
		// source/destination again — SearchCity's live store updates (and
		// applySavedSelectionFromSessionStorage below) are the source of truth from here on
		if (hasFetchedConfig) {
			setContentLce();
			return;
		}

		// cache first: the api is called only when the cache is missing or expired.
		// if the api fails, an expired cached copy is used so the screen still opens
		const { searchRequest, error } = await getFlightConfig();

		if (!searchRequest && error) {
			setErrorLce(error);
			return;
		}

		if (searchRequest) {
			applyConfigToStore(searchRequest);

			// find the matched traveller class
			const apiClass = searchRequest.travellerClass?.toUpperCase();
			const matchedClass = searchRequest.travellers?.find((t: any) => t.key === apiClass);

			// check for a city the user already picked on the search-city screen —
			// without this, the API's default source/destination silently overwrites
			// whatever was just selected, every time this screen re-runs fetchScreenData
			const savedSource = sessionStorage.getItem('flights_selected_source');
			const savedDestination = sessionStorage.getItem('flights_selected_destination');

			// a cached config can be days old: its default dates are used only while they are still today or later,
			// otherwise the default is today + the number of days the backend asks for (0 = today)
			const today = new Date().setHours(0, 0, 0, 0);
			const apiDatesValid = Number(searchRequest.departDate) >= today;
			const fallbackDepartDate = new Date();
			fallbackDepartDate.setDate(
				fallbackDepartDate.getDate() +
					Number(searchRequest.configMap?.LANDING_DAYS_FROM_START_DATE ?? 0)
			);

			flightSearchStore.update((s) => ({
				...s,
				source: savedSource
					? JSON.parse(savedSource)
					: {
							locationName: searchRequest.src.city,
							iataCode: searchRequest.src.iataCode,
							airportName: searchRequest.src.name
					  },
				destination: savedDestination
					? JSON.parse(savedDestination)
					: {
							locationName: searchRequest.des.city,
							iataCode: searchRequest.des.iataCode,
							airportName: searchRequest.des.name
					  },
				...(apiDatesValid
					? {
							departureDate: new Date(Number(searchRequest.departDate)),
							isRoundTrip: searchRequest.isRoundTrip,
							returnDate:
								searchRequest.isRoundTrip && searchRequest.returnDate !== '0'
									? new Date(Number(searchRequest.returnDate))
									: undefined
					  }
					: { departureDate: fallbackDepartDate }),
				adults: searchRequest.adultCount,
				children: searchRequest.childCount,
				infants: searchRequest.infantCount,
				travelClass: matchedClass?.key ?? apiClass ?? 'ECONOMY',
				nonStopOnly: searchRequest.configMap?.NON_STOP_FLIGHT_LANDING === 'true'
			}));
		}

		hasFetchedConfig = true;
		setContentLce();
	};

	// consumes the saved selection from session storage and cleans it up to prevent stale data
	function consumeSavedSelection(key: string): { locationName: string; iataCode: string } | null {
		const raw = sessionStorage.getItem(key);
		if (!raw) return null;
		sessionStorage.removeItem(key);
		try {
			return JSON.parse(raw);
		} catch (err) {
			NucleiLogger.logWarn('Landing', 'Failed to parse saved selection from session storage');
			return null;
		}
	}
	// checking if there is a saved selection sitting in session storage
	// and updating the store in case of a hard refresh
	function applySavedSelectionFromSessionStorage() {
		const savedSource = consumeSavedSelection('flights_selected_source');
		const savedDestination = consumeSavedSelection('flights_selected_destination');

		if (savedSource || savedDestination) {
			flightSearchStore.update((s) => ({
				...s,
				source: savedSource ?? s.source,
				destination: savedDestination ?? s.destination
			}));
		}
	}
</script>

<div
	class="flex h-screen w-full flex-col overflow-x-hidden bg-base-100 [@supports(height:100dvh)]:h-[100dvh]"
>
	<LandingAppBar />

	{#if $lceStore.isLoading}
		<div class="flex flex-1 flex-col justify-center">
			<PrimaryLoader />
		</div>
	{:else if $lceStore.hasError && $lceStore.errorDetails != null}
		<div class="flex flex-1 flex-col">
			<ErrorHandling errorHandling={$lceStore.errorDetails} on:submit={handleRetry} />
		</div>
	{:else if $lceStore.hasContent}
		<div class="w-full min-w-0 space-y-4 px-4 pt-4 sm:px-6 md:space-y-5 md:pt-6 lg:px-10 xl:px-16">
			<CompareAndFlyStrip />
			<FlightSearchBox />
			<PromoBanner />
			<UpcomingFlights />
			<RecentSearches />
		</div>
	{/if}
</div>
