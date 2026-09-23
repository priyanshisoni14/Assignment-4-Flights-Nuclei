<script>
	import { flights as RecentSearches } from '$flights/FlightsData.js';
	import SearchItemCard from './components/SearchItemCard.svelte';
</script>

<div>
	<h2 class="heading-2 mb-3">Recent Searches</h2>

	<div class="flex space-x-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
		{#each RecentSearches as search}
			<div class="flex-shrink-0 w-[85%] snap-start">
				<SearchItemCard {...search} />
			</div>
		{/each}
	</div>
</div>
