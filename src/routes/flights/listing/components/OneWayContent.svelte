<script lang="ts">
	import PrimaryLoader from '@CDNA-Technologies/svelte-vitals/components/primary-loader';
	import CompareBanner from './CompareBanner.svelte';
	import FlightListing from './FlightListing.svelte';
	import ListingFilterBar from './ListingFilterBar.svelte';
	import ListingScrollArea from './ListingScrollArea.svelte';

	// true while a chip change is refetching: only the list shows the loader, the filter bar stays
	export let isListLoading = false;
</script>

<ListingScrollArea>
	<!-- change / clear are forwarded to Listing.svelte, which refetches -->
	<ListingFilterBar on:change />
	<CompareBanner />
	{#if isListLoading}
		<div class="flex justify-center py-10">
			<PrimaryLoader />
		</div>
	{:else}
		<FlightListing on:clear />
	{/if}
</ListingScrollArea>
