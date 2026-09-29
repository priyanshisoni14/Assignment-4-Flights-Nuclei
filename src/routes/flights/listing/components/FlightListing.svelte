<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { noFlightsMatchFilters, onwardFlights } from '$flights/stores/flightListingStore.js';
	import FlightListCard from './FlightListCard.svelte';
	import Button from '$lib/components/Button.svelte';

	const dispatch = createEventDispatcher<{ clear: void }>();
</script>

<div class="space-y-3" role="list" aria-label="Flights">
	{#if $noFlightsMatchFilters}
		<!-- server returned nothing for the applied filters -->
		<div class="flex flex-col items-center gap-3 py-8">
			<p class="text-sm text-[#6B6B6B]">No flights match your filters</p>
			<Button on:click={() => dispatch('clear')}>Clear filters</Button>
		</div>
	{:else if $onwardFlights.length === 0}
		<p class="py-8 text-center text-sm text-[#6B6B6B]">No flights found for this route and date</p>
	{:else}
		{#each $onwardFlights as segment (segment.segmentId)}
			<div role="listitem">
				<FlightListCard {segment} />
			</div>
		{/each}
	{/if}
</div>
