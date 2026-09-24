<script lang="ts">
	import { fetchFlightsCoreConfig } from '$flights/api/flights-api.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import FlightSearchBox from '$lib/flights-commons/flight-search-box/FlightSearchBox.svelte';
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
	import LandingAppBar from './LandingAppBar.svelte';
	import PromoBanner from './PromoBanner.svelte';
	import RecentSearches from './recent-search-flights/RecentSearches.svelte';
	import UpcomingFlights from './upcoming-flights/UpcomingFlights.svelte';

	// when the landing screen is mounted
	let hasFetchedConfig = false;
	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Landing screen mounted');
		setLoadingLce();
		// fetch the backend config and update the store
		await fetchScreenData();
		applySavedSelectionFromSessionStorage();
	});
	// when API fails
	function handleRetry() {
		setLoadingLce();
		fetchScreenData();
	}
	// fetch the backend config and update the store
	const fetchScreenData = async () => {
		// if the config has already been fetched
		if (hasFetchedConfig) {
			setContentLce();
			return;
		}

		const configResult = await fetchFlightsCoreConfig();

		if (configResult.hasError()) {
			setErrorLce(configResult.error);
			return;
		}
		//
		const searchRequest = (configResult.response as { searchRequest?: any } | undefined)
			?.searchRequest;
		if (searchRequest) {
			flightConfigStore.set({
				guests: searchRequest.guests ?? [],
				travellers: searchRequest.travellers ?? [],
				configMap: searchRequest.configMap ?? {},
				vendorDetails: searchRequest.vendorDetails ?? []
			});
			// find the matched traveller class
			const matchedClass = searchRequest.travellers?.find(
				(t: any) =>
					t.value.replace(' Class', '').toLowerCase() === searchRequest.travellerClass.toLowerCase()
			);

			// check for a city the user already picked on the search-city screen —
			// without this, the API's default source/destination silently overwrites
			// whatever was just selected, every time this screen re-runs fetchScreenData
			const savedSource = sessionStorage.getItem('flights_selected_source');
			const savedDestination = sessionStorage.getItem('flights_selected_destination');

			// taking existing state and updating it with the new values
			flightSearchStore.update((s) => ({
				...s,
				source: savedSource
					? JSON.parse(savedSource)
					: { locationName: searchRequest.src.city, iataCode: searchRequest.src.iataCode },
				destination: savedDestination
					? JSON.parse(savedDestination)
					: { locationName: searchRequest.des.city, iataCode: searchRequest.des.iataCode },
				departureDate: new Date(Number(searchRequest.departDate)),
				isRoundTrip: searchRequest.isRoundTrip,
				returnDate:
					searchRequest.isRoundTrip && searchRequest.returnDate !== '0'
						? new Date(Number(searchRequest.returnDate))
						: undefined,
				adults: searchRequest.adultCount,
				children: searchRequest.childCount,
				infants: searchRequest.infantCount,
				travelClass: matchedClass?.key ?? searchRequest.travellerClass.toUpperCase(),
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

<div class="h-screen flex flex-col bg-base-100">
	<LandingAppBar />

	{#if $lceStore.isLoading}
		<div class="h-screen flex flex-col justify-center">
			<PrimaryLoader />
		</div>
	{:else if $lceStore.hasError && $lceStore.errorDetails != null}
		<ErrorHandling errorHandling={$lceStore.errorDetails} on:submit={handleRetry} />
	{:else if $lceStore.hasContent}
		<div class="flex-1 overflow-y-auto w-full bg-[#f0f0f5] pb-10">
			<div class="w-full px-6 pt-4 space-y-6 md:max-w-2xl md:mx-auto">
				<div class="flex items-center gap-1.5">
					<p class="sub-text text-[#676767]">
						Compare and fly:
						<span class="font-semibold text-[#f05325]">cleartrip</span>
						<span class="font-semibold text-[#3c5769]">EaseMyTrip</span>
					</p>
				</div>

				<FlightSearchBox />
				<PromoBanner />
				<UpcomingFlights />
				<RecentSearches />
			</div>
		</div>
	{/if}
</div>
