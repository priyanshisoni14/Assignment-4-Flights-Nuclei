<script lang="ts">
	import { base } from '$app/paths';
	import { flightsTranslationStore } from '$flights/i18n.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import AddIcon from '$lib/flights-commons/icons/AddIcon.svelte';
	import CalendarIcon from '$lib/flights-commons/icons/CalendarIcon.svelte';
	import { saveSearchToCache } from '$lib/flights-commons/utils/flight-search-cache-util.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';
	import dayjs from 'dayjs';
	import { get } from 'svelte/store';

	// the calendar is its own screen (like search-city): it saves the picked dates in the store and goes back
	const openCalendar = (tab: 'departure' | 'return') =>
		NavigatorUtils.navigateTo({ url: `${base}/flights/calendar?tab=${tab}` });

	const handleDepartureClick = () => {
		NucleiLogger.logInfo('Flights', 'Departure date clicked');
		openCalendar('departure');
	};

	const handleReturnClick = () => {
		NucleiLogger.logInfo('Flights', 'Return date clicked');
		openCalendar('return');
	};

	// back to one way
	const clearReturn = () => {
		NucleiLogger.logInfo('Flights', 'Return date removed');
		flightSearchStore.update((s) => ({ ...s, isRoundTrip: false, returnDate: undefined }));
		// the cached search is re-applied when landing opens again, so it must not keep the old return date
		saveSearchToCache(get(flightSearchStore));
	};

	$: hasReturn = $flightSearchStore.isRoundTrip && !!$flightSearchStore.returnDate;

	// screen-reader labels
	$: departureLabel = `Departure, ${dayjs($flightSearchStore.departureDate).format(
		'DD MMMM'
	)}, ${dayjs($flightSearchStore.departureDate).format('dddd')}. Double tap to change.`;

	$: returnLabel = hasReturn
		? `Return, ${dayjs($flightSearchStore.returnDate).format('DD MMMM')}, ${dayjs(
				$flightSearchStore.returnDate
		  ).format('dddd')}. Double tap to change.`
		: 'Add return date, and save more. Double tap to add.';
</script>

<div
	class="box-border flex min-h-[5.375rem] w-full rounded-xl bg-white px-4 py-3 sm:px-5 md:px-6 md:py-4"
	role="group"
	aria-label="Travel dates"
>
	<!-- DEPARTURE: icon + text share this half -->
	<button
		type="button"
		class="flex min-w-0 flex-1 items-center gap-3 text-left"
		aria-label={departureLabel}
		on:click={handleDepartureClick}
	>
		<span class="flex-shrink-0 text-gray-500 opacity-60 [&>svg]:h-7 [&>svg]:w-7" aria-hidden="true">
			<CalendarIcon />
		</span>
		<span class="min-w-0" aria-hidden="true">
			<p class="text-sm leading-5 text-gray-500">{$flightsTranslationStore('flights.departure')}</p>
			<p class="truncate text-lg font-semibold leading-6 text-black">
				{dayjs($flightSearchStore.departureDate).format('DD MMM')}
			</p>
			<p class="text-sm leading-5 text-gray-500">
				{dayjs($flightSearchStore.departureDate).format('dddd')}
			</p>
		</span>
	</button>

	<div class="mx-2 w-px bg-gray-200 sm:mx-6 md:mx-8" aria-hidden="true" />

	<!-- RETURN: other equal half. the x is a sibling button (a button cannot sit inside a button) -->
	<div class="relative ml-2 flex min-w-0 flex-1">
		<button
			type="button"
			class="min-w-0 flex-1 text-left"
			class:pr-8={hasReturn}
			aria-label={returnLabel}
			on:click={handleReturnClick}
		>
			<p class="text-sm leading-5 text-gray-500" aria-hidden="true">
				{$flightsTranslationStore('flights.return')}
			</p>
			{#if hasReturn}
				<p class="truncate text-lg font-semibold leading-6 text-black" aria-hidden="true">
					{dayjs($flightSearchStore.returnDate).format('DD MMM')}
				</p>
				<p class="text-sm leading-5 text-gray-500" aria-hidden="true">
					{dayjs($flightSearchStore.returnDate).format('dddd')}
				</p>
			{:else}
				<div
					class="flex items-center gap-2 text-lg font-semibold leading-6 text-primary"
					aria-hidden="true"
				>
					<span>{$flightsTranslationStore('flights.add_return')}</span>
					<span
						class="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center [&>svg]:h-6 [&>svg]:w-6"
					>
						<AddIcon />
					</span>
				</div>
				<p class="text-sm leading-5 text-gray-500" aria-hidden="true">
					{$flightsTranslationStore('flights.add_return_subtext')}
				</p>
			{/if}
		</button>

		{#if hasReturn}
			<button
				type="button"
				class="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-500"
				aria-label={$flightsTranslationStore('flights.remove_return')}
				on:click={clearReturn}
			>
				<svg class="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
					<path
						d="M1 1L11 11M11 1L1 11"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		{/if}
	</div>
</div>
