<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import ClassIcon from '$lib/flights-commons/icons/ClassIcon.svelte';
	import DropdownIcon from '$lib/flights-commons/icons/DropdownIcon.svelte';
	import TravellerIcon from '$lib/flights-commons/icons/TravellerIcon.svelte';
	import {
		BottomSheet,
		closeBottomSheet,
		openBottomSheet
	} from '@CDNA-Technologies/svelte-vitals/components/bottom-sheet';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';
	import { onMount } from 'svelte';
	import ClassTravellerBottomSheet from './ClassTravellerBottomSheet.svelte';

	const SPECIAL_FARES = [
		{ name: 'Student', badge: 'New' },
		{ name: 'Senior Citizen' },
		{ name: 'Armed Forces' }
	];
	// for cdna to know which sheet to open
	const TRAVELLER_SHEET_ID = 'traveller-class-selector';

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
</script>

<div class="flex w-[366px] flex-col space-y-4 rounded-xl bg-white px-4 py-3.5">
	<div class="flex items-stretch">
			<button
				type="button"
				class="flex min-w-0 flex-1 items-center gap-3 text-left"
				aria-label={`Class, ${$flightSearchStore.travelClass}. Double tap to change.`}
				on:click={handleOpenSelector}
			>
				<span class="flex-shrink-0 text-gray-500 opacity-60 [&>svg]:h-7 [&>svg]:w-7" aria-hidden="true">
					<ClassIcon />
				</span>
				<span class="min-w-0" aria-hidden="true">
					<p class="mb-1 text-sm leading-5 text-gray-500">Class</p>
					<div class="flex items-center justify-between gap-2">
						<p class="truncate text-lg font-semibold leading-6 text-black capitalize">
							{$flightSearchStore.travelClass.toLowerCase()}
						</p>
<span class="flex-shrink-0 opacity-70 [&>svg]:h-2 [&>svg]:w-3.5">
						<DropdownIcon />
					</span>
					</div>
				</span>
			</button>

			<div class="mx-3 w-px self-stretch bg-gray-200" aria-hidden="true" />

			<button
				type="button"
				class="min-w-0 flex-1 text-left"
				aria-label={`Traveller(s), ${totalTravellers}. Double tap to change.`}
				on:click={handleOpenSelector}
			>
				<div
					class="mb-1 flex items-center gap-1 text-sm leading-5 text-gray-500"
					aria-hidden="true"
				>
					<span class="opacity-70 [&>svg]:h-5 [&>svg]:w-5"><TravellerIcon /></span>
					<span>Traveller(s)</span>
				</div>
				<div class="flex items-center gap-2" aria-hidden="true">
					<p class="text-lg font-semibold leading-6 text-black">
						{String(totalTravellers).padStart(2, '0')}
					</p>
					<span class="opacity-70 [&>svg]:h-2 [&>svg]:w-3.5">
						<DropdownIcon />
					</span>
				</div>
			</button>
		</div>

	<div class="mx-[-1rem] border-t border-gray-200" />

	<fieldset class="flex flex-col gap-3">
		<legend class="text-sm leading-5 text-gray-500">Special Fares (Optional)</legend>
		<div class="flex justify-evenly pt-3">
			{#each SPECIAL_FARES as fare}
				<div class="relative">
					{#if fare.badge}
						<span
							class="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold leading-none text-white"
							aria-hidden="true"
						>
							{fare.badge}
						</span>
					{/if}
					<button
						type="button"
						class="rounded-full border px-3 py-2 text-sm transition-colors
					{$flightSearchStore.specialFare === fare.name
							? 'border-primary bg-primary text-white'
							: 'border-gray-300 text-black hover:border-primary hover:text-primary'}"
						aria-pressed={$flightSearchStore.specialFare === fare.name}
						on:click={() => toggleSpecialFare(fare.name)}
					>
						{fare.name}
						{#if fare.badge}<span class="sr-only">, new</span>{/if}
					</button>
				</div>
			{/each}
		</div>
	</fieldset>
</div>
<label class="relative flex w-fit cursor-pointer items-center gap-2 mt-2">
	<input
		type="checkbox"
		bind:checked={$flightSearchStore.nonStopOnly}
		class="peer h-5 w-5 flex-shrink-0 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:border-primary checked:bg-primary"
	/>
	<svg
		class="pointer-events-none absolute left-0 top-0 hidden h-5 w-5 peer-checked:block"
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M2 6L4.5 8.5L10 3"
			stroke="white"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
			transform="translate(6 6) scale(0.8) translate(-6 -6)"
		/>
	</svg>
	<span class="text-base text-gray-500">Show only non-stop flights</span>
</label>
<div class="traveller-sheet">
	<BottomSheet modelId={TRAVELLER_SHEET_ID} padding="p-0">
		<div slot="action" class="flex justify-center pt-2 pb-1" />
		<div slot="details">
			<ClassTravellerBottomSheet on:proceed={handleSelectionProceed} />
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
</style>
