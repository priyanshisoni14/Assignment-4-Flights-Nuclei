<script lang="ts">
	import { callGetFlightsSearchListV2 } from '$flights/api/flights-api.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { resetFlightListing, setFlightListing } from '$flights/stores/flightListingStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import type { FlightListingResponse } from '$lib/flights-commons/messages/flights-listing-msg.js';
	import PrimaryLoader from '@CDNA-Technologies/svelte-vitals/components/primary-loader';
	import {
		ErrorHandling,
		lceStore,
		setContentLce,
		setErrorLce,
		setLoadingLce
	} from '@CDNA-Technologies/svelte-vitals/error-handling';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import CompareBanner from './CompareBanner.svelte';
	import FlightListing from './FlightListing.svelte';
	import ListingAppBar from './ListingAppBar.svelte';
	import ListingFilterBar from './ListingFilterBar.svelte';
	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Listing screen mounted');
		setLoadingLce();
		await fetchScreenData();
	});

	const fetchScreenData = async () => {
		// resets the store to initial state when starting a new search
		resetFlightListing();

		// get the search and config store values
		//get - manually reads the store once and stores its snapshot in a variable
		// required cause need snapshot of of search data when making api call
		const searchstore = get(flightSearchStore);
		const config = get(flightConfigStore);

		// for label the backend expects, e.g. "Economy Class"
		const travellerClass = config.travellers.find((t: any) => t.key === searchstore.travelClass);

		// a-airport object
		// convert the search store values to the api expected format
		const toAirport = (a: { iataCode: string; locationName: string; airportName: string }) => ({
			iataCode: a.iataCode,
			city: a.locationName,
			name: a.airportName,
			countryCode: 'IN',
			iconUrl: ''
		});

		const result = await callGetFlightsSearchListV2({
			src: toAirport(searchstore.source),
			des: toAirport(searchstore.destination),
			// callGetFlightsSearchListV2 reformats this to DD-MM-YYYY itself.
			// YYYY-MM-DD is parsed as local time, so the date won't shift a day.
			departDate: dayjs(searchstore.departureDate).format('YYYY-MM-DD'),
			returnDate:
				searchstore.isRoundTrip && searchstore.returnDate
					? dayjs(searchstore.returnDate).format('YYYY-MM-DD')
					: '',
			travellerClass: {
				key: searchstore.travelClass,
				value: travellerClass?.value ?? searchstore.travelClass
			},
			passenger: {
				adultCount: searchstore.adults,
				childCount: searchstore.children,
				infantCount: searchstore.infants
			},

			is_round_trip: searchstore.isRoundTrip,
			partnerCountry: config.partnerCountry ?? 'IN',
			fareType: ''
		});

		if (result.hasError()) {
			setErrorLce(result.error);
			return;
		}
		// set the flight listing store with api response
		setFlightListing(result.response as FlightListingResponse);
		setContentLce();
	};

	function handleRetry() {
		setLoadingLce();
		fetchScreenData();
	}
</script>

<div
	class="h-screen flex flex-col
    [&_nav.bg-secondary]:!rounded-none"
>
	<ListingAppBar />

	{#if $lceStore.isLoading}
		<div class="h-screen flex flex-col justify-center">
			<PrimaryLoader />
		</div>
	{:else if $lceStore.hasError && $lceStore.errorDetails != null}
		<ErrorHandling errorHandling={$lceStore.errorDetails} on:submit={handleRetry} />
	{:else if $lceStore.hasContent}
		<main class="flex-1 overflow-y-auto w-full bg-[#f0f0f5]">
			<div class="w-full space-y-3 px-6 pt-4 md:mx-auto md:max-w-2xl">
				<ListingFilterBar />
				<CompareBanner />
				<FlightListing />
			</div>
		</main>
	{/if}
</div>
