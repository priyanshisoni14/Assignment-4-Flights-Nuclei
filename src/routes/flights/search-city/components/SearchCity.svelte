<script lang="ts">
	import { page } from '$app/stores';
	import { flightsTranslationStore } from '$flights/i18n';
	import { getAirportSearchResults, getPopularCities } from '$flights/api/flights-api.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import HistoryIcon from '$lib/flights-commons/icons/HistoryIcon.svelte';
	import LocationPinIcon from '$lib/flights-commons/icons/LocationPinIcon.svelte';
	import AppBar from '@CDNA-Technologies/svelte-vitals/components/appbar';
	import SearchBar from '@CDNA-Technologies/svelte-vitals/components/search-bar';
	import { onMount, tick } from 'svelte';
	import { popularCities as staticFallbackCities } from '../cityData.js';
	import type { Airport } from '../types.js';
	import CityCard from './CityCard.svelte';

	const RECENT_SEARCHES_KEY = 'flights_recent_airports';
	const MAX_RECENT_SEARCHES = 6;

	//extract the title from the url
	const appBarTitle = $page.url.searchParams.get('title') ?? 'Search City';
	const searchType = $page.url.searchParams.get('type');

	// api result is stored here
	let airports: Airport[] = [];
	let recentAirports: Airport[] = [];
	let isSearching = false;
	let searchText = '';

	function loadRecentAirports(): Airport[] {
		try {
			const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
			return raw ? (JSON.parse(raw) as Airport[]) : [];
		} catch {
			return [];
		}
	}

	function saveRecentAirport(airport: Airport) {
		const existing = loadRecentAirports().filter((a) => a.iataCode !== airport.iataCode);
		const updated = [airport, ...existing].slice(0, MAX_RECENT_SEARCHES);
		try {
			localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
		} catch {
			// storage unavailable, ignore
		}
		recentAirports = updated;
	}

	onMount(async () => {
		recentAirports = loadRecentAirports();

		const result = await getPopularCities();
		const airportList = (result.response as { airportList?: Airport[] } | undefined)?.airportList;
		// if the api call succeeds and returns a result
		if (!result.hasError() && airportList) {
			airports = airportList;
		} else {
			// fall back to static list only if the live call fails
			airports = staticFallbackCities.map((c: any) => ({
				iataCode: c.airportDetails.split(' ')[0],
				city: c.locationName,
				name: c.airportDetails
			}));
		}
	});

	// when the user types in the search box
	async function handleSearchChange(text: string) {
		isSearching = true;
		const result = await getAirportSearchResults(text);
		isSearching = false;
		const airportList = (result.response as { airportList?: Airport[] } | undefined)?.airportList;
		if (!result.hasError() && airportList) {
			airports = airportList;
		}
	}

	// navigate back to the previous screen
	const handleBackClick = () => history.back();

	// when an airport is selected from the list
	const handleAirportSelect = async (airport: Airport) => {
		const newSelection = {
			locationName: airport.city,
			iataCode: airport.iataCode,
			airportName: airport.name
		};
		const current = $flightSearchStore;
		// get the other end of the trip
		const otherCode =
			searchType === 'source' ? current.destination.iataCode : current.source.iataCode;
		// if the user selects the same airport as the other end of the trip give alert
		if (newSelection.iataCode === otherCode) {
			alert($flightsTranslationStore('flights.same_source_destination_alert'));
			return;
		}

		saveRecentAirport(airport);

		// update the store with the new selection
		flightSearchStore.update((store) => {
			if (searchType === 'source') store.source = newSelection;
			else if (searchType === 'destination') store.destination = newSelection;
			return store;
		});

		// persist across a hard reload / native-bridge navigation back to Landing
		sessionStorage.setItem(
			searchType === 'source' ? 'flights_selected_source' : 'flights_selected_destination',
			JSON.stringify(newSelection)
		);

		// waits until svelte has updated the store
		await tick();
		history.back();
	};

	$: isSearchActive = searchText.trim().length >= 2;
</script>

<div class="flex h-screen w-full flex-col overflow-x-hidden bg-white">
	<div class="w-full [&_nav]:!bg-[#112e47]">
		<AppBar
			title={appBarTitle}
			height="80px"
			enableZIndex
			showBackButton
			onBackButtonClick={handleBackClick}
		/>
	</div>

	<div class="w-full px-6 pt-6 md:mx-auto md:max-w-2xl bg-[#F0F0F5]">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="block">
			<span class="sr-only">Search for a city or airport</span>
			<div class="rounded-2xl shadow-md">
				<SearchBar
					placeholder={$flightsTranslationStore('flights.enter_city_placeholder')}
					padding="p-0"
					bind:searchText
					debounceWaitTime={300}
					minCharacterRequiredForSearch={2}
					onSearchChange={handleSearchChange}
					textStyle="font-size: 1rem; color: #101010;"
				/>
			</div>
		</label>
	</div>

	<div class="w-full flex-1 overflow-y-auto md:mx-auto md:max-w-2xl">
		{#if isSearching}
			<div class="h-1 w-full overflow-hidden bg-[#F0F0F5]" role="status" aria-live="polite">
				<div class="h-full w-1/3 animate-pulse rounded-full bg-primary" />
				<span class="sr-only">{$flightsTranslationStore(
					'flights.searching'
				)}</span>
			</div>
		{/if}

		{#if isSearchActive}
			<div class="flex w-full items-center gap-2 bg-[#F0F0F5] px-6 py-3" aria-hidden="true">
				<span class="text-base font-bold text-black">{$flightsTranslationStore(
					'flights.search_results'
				)}</span>
			</div>
			<div role="list" aria-label="Search results">
				{#each airports as airport}
					<div role="listitem">
						<CityCard {airport} on:select={(e) => handleAirportSelect(e.detail)} />
					</div>
				{/each}
			</div>
		{:else}
			{#if recentAirports.length > 0}
				<div class="flex w-full items-center bg-[#F0F0F5] px-6 py-3" aria-hidden="true">
					<span class="flex-shrink-0 [&>svg]:h-10 [&>svg]:w-10 [&_svg>rect]:!fill-transparent">
						<HistoryIcon />
					</span>
					<span class="text-base font-bold text-black">{$flightsTranslationStore(
						'flights.recent_searches'
					)}</span>
				</div>
				<div role="list" aria-label="Recent searches">
					{#each recentAirports as airport}
						<div role="listitem">
							<CityCard {airport} on:select={(e) => handleAirportSelect(e.detail)} />
						</div>
					{/each}
				</div>
			{/if}

			<div class="flex w-full items-center gap-2 bg-[#F0F0F5] px-6 py-3" aria-hidden="true">
				<span class="flex-shrink-0 text-gray-600 [&>svg]:h-6 [&>svg]:w-6">
					<LocationPinIcon />
				</span>
				<span class="text-base font-bold text-black">{$flightsTranslationStore(
					'flights.popular_cities'
				)}</span>
			</div>
			<div role="list" aria-label="Popular cities">
				{#each airports as airport}
					<div role="listitem">
						<CityCard {airport} on:select={(e) => handleAirportSelect(e.detail)} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
