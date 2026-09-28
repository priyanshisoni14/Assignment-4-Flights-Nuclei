<script lang="ts">
	import { callGetFlightsSearchListV2 } from '$flights/api/flights-api.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { resetFlightListing, setFlightListing } from '$flights/stores/flightListingStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
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
	import ListingAppBar from './ListingAppBar.svelte';
	import ListingFilterBar from './ListingFilterBar.svelte';
	import FlightListing from './FlightListing.svelte';

	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Listing screen mounted');
		setLoadingLce();
		await fetchScreenData();
	});

	const fetchScreenData = async () => {
		resetFlightListing();

		const s = get(flightSearchStore);
		const config = get(flightConfigStore);

		// the human label the backend expects, e.g. "Economy Class"
		const travellerClass = config.travellers.find((t: any) => t.key === s.travelClass);

		const toAirport = (a: { iataCode: string; locationName: string; airportName: string }) => ({
			iataCode: a.iataCode,
			city: a.locationName,
			name: a.airportName,
			countryCode: 'IN',
			iconUrl: ''
		});

		const result = await callGetFlightsSearchListV2({
			src: toAirport(s.source),
			des: toAirport(s.destination),
			// callGetFlightsSearchListV2 reformats this to DD-MM-YYYY itself.
			// YYYY-MM-DD is parsed as local time, so the date won't shift a day.
			departDate: dayjs(s.departureDate).format('YYYY-MM-DD'),
			returnDate: s.isRoundTrip && s.returnDate ? dayjs(s.returnDate).format('YYYY-MM-DD') : '',
			travellerClass: {
				key: s.travelClass,
				value: travellerClass?.value ?? s.travelClass
			},
			passenger: {
				adultCount: s.adults,
				childCount: s.children,
				infantCount: s.infants
			},
			appliedSortFilter: [
				{
					tabId: 'DUMMY',
					sortId: '1',
					filtersList: [
						{ filterId: 1, appliedFilterValueList: { filterValues: ['0'] } },
						{ filterId: 2, appliedFilterValueList: { filterValues: ['0'] } }
					]
				}
			],
			is_round_trip: s.isRoundTrip,
			partnerCountry: config.partnerCountry ?? 'IN',
			fareType: ''
		});

		if (result.hasError()) {
			setErrorLce(result.error);
			return;
		}

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
