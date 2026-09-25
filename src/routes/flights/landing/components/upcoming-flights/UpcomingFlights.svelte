<script>
	import { flights } from '$flights/FlightsData.js';
	import ChevronRightIcon from '$lib/flights-commons/icons/ChevronRightIcon.svelte';
	import FlightCard from './components/FlightCard.svelte';
</script>

<div>
	<div class="mb-3 flex items-center justify-between">
		<h2 class="m-0 flex items-center">
			<a
				href="/flights"
				class="flex items-center gap-1 text-xl font-semibold text-[#4EA1F1] hover:opacity-80"
			>
				Upcoming Flights
				<span class="[&>svg]:h-4 [&>svg]:w-4" aria-hidden="true"><ChevronRightIcon /></span>
			</a>
		</h2>
		<div class="flex items-center gap-2">
			<span
				class="rounded-full bg-[#D94C36] px-2.5 py-1 text-xs font-semibold leading-none text-white"
				aria-hidden="true"
			>
				new
			</span>
			<a href="/flights/web-check-in" class="text-base font-medium text-[#4EA1F1]">Web Check-in</a>
		</div>
	</div>

	<div
		class="scrollbar-hide flex snap-x snap-mandatory space-x-3 overflow-x-auto pb-1"
		role="list"
		aria-label="Upcoming flights"
	>
		{#each flights as flight}
			<div class="w-[90%] flex-shrink-0 snap-start" role="listitem">
				<FlightCard {...flight} />
			</div>
		{/each}
	</div>
</div>
