<script lang="ts">
	import { page } from '$app/stores';
	import { getAirportSearchResults, getPopularCities } from '$flights/api/flights-api.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import AppBar from '@CDNA-Technologies/svelte-vitals/components/appbar';
	import SearchBar from '@CDNA-Technologies/svelte-vitals/components/search-bar';
	import { onMount, tick } from 'svelte';
	import type { Airport } from '../types.js';
	import CityCard from './CityCard.svelte';
	import { popularCities as staticFallbackCities } from '../cityData.js';

	const appBarTitle = $page.url.searchParams.get('title') ?? 'Search City';
	const searchType = $page.url.searchParams.get('type');

	let airports: Airport[] = [];
	let isSearching = false;
	let searchText = '';

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

	async function handleSearchChange(text: string) {
		isSearching = true;
		const result = await getAirportSearchResults(text);
		isSearching = false;
		if (!result.hasError() && result.response?.airportList) {
			airports = result.response.airportList;
		}
	}

	const handleBackClick = () => history.back();

	const handleAirportSelect = async (airport: Airport) => {
		const newSelection = {
			locationName: airport.city,
			iataCode: airport.iataCode,
			airportName: airport.name
		};
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
	<div class="appbar-flights">
		<AppBar
			title={appBarTitle}
			height="80px"
			enableZIndex
			showBackButton
			onBackButtonClick={handleBackClick}
		/>
	</div>

	<div class="p-4 md:p-6 md:max-w-2xl md:mx-auto">
		<SearchBar
			placeholder="Enter City/Airport Name"
			padding="p-0"
			bind:searchText
			debounceWaitTime={300}
			minCharacterRequiredForSearch={2}
			onSearchChange={handleSearchChange}
		/>
	</div>

	<div class="flex-1 overflow-y-auto md:max-w-2xl md:mx-auto md:w-full">
		<h3 class="p-4 md:px-6 heading-3">
			{searchText.trim().length >= 2 ? 'Search results' : 'Popular cities'}
		</h3>
		{#if isSearching}
			<p class="px-4 md:px-6 text-sm base-content-light-60">Searching...</p>
		{/if}
		<div class="divide-y divide-gray-200">
			{#each airports as airport}
				<CityCard {airport} on:select={(e) => handleAirportSelect(e.detail)} />
			{/each}
		</div>
	</div>
</div>

<style>
	.appbar-flights :global(nav.bg-secondary) {
		background-color: #032f49;
	}
</style>
