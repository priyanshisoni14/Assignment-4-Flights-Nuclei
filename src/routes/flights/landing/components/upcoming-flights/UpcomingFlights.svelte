<script>
	import { base } from '$app/paths';
	import { flights } from '$flights/FlightsData.ts';
	import { flightsTranslationStore } from '$flights/i18n.js';
	import ChevronRightIcon from '$lib/flights-commons/icons/ChevronRightIcon.svelte';
	import FlightCard from './components/FlightCard.svelte';
</script>

<div class="min-w-0">
	<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
		<h2 class="m-0 flex items-center">
			<a
				href="{base}/flights"
				class="flex items-center gap-1 text-xl font-semibold text-[#4EA1F1] hover:opacity-80"
			>
				{$flightsTranslationStore('flights.upcoming_flights')}
				<span class="[&>svg]:h-4 [&>svg]:w-4" aria-hidden="true"><ChevronRightIcon /></span>
			</a>
		</h2>
		<div class="flex items-center gap-2">
			<span
				class="rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold leading-none text-white"
				aria-hidden="true"
			>
				{$flightsTranslationStore('flights.new_badge_lowercase')}
			</span>
			<a href="{base}/flights/web-check-in" class="text-base font-medium text-[#4EA1F1]"
				>{$flightsTranslationStore('flights.web_check_in')}</a
			>
		</div>
	</div>

	<div
		class="scrollbar-hide -mx-4 flex snap-x snap-mandatory space-x-3 overflow-x-auto px-4 pb-1 scroll-pl-4 sm:-mx-6 sm:px-6 sm:scroll-pl-6 lg:-mx-10 lg:px-10 lg:scroll-pl-10 xl:-mx-16 xl:px-16 xl:scroll-pl-16"
		role="list"
		aria-label="Upcoming flights"
	>
		{#each flights as flight}
			<div class="w-[19.75rem] max-w-full flex-shrink-0 snap-start lg:w-96" role="listitem">
				<FlightCard {...flight} />
			</div>
		{/each}
	</div>
</div>
