<!-- src/routes/flights/flights-common/recent-search-flights/RecentSearches.svelte -->
<script>
	import { flights as RecentSearches } from '$flights/FlightsData.js';
	import SearchItemCard from './components/SearchItemCard.svelte';
</script>

<div class="mb-4 px-4">
	<h2 class="heading-2">Recent Searches</h2>
</div>

<div class="flex flex-col space-y-2 bg-base-100 divide-y divide-gray-200">
	{#each RecentSearches as search}
		<SearchItemCard from={search.from} to={search.to} dateRange={search.dateRange} />
	{/each}
</div>
