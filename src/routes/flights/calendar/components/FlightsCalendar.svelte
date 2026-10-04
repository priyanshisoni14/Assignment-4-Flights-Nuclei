<script lang="ts">
	import { page } from '$app/stores';
	import { flightsTranslationStore } from '$flights/i18n.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import {
		loadSearchFromCache,
		saveSearchToCache
	} from '$lib/flights-commons/utils/flight-search-cache-util.js';
	import CalendarV2 from '@CDNA-Technologies/svelte-vitals/calendar-v2';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import {
		CalendarTabType,
		CtaActionType,
		TitleType,
		type CalendarTab,
		type Title
	} from '@CDNA-Technologies/svelte-vitals/messages';
	import { get } from 'svelte/store';

	const dayOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

	// hard reload on this screen: the store is back to its defaults (the config store is empty too),
	// so start from the last saved search, otherwise Done would overwrite it with the defaults
	if (get(flightConfigStore).travellers.length === 0) {
		const cached = loadSearchFromCache();
		if (cached) flightSearchStore.set(cached);
	}
	const search = get(flightSearchStore);

	// selectable range: today up to MAX_CALENDER_DAYS from the config (365 if the config is not loaded)
	const minDate = dayOnly(new Date());
	const maxDate = new Date(minDate);
	maxDate.setDate(
		maxDate.getDate() + Number(get(flightConfigStore).configMap?.MAX_CALENDER_DAYS ?? 365)
	);

	// the dates the calendar opens with. it reads them once, when it mounts
	const savedDeparture = dayOnly(new Date(search.departureDate));
	const startDate = savedDeparture < minDate ? minDate : savedDeparture;
	const savedReturn =
		search.isRoundTrip && search.returnDate ? dayOnly(new Date(search.returnDate)) : undefined;
	const endDate = savedReturn && savedReturn >= startDate ? savedReturn : undefined;

	// ?tab=return opens straight on the return date tab
	const currentTab =
		get(page).url.searchParams.get('tab') === 'return'
			? CalendarTabType.END_DATE
			: CalendarTabType.START_DATE;

	// the package only needs the Done label from these tabs, but its types ask for every field
	const title = (value: string): Title => ({
		type: TitleType.TEXT,
		title: value,
		textSize: 'text-sm'
	});
	const buildTab = (ctaLabel: string): CalendarTab => ({
		tabTitle: title(''),
		tabSubTitle: title(''),
		cta: { label: ctaLabel, actionType: CtaActionType.PROCEED }
	});

	$: startDateTab = buildTab($flightsTranslationStore('flights.done'));
	$: endDateTab = buildTab($flightsTranslationStore('flights.done'));

	// app bar titles. a missing translation key gives an empty string (and a blank bar),
	// so fall back to English
	$: departureTitle =
		$flightsTranslationStore('flights.select_departure_date') || 'Select Departure Date';
	$: returnTitle = $flightsTranslationStore('flights.select_return_date') || 'Select Return Date';

	// fires only when Done is pressed; the package goes back right after.
	// leaving with the browser Back button fires nothing, so the search stays as it was
	const handleSelect = (e: CustomEvent<{ selectedStartDate?: Date; selectedEndDate?: Date }>) => {
		const { selectedStartDate, selectedEndDate } = e.detail;
		if (!selectedStartDate) return;

		const departureDate = dayOnly(selectedStartDate);
		const picked = selectedEndDate ? dayOnly(selectedEndDate) : undefined;
		const returnDate = picked && picked >= departureDate ? picked : undefined;

		flightSearchStore.update((s) => ({
			...s,
			departureDate,
			returnDate,
			isRoundTrip: returnDate !== undefined
		}));
		// landing and the listing sheet re-apply the cached search when they open again,
		// so the picked dates must be in it, like the cities picked in search-city
		saveSearchToCache(get(flightSearchStore));
		NucleiLogger.logInfo(
			'Flights',
			`Dates selected: ${departureDate} - ${returnDate ?? 'one way'}`
		);
	};
</script>

<!-- the package's app bar and selected dates use the theme colours: override them with the navy of the landing / listing app bars -->
<div
	class="w-full [&_nav.bg-secondary]:!rounded-none [&_nav.bg-secondary]:!bg-[#112e47] [&_nav_button]:!border-0 [&_nav_button]:!shadow-none [&_nav_button]:!outline-none [&_nav_button_>_div.bg-secondary]:!bg-[#112e47] [&_.bg-primary.rounded-lg]:!bg-[#112e47] [&_.bg-primary.bg-opacity-10]:!bg-[#112e47]/10"
>
	<CalendarV2
		categoryId={7}
		partnerId={1}
		countryCode={$flightConfigStore.partnerCountry || 'IN'}
		{startDate}
		{endDate}
		minStartDate={minDate}
		maxStartDate={maxDate}
		minEndDate={minDate}
		maxEndDate={maxDate}
		minSelectedDateDifference={0}
		fetchFares
		fetchHolidays={false}
		src={search.source.iataCode}
		dest={search.destination.iataCode}
		isRoundTrip
		adultCount={search.adults}
		childCount={search.children}
		infantCount={search.infants}
		showTabs
		{currentTab}
		{startDateTab}
		{endDateTab}
		appBarTitleTab1={departureTitle}
		appBarTitleTab2={returnTitle}
		on:select={handleSelect}
	/>
</div>
