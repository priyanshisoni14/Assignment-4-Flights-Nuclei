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
	import ListingAppBar from './ListingAppBar.svelte';

	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Listing screen mounted');
		setLoadingLce();
		await fetchScreenData();
	});

	const fetchScreenData = async () => {
		// fetch data from api and set lce accordingly
		// if error, setErrorLce(response.error);
		// else, set data to lceStore and setContentLce();
		setContentLce();
	};

	function handleRetry() {
		setLoadingLce();
		fetchScreenData();
	}
</script>

<div
	class="h-screen flex flex-col
    [&_nav.bg-secondary]:!rounded-none"
>
	<ListingAppBar />

	{#if $lceStore.isLoading}
		<div class="h-screen flex flex-col justify-center">
			<PrimaryLoader />
		</div>
	{:else if $lceStore.hasError && $lceStore.errorDetails != null}
		<ErrorHandling errorHandling={$lceStore.errorDetails} on:submit={handleRetry} />
	{:else if $lceStore.hasContent}
		<div class="overflow-y-scroll w-full">
			<!-- TODO: Remove this inner div and add screen specific code -->
			<div class="h-screen flex flex-col bg-base-100" />
		</div>
	{/if}
</div>
