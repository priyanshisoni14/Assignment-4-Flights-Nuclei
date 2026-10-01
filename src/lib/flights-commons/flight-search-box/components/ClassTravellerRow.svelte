<script lang="ts">
	import { flightsTranslationStore } from '$flights/i18n.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import ClassIcon from '$lib/flights-commons/icons/ClassIcon.svelte';
	import DropdownIcon from '$lib/flights-commons/icons/DropdownIcon.svelte';
	import Tick from '$lib/flights-commons/icons/Tick.svelte';
	import TravellerIcon from '$lib/flights-commons/icons/TravellerIcon.svelte';
	import { saveNonStopToCache } from '$lib/flights-commons/utils/flight-search-cache-util.js';
	import {
		BottomSheet,
		closeBottomSheet,
		openBottomSheet
	} from '@CDNA-Technologies/svelte-vitals/components/bottom-sheet';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import ClassTravellerBottomSheet from './ClassTravellerBottomSheet.svelte';
	$: SPECIAL_FARES = [
		{
			name: $flightsTranslationStore('flights.fare.student'),
			badge: $flightsTranslationStore('flights.fare.new_badge')
		},
		{ name: $flightsTranslationStore('flights.fare.senior_citizen') },
		{ name: $flightsTranslationStore('flights.fare.armed_forces') }
	];
	// for cdna to know which sheet to open
	const TRAVELLER_SHEET_ID = 'traveller-class-selector';
	let sheetInstance = 0;
	// The bottom-sheet library persists its open state via ?view=<modelId> in the
	// URL (confirmed in BottomSheet's own docs).
	// Strip our sheet's id on mount so a hard refresh never auto-reopens it.
	onMount(() => {
		const url = new URL(location.href);
		if (!url.searchParams.getAll('view').includes(TRAVELLER_SHEET_ID)) return;

		const remainingViews = url.searchParams.getAll('view').filter((v) => v !== TRAVELLER_SHEET_ID);
		//Remove all view values
		url.searchParams.delete('view');
		//Add back all values except traveller-class-selector
		remainingViews.forEach((v) => url.searchParams.append('view', v));
		NavigatorUtils.navigateTo({
			url: url.toString(),
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	});

	//$: is a Svelte 3 reactive statement. ($state)
	$: totalTravellers =
		$flightSearchStore.adults + $flightSearchStore.children + $flightSearchStore.infants;

	function handleOpenSelector() {
		sheetInstance += 1;
		openBottomSheet(TRAVELLER_SHEET_ID);
	}

	function handleSelectionProceed() {
		closeBottomSheet();
	}

	function toggleSpecialFare(fare: string) {
		flightSearchStore.update((s) => ({
			...s,
			specialFare: s.specialFare === fare ? null : fare
		}));
	}

	// landing only: FlightSearchBox passes true. In the Modify Search sheet the listing url
	// must not change until Search is pressed
	export let syncUrl = false;

	// ticking the box puts the filter in the url (nonStop=true / nonStop=false).
	// replaceState: no new history entry per tick, so Back doesn't walk through every tick
	const handleNonStopChange = (e: Event) => {
		if (!syncUrl) return;
		const checked = (e.currentTarget as HTMLInputElement).checked;
		saveNonStopToCache(checked);
		// start from the current url so other params (like the bottom sheet's ?view=) are kept
		const url = new URL(location.href);
		url.searchParams.set('nonStop', String(checked));
		NavigatorUtils.navigateTo({
			url: url.toString(),
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	};
</script>

<div class="flex w-full flex-col space-y-4 rounded-xl bg-white px-4 py-3.5 md:px-5 md:py-4">
	<div class="flex items-stretch">
		<button
			type="button"
			class="flex min-w-0 flex-1 items-center gap-3 text-left"
			aria-label={`Class, ${$flightSearchStore.travelClass}. Double tap to change.`}
			on:click={handleOpenSelector}
		>
			<span
				class="flex-shrink-0 text-gray-500 opacity-60 [&>svg]:h-7 [&>svg]:w-7"
				aria-hidden="true"
			>
				<ClassIcon />
			</span>
			<span class="min-w-0" aria-hidden="true">
				<p class="mb-1 text-sm leading-5 text-gray-500">
					{$flightsTranslationStore('flights.class')}
				</p>
				<div class="flex items-center justify-between gap-2 sm:gap-6">
					<p class="truncate text-lg font-semibold capitalize leading-6 text-black">
						{$flightSearchStore.travelClass.toLowerCase()}
					</p>
					<span class="flex-shrink-0 opacity-70 [&>svg]:h-3 [&>svg]:w-3.5">
						<DropdownIcon />
					</span>
				</div>
			</span>
		</button>

		<div class="mx-3 w-px self-stretch bg-gray-200 md:mx-5" aria-hidden="true" />

		<button
			type="button"
			class="flex min-w-0 flex-1 items-center gap-3 text-left"
			aria-label={`Traveller(s), ${totalTravellers}. Double tap to change.`}
			on:click={handleOpenSelector}
		>
			<span
				class="flex-shrink-0 text-gray-500 opacity-70 [&>svg]:h-7 [&>svg]:w-7"
				aria-hidden="true"
			>
				<TravellerIcon />
			</span>
			<span class="min-w-0" aria-hidden="true">
				<p class="mb-1 text-sm leading-5 text-gray-500">
					{$flightsTranslationStore('flights.travellers')}
				</p>
				<div class="flex items-center justify-between gap-2">
					<p class="truncate text-lg font-semibold leading-6 text-black">
						{String(totalTravellers).padStart(2, '0')}
					</p>
					<span class="flex-shrink-0 opacity-70 [&>svg]:h-3 [&>svg]:w-3.5">
						<DropdownIcon />
					</span>
				</div>
			</span>
		</button>
	</div>

	<div class="-mx-4 border-t border-gray-200 md:-mx-5" />

	<!-- special fares: label on top, chips always on a single line below -->
	<div
		class="flex flex-col gap-3"
		role="group"
		aria-label={$flightsTranslationStore('flights.special_fares')}
	>
		<p class="text-sm leading-5 text-gray-500 md:text-base" aria-hidden="true">
			{$flightsTranslationStore('flights.special_fares')}
		</p>

		<div class="flex min-w-0 flex-nowrap gap-1.5 pt-3 sm:gap-3 md:gap-4 lg:gap-5">
			{#each SPECIAL_FARES as fare}
				<div class="relative min-w-0 flex-auto sm:flex-none">
					{#if fare.badge}
						<span
							class="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-red-500 px-2 py-0.5 text-[0.625rem] font-semibold leading-none text-white md:text-xs"
							aria-hidden="true"
						>
							{fare.badge}
						</span>
					{/if}
					<button
						type="button"
						class="w-full truncate whitespace-nowrap rounded-full border px-2 py-2 text-center text-[0.6875rem] transition-colors sm:px-4 sm:text-sm md:px-5 md:py-2.5 md:text-base
				{$flightSearchStore.specialFare === fare.name
							? 'border-primary bg-primary text-white'
							: 'border-gray-300 text-black hover:border-primary hover:text-primary'}"
						aria-pressed={$flightSearchStore.specialFare === fare.name}
						on:click={() => toggleSpecialFare(fare.name)}
					>
						{fare.name}
						{#if fare.badge}
							<span class="sr-only">, {$flightsTranslationStore('flights.fare.new_badge')}</span
							>{/if}
					</button>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- non-stop checkbox: input + tick share one box so the tick is centred in it -->
<label class="mt-2 flex w-fit max-w-full cursor-pointer items-center gap-2">
	<span class="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
		<input
			type="checkbox"
			bind:checked={$flightSearchStore.nonStopOnly}
			class="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:border-primary checked:bg-primary"
			on:change={handleNonStopChange}
		/>
		<Tick />
	</span>
	<span class="text-sm text-gray-500 sm:text-base">
		{$flightsTranslationStore('flights.non_stop_only')}
	</span>
</label>

<div class="traveller-sheet">
	<BottomSheet modelId={TRAVELLER_SHEET_ID} padding="p-0">
		<div slot="details" class="bg-[#F0F0F5]">
			{#key sheetInstance}
				<div in:fly={{ y: 40, duration: 250 }}>
					<ClassTravellerBottomSheet on:proceed={handleSelectionProceed} />
				</div>
			{/key}
		</div>
	</BottomSheet>
</div>

<style>
	.traveller-sheet :global(button.btn-primary.btn-outline) {
		border-color: transparent !important;
		background-color: white !important;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
	}
	.traveller-sheet :global(button.btn-primary.btn-outline path) {
		fill: #374151 !important;
		stroke: #374151 !important;
	}
	.traveller-sheet :global(.bg-\[\#CACACA\]) {
		display: none !important;
	}
</style>
