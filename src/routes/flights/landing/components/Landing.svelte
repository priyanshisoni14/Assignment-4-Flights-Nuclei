<script lang="ts">
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

	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Landing screen mounted');
		setLoadingLce();
		await fetchScreenData();
	});

	const fetchScreenData = async () => {
		// TODO: call fetchFlightsCoreConfig() here once API is wired
		setContentLce();
	};

	function handleRetry() {
		setLoadingLce();
		fetchScreenData();
	}
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
