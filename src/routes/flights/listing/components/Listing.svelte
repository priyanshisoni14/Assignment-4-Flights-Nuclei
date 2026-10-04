<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { callGetFlightsSearchListV2, getFareCalendar } from '$flights/api/flights-api.js';
	import {
		fareCalendarStore,
		resetFareCalendar,
		setFareCalendar,
		setFareCalendarLoading
	} from '$flights/stores/fareCalendarStore.js';
	import {
		clearQuickFilters,
		isRoundTripListing,
		quickFilters,
		resetFlightListing,
		setFlightListing,
		setNoFlights,
		toggleQuickFilter
	} from '$flights/stores/flightListingStore.js';
	import { flightSearchStore, modifySheetOpen } from '$flights/stores/flightSearchStore.js';
	import type { CalendarDate } from '$lib/flights-commons/messages/flights-fare-calendar-msg.js';
	import type { FlightListingResponse } from '$lib/flights-commons/messages/flights-listing-msg.js';
	import { ensureFlightConfig } from '$lib/flights-commons/utils/flight-config-loader.js';
	import { buildAppliedSortFilter } from '$lib/flights-commons/utils/flight-filter-utils.js';
	import {
		loadSearchFromCache,
		saveSearchToCache
	} from '$lib/flights-commons/utils/flight-search-cache-util.js';
	import type { ListingParams } from '$lib/flights-commons/utils/listing-url.js';
	import { buildListingPath, parseListingParams } from '$lib/flights-commons/utils/listing-url.js';
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
	import ModifySearchSheet from './ModifySearchSheet.svelte';
	import RoundTripFooter from './RoundTripFooter.svelte';
	import RoundTripListing from './RoundTripListing.svelte';
	import RoundTripTabs from './RoundTripTabs.svelte';
	// the url is the single source of truth for the search, so a hard reload keeps everything.
	// routeKey is a string, so params is only rebuilt when the url segments really change
	$: routeKey = $page.params.params ?? '';
	$: params = parseListingParams(routeKey);
	// the calendar highlights the departure date from the url
	$: selectedDate = toCalendarDate(dayjs(params?.departDate));

	let mounted = false;
	let isFirstLoad = true;
	// true only while a chip change is refetching: loader shows in the list area,
	// the filter bar stays mounted
	let isListLoading = false;
	// only the latest request is allowed to update the screen
	// so there is no race condition between the listing and the calendar
	// even if there is a stale api call only new data is shown
	let requestCounter = 0;
	// round trip: which direction is in front (tabs + the wide column)
	let activeLeg: 'onward' | 'return' = 'onward';
	// the chips only arrive with the first response, so a stop=0 in the url is turned into a
	// selected Non-stop chip once, right after that response
	let stopFromUrlHandled = false;
	onMount(() => {
		NucleiLogger.logInfo('Flights', 'Listing screen mounted');
		mounted = true;
		// after a hard reload the config store is empty: the class/traveller options need it in modify search
		// TODO: config cache
		ensureFlightConfig();
	});

	// ?stop=0 (with sort_id=1) means "non-stop only": the Non-stop chip is selected from it and
	// the api is called with that filter. specialFare is only mirrored into the search box
	$: nonStopParam = $page.url.searchParams.get('stop');
	$: specialFareParam = $page.url.searchParams.get('specialFare');

	// the url is the truth: copy it into flightSearchStore (and the cache), so the sheet opens
	// pre-filled and landing shows the same search when the user goes back
	const syncStoreFromUrl = (
		p: ListingParams,
		nonStop: string | null,
		specialFare: string | null
	) => {
		// the user is editing in the sheet (or came back from search-city): don't overwrite the draft
		// dont change url yet while editing
		if (get(modifySheetOpen)) return;

		const cached = loadSearchFromCache();
		const current = get(flightSearchStore);
		// the url has no airport name, so take it from whichever source knows this iata code
		const airportName = (iata: string) =>
			[current.source, current.destination, cached?.source, cached?.destination].find(
				(l) => l?.iataCode === iata && l.airportName
			)?.airportName;
		const [y, m, d] = p.departDate.split('-').map(Number);
		const next = {
			...current,
			source: {
				locationName: p.src.city,
				iataCode: p.src.iataCode,
				airportName: airportName(p.src.iataCode)
			},
			destination: {
				locationName: p.des.city,
				iataCode: p.des.iataCode,
				airportName: airportName(p.des.iataCode)
			},
			departureDate: new Date(y, m - 1, d),
			isRoundTrip: p.returnDate !== null,
			returnDate: p.returnDate
				? (([ry, rm, rd]) => new Date(ry, rm - 1, rd))(p.returnDate.split('-').map(Number))
				: undefined,
			adults: p.adults,
			children: p.children,
			infants: p.infants,
			travelClass: p.travelClass.key,
			nonStopOnly: nonStop === '0',
			specialFare
		};
		flightSearchStore.set(next);
		saveSearchToCache(next);
	};
	$: if (params) syncStoreFromUrl(params, nonStopParam, specialFareParam);

	// search-city saves the picked city here; if the edit is abandoned it must not leak to landing
	const clearPickedCities = () => {
		sessionStorage.removeItem('flights_selected_source');
		sessionStorage.removeItem('flights_selected_destination');
	};

	const openModifySheet = () => modifySheetOpen.set(true);

	// X / backdrop / Esc: throw the draft away and show what the url says again
	const handleModifyClose = () => {
		modifySheetOpen.set(false);
		clearPickedCities();
		if (params) syncStoreFromUrl(params, nonStopParam, specialFareParam);
	};

	// Search pressed: FlightSearchBox already saved the cache and is replacing the url.
	// Once the url changes, the sync above runs again with the new values
	const handleModifySearched = () => {
		modifySheetOpen.set(false);
		clearPickedCities();
	};

	// runs once after mount, and again whenever the url params change (e.g. a new date)
	$: if (mounted && params) loadListing(params);

	const loadListing = (p: ListingParams) => {
		setLoadingLce();
		if (isFirstLoad) {
			isFirstLoad = false;
			stopFromUrlHandled = false; // the url's stop=0 must be applied once to the new chips
			resetFlightListing(); // clear flights + chips from any previous search
			resetFareCalendar(); // clear fares from any previous search
			fetchFareCalendar(p); // not awaited: a fare calendar failure must not block the listing
		}
		// on a date change the chips are kept and sent with the new date
		fetchScreenData(p);
	};

	// convert a dayjs date to the fare calendar api format
	function toCalendarDate(d: dayjs.Dayjs): CalendarDate {
		return { year: d.year(), month: d.month() + 1, day: d.date() };
	}

	// to call the fare calendar api using the search parameters from the url
	const fetchFareCalendar = async (p: ListingParams) => {
		setFareCalendarLoading();

		const start = dayjs(); // today
		const defaultEnd = start.add(15, 'day'); // 15 days from today
		const depart = dayjs(p.departDate);
		// make sure the searched date is always inside the requested window
		// if the depart date is outside the calendar window, it extends the window
		const end = depart.isAfter(defaultEnd) ? depart.add(7, 'day') : defaultEnd;

		const result = await getFareCalendar({
			categoryId: 7,
			startDate: toCalendarDate(start),
			endDate: toCalendarDate(end),
			travellers: { adultCount: p.adults, childCount: p.children, infantCount: p.infants },
			additionalInfo: {
				sourceCode: p.src.iataCode,
				destCode: p.des.iataCode,
				isRoundTrip: String(p.returnDate !== null)
			}
		});

		// on failure or when the feature is disabled, store an empty list so the calendar hides
		setFareCalendar(
			!result.hasError() && result.response?.enabled
				? result.response.onwardJourneyFareDetails ?? []
				: []
		);
	};

	// user selected a date in the calendar: put it in the url.
	// the url change re-runs loadListing above, and a reload keeps the chosen date
	const handleDateSelect = (e: CustomEvent<CalendarDate>) => {
		if (!params) return;
		const { year, month, day } = e.detail;
		if (year === selectedDate.year && month === selectedDate.month && day === selectedDate.day) {
			return;
		}
		const departDate = dayjs(new Date(year, month - 1, day)).format('YYYY-MM-DD');
		// a return date before the new departure would be invalid: move it to the same day
		const returnDate =
			params.returnDate && params.returnDate < departDate ? departDate : params.returnDate;
		goto(`${base}/flights/listing/${buildListingPath({ ...params, departDate, returnDate })}`, {
			replaceState: true
		});
	};

	// keeps the url honest about the Non-stop chip: selected -> ?sort_id=1&stop=0, else both removed.
	// replaceState so Back doesn't step through every chip tap
	const syncStopToUrl = () => {
		const nonStopOn = get(quickFilters).some(
			(c: { filterType: string; filterValue: string; isSelected: boolean }) =>
				c.filterType === 'NO_OF_STOPS' && c.filterValue === '0' && c.isSelected
		);
		const url = new URL(location.href);
		if (nonStopOn) {
			url.searchParams.set('sort_id', '1');
			url.searchParams.set('stop', '0');
		} else {
			url.searchParams.delete('sort_id');
			url.searchParams.delete('stop');
		}
		if (url.href === location.href) return;
		goto(url, { replaceState: true, noscroll: true, keepfocus: true });
	};

	// a chip was toggled: refetch from the server with the new filters
	const handleFilterChange = () => {
		syncStopToUrl();
		if (params) fetchScreenData(params, true);
	};

	// "Clear filters" button in the empty state
	const handleClearFilters = () => {
		clearQuickFilters();
		syncStopToUrl();
		if (params) fetchScreenData(params, true);
	};

	// isFilterRefetch = true  -> only the list area shows a loader
	// isFilterRefetch = false -> full screen loader (already set by the caller)
	const fetchScreenData = async (p: ListingParams, isFilterRefetch = false) => {
		// increment the request counter to ignore responses from older requests
		const currentRequest = ++requestCounter;
		isListLoading = isFilterRefetch;

		// calls the flights api with the values from the url
		const result = await callGetFlightsSearchListV2({
			src: {
				iataCode: p.src.iataCode,
				city: p.src.city,
				name: p.src.city,
				countryCode: p.src.countryCode,
				iconUrl: ''
			},
			des: {
				iataCode: p.des.iataCode,
				city: p.des.city,
				name: p.des.city,
				countryCode: p.des.countryCode,
				iconUrl: ''
			},
			// callGetFlightsSearchListV2 reformats these to DD-MM-YYYY itself
			departDate: p.departDate,
			returnDate: p.returnDate ?? '',
			travellerClass: p.travelClass as Parameters<
				typeof callGetFlightsSearchListV2
			>[0]['travellerClass'],
			passenger: { adultCount: p.adults, childCount: p.children, infantCount: p.infants },
			// converts the selected quick-filter chips into the request's appliedSortFilter
			appliedSortFilter: buildAppliedSortFilter(get(quickFilters)),
			is_round_trip: p.returnDate !== null,
			partnerCountry: p.partnerCountry,
			fareType: p.fareType
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
		// url says stop=0 but the chips only exist now: select Non-stop and fetch again, so the
		// shown flights are the non-stop api results. The full-screen loader stays up meanwhile
		if (!stopFromUrlHandled) {
			stopFromUrlHandled = true;
			const nonStopChip = get(quickFilters).find(
				(c: { filterType: string; filterValue: string }) =>
					c.filterType === 'NO_OF_STOPS' && c.filterValue === '0'
			);
			if (nonStopParam === '0' && nonStopChip && !nonStopChip.isSelected) {
				toggleQuickFilter('NO_OF_STOPS', '0');
				return fetchScreenData(p, isFilterRefetch);
			}
		}
		setContentLce();
	};

	// retry button in the error state
	function handleRetry() {
		setLoadingLce();
		if (params) fetchScreenData(params);
	}

	// When the user clicks Modify, open your ModifySearchSheet
	// instead of allowing the library to treat that click like its own action (such as Retry)
	const handleErrorAreaClick = (e: MouseEvent) => {
		const button = (e.target as HTMLElement | null)?.closest('button');
		if (!button || !/modify/i.test(button.textContent ?? '')) return;

		e.stopPropagation(); // capture phase: the library's own handler never sees this click
		openModifySheet();
	};
	// the url's stop param changed without the path changing (e.g. Modify Search toggled non-stop
	// and Search was pressed): make the Non-stop chip match the url and refetch.
	// If the chip already matches (chip tap, first load), nothing happens, so no double fetch
	const applyStopFromUrl = (stopParam: string | null) => {
		const chip = get(quickFilters).find(
			(c: { filterType: string; filterValue: string }) =>
				c.filterType === 'NO_OF_STOPS' && c.filterValue === '0'
		);
		if (!chip) return; // chips not loaded yet: the first-load handler in fetchScreenData covers it
		const wantOn = stopParam === '0';
		if (chip.isSelected === wantOn) return;
		toggleQuickFilter('NO_OF_STOPS', '0');
		if (params) fetchScreenData(params, true);
	};
	$: if (mounted && params) applyStopFromUrl(nonStopParam);
</script>

<div
	class="flex h-screen w-full flex-col overflow-x-hidden [@supports(height:100dvh)]:h-[100dvh] [&_nav.bg-secondary]:!rounded-none"
>
	<div class:invisible={$modifySheetOpen}>
		<ListingAppBar on:edit={openModifySheet} />
	</div>
	<ModifySearchSheet
		open={$modifySheetOpen}
		on:close={handleModifyClose}
		on:searched={handleModifySearched}
	/>

	<!-- fare calendar: one way only. on a round trip, picking a date here would break the return date -->
	{#if params && !params.returnDate && ($fareCalendarStore.isLoading || $fareCalendarStore.fares.length > 0)}
		<div class="w-full min-w-0 bg-[#f0f0f5]">
			<FareCalendar {selectedDate} on:select={handleDateSelect} />
		</div>
	{/if}

	{#if !params}
		<p class="flex-1 p-6 text-center text-sm text-[#6B6B6B] md:text-base">
			This search link is not valid. Please go back and search again.
		</p>
	{:else if $lceStore.isLoading}
		<div class="flex flex-1 flex-col justify-center">
			<PrimaryLoader />
		</div>
	{:else if $lceStore.hasError && $lceStore.errorDetails != null}
		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
		<div class="flex flex-1 flex-col" on:click|capture={handleErrorAreaClick}>
			<ErrorHandling errorHandling={$lceStore.errorDetails} on:submit={handleRetry} />
		</div>
	{:else if $lceStore.hasContent}
		{#if $isRoundTripListing}
			<RoundTripTabs {activeLeg} on:change={(e) => (activeLeg = e.detail)} />
		{/if}

		<main
			class="min-w-0 w-full flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f5] pb-[max(2.5rem,env(safe-area-inset-bottom))]"
		>
			<div
				class="w-full min-w-0 space-y-3 px-4 pt-4 sm:px-6 md:space-y-4 md:pt-6 lg:px-10 xl:px-16"
			>
				<ListingFilterBar on:change={handleFilterChange} />
				<CompareBanner />
				{#if isListLoading}
					<div class="flex justify-center py-10">
						<PrimaryLoader />
					</div>
				{:else if $isRoundTripListing}
					<RoundTripListing {activeLeg} on:legchange={(e) => (activeLeg = e.detail)} />
				{:else}
					<FlightListing on:clear={handleClearFilters} />
				{/if}
			</div>
		</main>

		{#if $isRoundTripListing}
			<RoundTripFooter />
		{/if}
	{/if}
</div>
