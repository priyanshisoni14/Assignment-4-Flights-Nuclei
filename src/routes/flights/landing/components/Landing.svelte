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
	import type { SvelteComponentTyped } from 'svelte';
	import { onMount } from 'svelte';
	import { hasFetchedConfig } from '../appState.js';
	import LandingAppBar from './LandingAppBar.svelte';
	import RecentSearches from './recent-search-flights/RecentSearches.svelte';
	import UpcomingFlights from './upcoming-flights/UpcomingFlights.svelte';

	const TypedLandingAppBar = LandingAppBar as unknown as typeof SvelteComponentTyped;
	const TypedPrimaryLoader = PrimaryLoader as unknown as typeof SvelteComponentTyped;
	const TypedErrorHandling = ErrorHandling as unknown as typeof SvelteComponentTyped;

	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Landing screen mounted');
		setLoadingLce();
		await fetchScreenData();
	});

	function handleRetry() {
		setLoadingLce();
		fetchScreenData();
	}

	const fetchScreenData = async () => {
		if ($hasFetchedConfig) {
			setContentLce();
			return;
		}

		const configResult = await fetchFlightsCoreConfig();

		if (configResult.hasError()) {
			setErrorLce(configResult.error);
			return;
		}

		const searchRequest = configResult.response?.searchRequest;
		if (searchRequest) {
			flightConfigStore.set({
				guests: searchRequest.guests ?? [],
				travellers: searchRequest.travellers ?? [],
				configMap: searchRequest.configMap ?? {},
				vendorDetails: searchRequest.vendorDetails ?? []
			});

			flightSearchStore.update((s) => ({
				...s,
				source: { locationName: searchRequest.src.city, iataCode: searchRequest.src.iataCode },
				destination: { locationName: searchRequest.des.city, iataCode: searchRequest.des.iataCode },
				departureDate: new Date(Number(searchRequest.departDate)),
				isRoundTrip: searchRequest.isRoundTrip,
				returnDate:
					searchRequest.isRoundTrip && searchRequest.returnDate !== '0'
						? new Date(Number(searchRequest.returnDate))
						: undefined,
				adults: searchRequest.adultCount,
				children: searchRequest.childCount,
				infants: searchRequest.infantCount,
				travelClass: searchRequest.travellerClass,
				nonStopOnly: searchRequest.configMap?.NON_STOP_FLIGHT_LANDING === 'true'
			}));
		}

		hasFetchedConfig.set(true);
		setContentLce();
	};
</script>

<div class="h-screen flex flex-col bg-base-100">
	<svelte:component this={TypedLandingAppBar} />

	{#if $lceStore.isLoading}
		<div class="h-screen flex flex-col justify-center">
			<svelte:component this={TypedPrimaryLoader} />
		</div>
	{:else if $lceStore.hasError && $lceStore.errorDetails != null}
		<svelte:component
			this={TypedErrorHandling}
			errorHandling={$lceStore.errorDetails}
			on:submit={handleRetry}
		/>
	{:else if $lceStore.hasContent}
		<div class="flex-1 overflow-y-auto w-full bg-base-200 pb-10">
			<div class="px-4 pt-3">
				<FlightSearchBox />
				<UpcomingFlights />
				<RecentSearches />
			</div>
		</div>
	{/if}
</div>
