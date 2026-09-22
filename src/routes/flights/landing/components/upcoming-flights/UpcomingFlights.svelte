<!-- it is static as upcoming flights functionality is not implemented yet -->
<script>
	import { flights } from '$flights/FlightsData.js';
	import FlightCard from './components/FlightCard.svelte';
</script>

<div class="bg-base-100 p-4">
	<div class="flex justify-between items-center mb-4">
		<h2 class="heading-2">Upcoming Flights</h2>
		<a href="/flights" class="text-primary heading-3 hover:underline">VIEW ALL</a>
	</div>

	<div class="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
		{#each flights as flight}
			<div class="flex-shrink-0 w-11/12 snap-start">
				<FlightCard {...flight} />
			</div>
		{/each}
	</div>
</div>
