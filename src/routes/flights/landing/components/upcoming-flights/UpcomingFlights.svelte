<script>
	import { flights } from '$flights/FlightsData.js';
	import ChevronRightIcon from '$lib/flights-commons/icons/ChevronRightIcon.svelte';
	import FlightCard from './components/FlightCard.svelte';
</script>

<div>
	<div class="flex justify-between items-center mb-3">
		<a href="/flights" class="flex items-center gap-1 heading-2 hover:opacity-80">
			Upcoming Flights
			<span class="[&>svg]:w-4 [&>svg]:h-4"><ChevronRightIcon /></span>
		</a>
		<div class="flex items-center gap-1.5">
			<span
				class="bg-red-500 text-white text-[9px] font-semibold px-1.5 py-1.5 rounded-full leading-none"
				>New</span
			>
			<span class="sub-text font-medium">Web Check-in</span>
		</div>
	</div>

	<div class="flex space-x-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
		{#each flights as flight}
			<div class="flex-shrink-0 w-[90%] snap-start">
				<FlightCard {...flight} />
			</div>
		{/each}
	</div>
</div>
