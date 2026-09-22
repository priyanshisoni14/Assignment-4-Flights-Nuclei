<script lang="ts">
	import { ApiUtil } from '@CDNA-Technologies/svelte-vitals/api-util';
	import PrimaryLoader from '@CDNA-Technologies/svelte-vitals/components/primary-loader';
	import {
		ErrorHandling,
		lceStore,
		setContentLce,
		setLoadingLce
	} from '@CDNA-Technologies/svelte-vitals/error-handling';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { onMount } from 'svelte';
	import LandingAppBar from './LandingAppBar.svelte';
	import PromoBanner from './PromoBanner.svelte';
	import TrendingRoutes from './TrendingRoutes.svelte';
	import FlightSearchBox from '$lib/flights-commons/flight-search-box/FlightSearchBox.svelte';
	import { fetchFlightsCoreConfig } from '$flights/flights.api.js';
	import { setErrorLce } from '@CDNA-Technologies/svelte-vitals/error-handling';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';

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

		setContentLce();
	};
</script>

<div class="h-screen flex flex-col">
	<LandingAppBar />

	{#if $lceStore.isLoading}
		<div class="h-screen flex flex-col justify-center">
			<PrimaryLoader />
		</div>
	{:else if $lceStore.hasError && $lceStore.errorDetails != null}
		<ErrorHandling errorHandling={$lceStore.errorDetails} on:submit={handleRetry} />
	{:else if $lceStore.hasContent}
		<div class="overflow-y-scroll w-full bg-primary">
			<div class="bg-base-100 rounded-t-2xl pt-2 pb-6">
				<FlightSearchBox />
				<PromoBanner />
				<TrendingRoutes />
			</div>
		</div>
	{/if}
</div>
