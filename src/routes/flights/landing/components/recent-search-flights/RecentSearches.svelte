<script>
	import { flights as RecentSearches } from '$flights/FlightsData.ts';
	import { flightsTranslationStore } from '$flights/i18n.js';
	import SearchItemCard from './components/SearchItemCard.svelte';
</script>

<div class="min-w-0">
	<h2 class="mb-3 text-xl font-semibold text-black">
		{$flightsTranslationStore('flights.recent_searches')}
	</h2>

	<!-- bleeds to the right screen edge; pr keeps the last card from sticking to the edge -->
	<div
		class="scrollbar-hide -mx-4 mb-4 flex snap-x snap-mandatory space-x-3 overflow-x-auto px-4 pb-1 scroll-pl-4 sm:-mx-6 sm:px-6 sm:scroll-pl-6 lg:-mx-10 lg:px-10 lg:scroll-pl-10 xl:-mx-16 xl:px-16 xl:scroll-pl-16"
		role="list"
		aria-label="Recent searches"
	>
		{#each RecentSearches as search}
			<div class="w-[19.75rem] max-w-full flex-shrink-0 snap-start lg:w-96" role="listitem">
				<SearchItemCard from={search.from} to={search.to} dateRange={search.dateRange} />
			</div>
		{/each}
	</div>
</div>
