<script lang="ts">
	import {
		filteredFlights,
		hasFlights,
		noFlightsMatchFilters,
		clearQuickFilters
	} from '$flights/stores/flightListingStore.js';
	import FlightListCard from './FlightListCard.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="space-y-3" role="list" aria-label="Flights">
	<!-- Empty state: no flights available -->
	{#if !$hasFlights}
		<p class="py-8 text-center text-sm text-[#6B6B6B]">No flights found for this route and date</p>
		<!-- Empty state: filters removed all flights clear filters button-->
	{:else if $noFlightsMatchFilters}
		<div class="flex flex-col items-center gap-3 py-8">
			<p class="text-sm text-[#6B6B6B]">No flights match your filters</p>
			<Button on:click={clearQuickFilters}>Clear filters</Button>
		</div>
	{:else}
		<!-- Display filtered flights -->
		{#each $filteredFlights as segment (segment.segmentId)}
			<div role="listitem">
				<FlightListCard {segment} />
			</div>
		{/each}
	{/if}
</div>
