<script lang="ts">
	import { callGetFlightsSearchListV2, getFareCalendar } from '$flights/api/flights-api.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { resetFlightListing, setFlightListing } from '$flights/stores/flightListingStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import type {
		CalendarDate,
		FareDetail
	} from '$lib/flights-commons/messages/flights-fare-calendar-msg.js';
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
	import FareCalendar from './FareCalendar.svelte';
	import FlightListing from './FlightListing.svelte';
	import ListingAppBar from './ListingAppBar.svelte';
	import ListingFilterBar from './ListingFilterBar.svelte';

	let fares: FareDetail[] = [];
	let fareLoading = true;

	// single source of truth: the selected calendar date is the search's departure date
	$: departure = dayjs($flightSearchStore.departureDate);
	$: selectedDate = {
		year: departure.year(),
		month: departure.month() + 1,
		day: departure.date()
	} as CalendarDate;

	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Listing screen mounted');
		setLoadingLce();
		fetchFareCalendar(); // not awaited: a fare calendar failure must not block the listing
		await fetchScreenData();
	});

	const toCalendarDate = (d: dayjs.Dayjs): CalendarDate => ({
		year: d.year(),
		month: d.month() + 1,
		day: d.date()
	});

	const fetchFareCalendar = async () => {
		fareLoading = true;
		const searchstore = get(flightSearchStore);

		const start = dayjs();
		const defaultEnd = start.add(15, 'day');
		const depart = dayjs(searchstore.departureDate);
		// make sure the searched date is always inside the requested window
		const end = depart.isAfter(defaultEnd) ? depart.add(7, 'day') : defaultEnd;

		const result = await getFareCalendar({
			categoryId: 7,
			startDate: toCalendarDate(start),
			endDate: toCalendarDate(end),
			travellers: {
				adultCount: searchstore.adults,
				childCount: searchstore.children,
				infantCount: searchstore.infants
			},
			additionalInfo: {
				sourceCode: searchstore.source.iataCode,
				destCode: searchstore.destination.iataCode,
				isRoundTrip: String(searchstore.isRoundTrip)
			}
		});

		fares =
			!result.hasError() && result.response?.enabled
				? result.response.onwardJourneyFareDetails ?? []
				: [];
		fareLoading = false;
	};

	const handleDateSelect = (e: CustomEvent<CalendarDate>) => {
		const { year, month, day } = e.detail;
		if (year === selectedDate.year && month === selectedDate.month && day === selectedDate.day) {
			return;
		}
		// adjust the value type if your store keeps departureDate as a string instead of a Date
		flightSearchStore.update((s) => ({ ...s, departureDate: new Date(year, month - 1, day) }));
		setLoadingLce();
		fetchScreenData();
	};

	const fetchScreenData = async () => {
		// resets the store to initial state when starting a new search
		resetFlightListing();

		// get - reads the store once; we need a snapshot of the search data for the api call
		const searchstore = get(flightSearchStore);
		const config = get(flightConfigStore);

		// label the backend expects, e.g. "Economy Class"
		const travellerClass = config.travellers.find((t: any) => t.key === searchstore.travelClass);

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

<div class="h-screen flex flex-col [&_nav.bg-secondary]:!rounded-none">
	<ListingAppBar />

	<!-- outside the lce branches, so it stays mounted while the listing reloads -->
	{#if fareLoading || fares.length > 0}
		<div class="flex justify-center bg-[#f0f0f5]">
			<FareCalendar {fares} {selectedDate} loading={fareLoading} on:select={handleDateSelect} />
		</div>
	{/if}

	{#if $lceStore.isLoading}
		<div class="flex flex-1 flex-col justify-center">
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
