<script lang="ts">
	import { callGetFlightsSearchListV2, getFareCalendar } from '$flights/api/flights-api.js';
	import {
		fareCalendarStore,
		resetFareCalendar,
		setFareCalendar,
		setFareCalendarLoading
	} from '$flights/stores/fareCalendarStore.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import {
		clearQuickFilters,
		quickFilters,
		resetFlightListing,
		setFlightListing,
		setNoFlights
	} from '$flights/stores/flightListingStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import type { CalendarDate } from '$lib/flights-commons/messages/flights-fare-calendar-msg.js';
	import type { FlightListingResponse } from '$lib/flights-commons/messages/flights-listing-msg.js';
	import { buildAppliedSortFilter } from '$lib/flights-commons/utils/flight-filter-utils.js';
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

	// single source of truth: the selected calendar date is the search's departure date
	$: departure = dayjs($flightSearchStore.departureDate);
	$: selectedDate = {
		year: departure.year(),
		month: departure.month() + 1,
		day: departure.date()
	} as CalendarDate;

	// true only while a chip change is refetching: loader shows in the list area,
	// the filter bar stays mounted
	let isListLoading = false;
	// only the latest request is allowed to update the screen
	// so there is no race condition between the listing and the calendar
	// even if there is a stale api call only new data is shown
	let requestCounter = 0;

	onMount(async () => {
		NucleiLogger.logInfo('Flights', 'Listing screen mounted');
		resetFlightListing(); // clear flights + chips from any previous search
		resetFareCalendar(); // clear fares from any previous search
		setLoadingLce();
		fetchFareCalendar(); // not awaited: a fare calendar failure must not block the listing
		await fetchScreenData();
	});

	// convert a dayjs date to the fare calendar api format
	const toCalendarDate = (d: dayjs.Dayjs): CalendarDate => ({
		year: d.year(),
		month: d.month() + 1,
		day: d.date()
	});
	// to call the fare calendar api using the current search parameters from flightSearchStore
	const fetchFareCalendar = async () => {
		setFareCalendarLoading();
		const searchstore = get(flightSearchStore);

		const start = dayjs(); // today
		const defaultEnd = start.add(15, 'day'); // 15 days from today
		const depart = dayjs(searchstore.departureDate);
		// make sure the searched date is always inside the requested window
		// if user selected depart date is outside calendar window, it extends the window
		const end = depart.isAfter(defaultEnd) ? depart.add(7, 'day') : defaultEnd;
		// calling api
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

		// on failure or when the feature is disabled, store an empty list so the calendar hides
		setFareCalendar(
			!result.hasError() && result.response?.enabled
				? result.response.onwardJourneyFareDetails ?? []
				: []
		);
	};

	// user selected a date in the calendar - refetch the listing
	// new api call is made only if the selected date is different from the current one
	const handleDateSelect = (e: CustomEvent<CalendarDate>) => {
		const { year, month, day } = e.detail;
		if (year === selectedDate.year && month === selectedDate.month && day === selectedDate.day) {
			return;
		}
		flightSearchStore.update((s) => ({ ...s, departureDate: new Date(year, month - 1, day) }));
		setLoadingLce();
		fetchScreenData(); // currently selected chips are sent with the new date
	};

	// a chip was toggled: refetch from the server with the new filters
	const handleFilterChange = () => fetchScreenData(true);

	// "Clear filters" button in the empty state
	const handleClearFilters = () => {
		clearQuickFilters();
		fetchScreenData(true);
	};

	//isFilterRefetch = true  -> only the list area shows a loader
	//isFilterRefetch = false -> full screen loader (already set by the caller)

	const fetchScreenData = async (isFilterRefetch = false) => {
		// increment the request counter to ignore responses from older requests
		const currentRequest = ++requestCounter;
		isListLoading = isFilterRefetch;

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
		// calls the flights api with expected request parameters
		const result = await callGetFlightsSearchListV2({
			src: toAirport(searchstore.source),
			des: toAirport(searchstore.destination),
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
			// converts the selected quick-filter chips into the request's appliedSortFilter
			appliedSortFilter: buildAppliedSortFilter(get(quickFilters)),
			is_round_trip: searchstore.isRoundTrip,
			partnerCountry: config.partnerCountry ?? 'IN',
			fareType: 'regular'
		});

		// a newer request was fired while this one was in flight: ignore this response
		if (currentRequest !== requestCounter) return;

		isListLoading = false;

		if (result.hasError()) {
			// filters are applied and the server found nothing:
			// stay on the listing so the user can clear the filters
			const hasFiltersApplied = get(quickFilters).some(
				(f: { isSelected: boolean }) => f.isSelected
			);
			//filters are applied and the server found nothing:
			// stay on the listing so the user can clear the filters
			if (hasFiltersApplied) {
				// it keeps the chips so the user can clear them and empties the flight list
				setNoFlights();
				setContentLce();
				return;
			}

			setErrorLce(result.error);
			return;
		}
		// sets the api response in the store
		setFlightListing(result.response as FlightListingResponse);
		setContentLce();
	};

	// retry button in the error state
	function handleRetry() {
		setLoadingLce();
		fetchScreenData();
	}
</script>

<div class="h-screen flex flex-col [&_nav.bg-secondary]:!rounded-none">
	<ListingAppBar />

	<!-- fare calendar and loading indicator -->
	{#if $fareCalendarStore.isLoading || $fareCalendarStore.fares.length > 0}
		<div class="flex justify-center bg-[#f0f0f5]">
			<FareCalendar {selectedDate} on:select={handleDateSelect} />
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
				<ListingFilterBar on:change={handleFilterChange} />
				<CompareBanner />
				{#if isListLoading}
					<div class="flex justify-center py-10">
						<PrimaryLoader />
					</div>
				{:else}
					<FlightListing on:clear={handleClearFilters} />
				{/if}
			</div>
		</main>
	{/if}
</div>
