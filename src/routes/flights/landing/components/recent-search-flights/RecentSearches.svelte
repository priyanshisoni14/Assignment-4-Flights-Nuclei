<script>
	import { flights as RecentSearches } from '$flights/FlightsData.ts';
	import { flightsTranslationStore } from '$flights/i18n.js';
	import SearchItemCard from './components/SearchItemCard.svelte';
</script>

<div>
	<h2 class="mb-3 text-xl font-semibold text-black">
		{$flightsTranslationStore('flights.recent_searches')}
	</h2>

	<div
		class="scrollbar-hide flex snap-x snap-mandatory space-x-3 overflow-x-auto pb-1"
		role="list"
		aria-label="Recent searches"
	>
		{#each RecentSearches as search}
			<div class="w-[316px] flex-shrink-0 snap-start" role="listitem">
				<SearchItemCard from={search.from} to={search.to} dateRange={search.dateRange} />
			</div>
		{/each}
	</div>
</div>
