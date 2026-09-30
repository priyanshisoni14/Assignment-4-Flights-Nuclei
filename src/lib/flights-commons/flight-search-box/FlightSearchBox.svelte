<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { flightsTranslationStore } from '$flights/i18n.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';
	import dayjs from 'dayjs';
	import { get } from 'svelte/store';
	import Button from '../../components/Button.svelte';
	import { buildListingPath } from '../utils/listing-url.js';
	import ClassTravellerRow from './components/ClassTravellerRow.svelte';
	import FlightsDateSelector from './components/FlightsDateSelector.svelte';
	import FlightsLocationSelector from './components/FlightsLocationSelector.svelte';
	// add above `import { base } ...`
	import { createEventDispatcher } from 'svelte'; // add near the other imports
	import { saveSearchToCache } from '../utils/flight-search-cache-util.js';

	// 'landing' pushes a new listing screen, 'modify' replaces the current listing url
	export let mode: 'landing' | 'modify' = 'landing';
	const dispatch = createEventDispatcher<{ search: void }>();
	const handleSearch = () => {
		const s = get(flightSearchStore);
		const config = get(flightConfigStore);
		NucleiLogger.logInfo('Flights', 'Search Flights clicked', s);

		// label the backend expects, e.g. "Economy Class"
		const classLabel =
			config.travellers.find((t) => t.key === s.travelClass)?.value ?? s.travelClass;

		const path = buildListingPath({
			src: { iataCode: s.source.iataCode, city: s.source.locationName, countryCode: 'IN' },
			des: {
				iataCode: s.destination.iataCode,
				city: s.destination.locationName,
				countryCode: 'IN'
			},
			departDate: dayjs(s.departureDate).format('YYYY-MM-DD'),
			returnDate: s.isRoundTrip && s.returnDate ? dayjs(s.returnDate).format('YYYY-MM-DD') : null,
			partnerCountry: config.partnerCountry || 'IN',
			adults: s.adults,
			children: s.children,
			infants: s.infants,
			travelClass: { key: s.travelClass, value: classLabel },
			fareType: 'regular'
		});

		// keep the selection so going back to landing shows it
		saveSearchToCache(s);

		// nonStop / specialFare are not in the path, so they go as query params
		const query = new URLSearchParams();
		if (s.nonStopOnly) query.set('nonStop', 'true');
		if (s.specialFare) query.set('specialFare', s.specialFare);
		const qs = query.toString() ? `?${query.toString()}` : '';
		const url = `${base}/flights/listing/${path}${qs}`;

		if (mode === 'modify') {
			dispatch('search');
			// replaceState so back from listing still goes straight to landing
			goto(url, { replaceState: true, invalidateAll: true });
			return;
		}
		NavigatorUtils.navigateTo({ url });
	};
</script>

<div class="w-full space-y-4">
	<div class="divide-y overflow-hidden">
		<FlightsLocationSelector />
	</div>

	<div class="overflow-hidden">
		<FlightsDateSelector />
	</div>

	<div class=" overflow-hidden">
		<ClassTravellerRow />
	</div>

	<Button on:click={handleSearch}>{$flightsTranslationStore('flights.search_flights')}</Button>
</div>
