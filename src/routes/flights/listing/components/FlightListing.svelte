<script lang="ts">
	import { noFlightsMatchFilters, onwardFlights } from '$flights/stores/flightListingStore.js';
	import Button from '$lib/components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import FlightListCard from './FlightListCard.svelte';

	const dispatch = createEventDispatcher<{ clear: void }>();
</script>

<div class="space-y-3 md:space-y-4" role="list" aria-label="Flights">
	{#if $noFlightsMatchFilters}
		<!-- state1: filtered empty state, server returned nothing for the applied filters -->
		<div class="flex flex-col items-center gap-3 py-8 md:py-12">
			<p class="text-sm text-[#6B6B6B] md:text-base">No flights match your filters</p>
			<Button on:click={() => dispatch('clear')}>Clear filters</Button>
		</div>
	{:else if $onwardFlights.length === 0}
		<!-- state2: normal empty state, no flights found for this route and date -->
		<p class="py-8 text-center text-sm text-[#6B6B6B] md:py-12 md:text-base">
			No flights found for this route and date
		</p>
	{:else}
		{#each $onwardFlights as segment (segment.segmentId)}
			<!-- state3: normal state, flights found for this route and date -->
			<div role="listitem">
				<FlightListCard {segment} />
			</div>
		{/each}
	{/if}
</div>
