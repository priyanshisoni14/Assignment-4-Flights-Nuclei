<script lang="ts">
	import { onwardFlights } from '$flights/stores/flightListingStore.js';
	import FlightListCard from './FlightListCard.svelte';
</script>

<div class="space-y-3" role="list" aria-label="Flights">
	{#each $onwardFlights as segment (segment.segmentId)}
		<div role="listitem">
			<FlightListCard {segment} />
		</div>
	{:else}
		<p class="py-10 text-center text-sm text-[#6B6B6B]">No flights found for this search</p>
	{/each}
</div>
