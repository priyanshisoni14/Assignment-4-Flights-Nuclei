<script lang="ts">
	import PrimaryLoader from '@CDNA-Technologies/svelte-vitals/components/primary-loader';
	import ListingScrollArea from './ListingScrollArea.svelte';
	import RoundTripFooter from './RoundTripFooter.svelte';
	import RoundTripListing from './RoundTripListing.svelte';
	import RoundTripTabs from './RoundTripTabs.svelte';

	export let isListLoading = false;

	// which direction is in front (tabs + the wide column). Only round trips need this,
	// so it lives here and a new search starts on the onward flights
	let activeLeg: 'onward' | 'return' = 'onward';
</script>

<RoundTripTabs {activeLeg} on:change={(e) => (activeLeg = e.detail)} />

<ListingScrollArea>
	{#if isListLoading}
		<div class="flex justify-center py-10">
			<PrimaryLoader />
		</div>
	{:else}
		<RoundTripListing {activeLeg} on:legchange={(e) => (activeLeg = e.detail)} />
	{/if}
</ListingScrollArea>

<RoundTripFooter />
