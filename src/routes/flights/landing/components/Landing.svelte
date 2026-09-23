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
	import LandingAppBar from './LandingAppBar.svelte';
	import RecentSearches from './recent-search-flights/RecentSearches.svelte';
	import UpcomingFlights from './upcoming-flights/UpcomingFlights.svelte';

	const TypedPrimaryLoader = PrimaryLoader as unknown as typeof SvelteComponentTyped;
	const TypedErrorHandling = ErrorHandling as unknown as typeof SvelteComponentTyped;
	let hasFetchedConfig = false;
	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Landing screen mounted');
		setLoadingLce();
		await fetchScreenData();
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
			// taking existing state and updating it with the new values
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
				travelClass: matchedClass?.key ?? searchRequest.travellerClass.toUpperCase(),
				nonStopOnly: searchRequest.configMap?.NON_STOP_FLIGHT_LANDING === 'true'
			}));
		}

		hasFetchedConfig = true;
		setContentLce();
	};
</script>

<div class="h-screen flex flex-col bg-base-100">
	<LandingAppBar />

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
		<div class="flex-1 overflow-y-auto w-full bg-gray-100 pb-10">
			<div class="px-4 pt-4 space-y-6">
				<FlightSearchBox />
				<UpcomingFlights />
				<RecentSearches />
			</div>
		</div>
	{/if}
</div>
