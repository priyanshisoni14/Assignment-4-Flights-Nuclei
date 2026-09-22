<script lang="ts">
	import { page } from '$app/stores';
	import AppBar from '@CDNA-Technologies/svelte-vitals/components/appbar';
	import { tick, onMount } from 'svelte';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { getPopularCities, getAirportSearchResults } from '$flights/flights.api.js';
	import { popularCities as staticFallbackCities } from './cityData.js';

	const appBarTitle = $page.url.searchParams.get('title') ?? 'Search City';
	const searchType = $page.url.searchParams.get('type');

	type Airport = { iataCode: string; city: string; name: string };

	let airports: Airport[] = [];
	let isSearching = false;
	let searchText = '';
	let debounceTimer: ReturnType<typeof setTimeout>;

	onMount(async () => {
		const result = await getPopularCities();
		if (!result.hasError() && result.response?.airportList) {
			airports = result.response.airportList;
		} else {
			// fall back to static list only if the live call fails
			airports = staticFallbackCities.map((c: any) => ({
				iataCode: c.airportDetails.split(' ')[0],
				city: c.locationName,
				name: c.airportDetails
			}));
		}
	});

	function handleSearchInput() {
		clearTimeout(debounceTimer);
		if (searchText.trim().length < 2) return;
		debounceTimer = setTimeout(async () => {
			isSearching = true;
			const result = await getAirportSearchResults(searchText);
			isSearching = false;
			if (!result.hasError() && result.response?.airportList) {
				airports = result.response.airportList;
			}
		}, 300);
	}

	const handleBackClick = () => history.back();

	const handleAirportSelect = async (airport: Airport) => {
		const newSelection = { locationName: airport.city, iataCode: airport.iataCode };
		const current = $flightSearchStore;
		const otherCode =
			searchType === 'source' ? current.destination.iataCode : current.source.iataCode;

		if (newSelection.iataCode === otherCode) {
			alert('Source and Destination cannot be the same.');
			return;
		}

		flightSearchStore.update((store) => {
			if (searchType === 'source') store.source = newSelection;
			else if (searchType === 'destination') store.destination = newSelection;
			return store;
		});

		await tick();
		history.back();
	};
</script>

<div class="flex flex-col h-screen bg-base-100">
	<AppBar
		title={appBarTitle}
		height="80px"
		enableZIndex
		showBackButton
		onBackButtonClick={handleBackClick}
	/>

	<div class="p-4">
		<input
			type="text"
			bind:value={searchText}
			on:input={handleSearchInput}
			placeholder="Enter City/Airport Name"
			class="w-full h-12 pl-4 pr-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
		/>
	</div>

	<div class="flex-1 overflow-y-auto">
		<h3 class="p-4 heading-3">
			{searchText.trim().length >= 2 ? 'Search results' : 'Popular cities'}
		</h3>
		{#if isSearching}
			<p class="px-4 text-sm base-content-light-60">Searching...</p>
		{/if}
		<div class="divide-y divide-gray-200">
			{#each airports as airport}
				<button class="w-full text-left" on:click={() => handleAirportSelect(airport)}>
					<div class="p-4">
						<p class="card-sub-heading">
							{airport.city} <span class="text-xs">({airport.iataCode})</span>
						</p>
						<p class="card-content base-content-light">{airport.name}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
