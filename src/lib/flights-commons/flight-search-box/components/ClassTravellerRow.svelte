<script lang="ts">
	import { goto } from '$app/navigation';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import ClassIcon from '$lib/flights-commons/icons/ClassIcon.svelte';
	import DropdownIcon from '$lib/flights-commons/icons/DropdownIcon.svelte';
	import TravellerIcon from '$lib/flights-commons/icons/TravellerIcon.svelte';
	import {
		BottomSheet,
		closeBottomSheet,
		openBottomSheet
	} from '@CDNA-Technologies/svelte-vitals/components/bottom-sheet';
	import { onMount } from 'svelte';
	import ClassTravellerBottomSheet from './ClassTravellerBottomSheet.svelte';

	const SPECIAL_FARES = ['Student', 'Senior Citizen', 'Armed Forces'];
	const TRAVELLER_SHEET_ID = 'traveller-class-selector';

	// The bottom-sheet library reopens itself on mount if ?view= is still in the
	// URL (or lingering in its in-memory store) from a previous session — strip
	// just our sheet's id so it never auto-opens on a fresh load/refresh.
	onMount(() => {
		const url = new URL(location.href);
		const remainingViews = url.searchParams.getAll('view').filter((v) => v !== TRAVELLER_SHEET_ID);
		if (remainingViews.length !== url.searchParams.getAll('view').length) {
			url.searchParams.delete('view');
			remainingViews.forEach((v) => url.searchParams.append('view', v));
			goto(url, { replaceState: true, noScroll: true, keepFocus: true });
		}
	});

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

<div class="flex flex-col px-4 py-3.5 space-y-4">
	<div class="flex items-center gap-3">
		<div class="w-6 flex-shrink-0 opacity-60 [&>svg]:w-5 [&>svg]:h-5">
			<ClassIcon />
		</div>

		<div class="flex-1 flex items-center">
			<button class="flex-1 text-left" on:click={handleOpenSelector}>
				<p class="sub-text base-content-light-60 mb-1">Class</p>
				<div class="flex items-center justify-between">
					<p class="heading-3 truncate capitalize">
						{$flightSearchStore.travelClass.toLowerCase()}
					</p>
					<span class="[&>svg]:w-2.5 [&>svg]:h-1.5 opacity-40">
						<DropdownIcon />
					</span>
				</div>
			</button>

			<div class="w-px self-stretch bg-gray-200 mx-3" />

			<button class="flex-1 text-left" on:click={handleOpenSelector}>
				<div class="flex items-center gap-1 sub-text base-content-light-60 mb-1">
					<span class="opacity-70 [&>svg]:w-5 [&>svg]:h-5"><TravellerIcon /></span>
					<span>Traveller(s)</span>
				</div>
				<div class="flex items-center justify-between">
					<p class="heading-3">{String(totalTravellers).padStart(2, '0')}</p>
					<span class="[&>svg]:w-2.5 [&>svg]:h-1.5 opacity-40">
						<DropdownIcon />
					</span>
				</div>
			</button>
		</div>
	</div>

	<div>
		<p class="sub-text base-content-light-60 mb-3">Special Fares (Optional)</p>
		<div class="flex gap-2 flex-wrap pt-2">
			{#each SPECIAL_FARES as fare}
				<div class="relative">
					{#if fare === 'Student'}
						<span
							class="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap"
						>
							New
						</span>
					{/if}
					<button
						class="px-3 py-1.5 rounded-full border sub-text transition-colors
						{$flightSearchStore.specialFare === fare
							? 'bg-primary text-white border-primary'
							: 'border-gray-300 text-base-content hover:border-gray-400'}"
						on:click={() => toggleSpecialFare(fare)}
					>
						{fare}
					</button>
				</div>
			{/each}
		</div>
	</div>

	<label class="relative flex items-center gap-2 cursor-pointer w-fit">
		<input
			type="checkbox"
			bind:checked={$flightSearchStore.nonStopOnly}
			class="peer absolute opacity-0 w-0 h-0"
		/>
		<span
			class="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center
			peer-checked:bg-primary peer-checked:border-primary transition-colors flex-shrink-0"
		>
			{#if $flightSearchStore.nonStopOnly}
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path
						d="M2 6L4.5 8.5L10 3"
						stroke="white"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}
		</span>
		<span class="sub-text base-content-light-60">Show only non-stop flights</span>
	</label>
</div>

<div class="traveller-sheet">
	<BottomSheet modelId={TRAVELLER_SHEET_ID} padding="p-0">
		<div slot="action" class="flex justify-center pt-2 pb-1">
			<div class="w-10 h-1 rounded-full bg-gray-300" />
		</div>
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
