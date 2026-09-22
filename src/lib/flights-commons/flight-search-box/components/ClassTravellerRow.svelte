<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import ClassIcon from '$lib/flights-commons/icons/ClassIcon.svelte';
	import DropdownIcon from '$lib/flights-commons/icons/DropdownIcon.svelte';
	import TravellerIcon from '$lib/flights-commons/icons/TravellerIcon.svelte';
	import {
		closeBottomSheet,
		openBottomSheet
	} from '@CDNA-Technologies/svelte-vitals/components/bottom-sheet';

	const SPECIAL_FARES = ['Student', 'Senior Citizen', 'Armed Forces'];

	$: totalTravellers =
		$flightSearchStore.adults + $flightSearchStore.children + $flightSearchStore.infants;

	function handleOpenSelector() {
		openBottomSheet('traveller-class-selector');
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
		<div class="w-6 flex-shrink-0 opacity-70 [&>svg]:w-5 [&>svg]:h-5">
			<ClassIcon />
		</div>

		<div class="flex-1 flex items-center">
			<button class="flex-1 text-left" on:click={handleOpenSelector}>
				<p class="sub-text base-content-light-60 mb-1">Class</p>
				<div class="flex items-center justify-between">
					<p class="heading-3 truncate capitalize">
						{$flightSearchStore.travelClass.toLowerCase()}
					</p>
					<DropdownIcon />
				</div>
			</button>

			<div class="w-px self-stretch bg-base-300 mx-3" />

			<button class="flex-1 text-left" on:click={handleOpenSelector}>
				<div class="flex items-center gap-1 sub-text base-content-light-60 mb-1">
					<span class="opacity-70 [&>svg]:w-5 [&>svg]:h-5"><TravellerIcon /></span>
					<span>Traveller(s)</span>
				</div>
				<div class="flex items-center justify-between">
					<p class="heading-3">{String(totalTravellers).padStart(2, '0')}</p>
					<DropdownIcon />
				</div>
			</button>
		</div>
	</div>

	<div>
		<div class="flex items-center gap-2 mb-2">
			<span class="sub-text base-content-light-60">Special Fares (Optional)</span>
			<span class="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">New</span>
		</div>
		<div class="flex gap-2 flex-wrap">
			{#each SPECIAL_FARES as fare}
				<button
					class="px-3 py-1.5 rounded-full border sub-text transition-colors
						{$flightSearchStore.specialFare === fare
						? 'bg-primary text-white border-primary'
						: 'border-gray-300 text-base-content hover:border-gray-400'}"
					on:click={() => toggleSpecialFare(fare)}
				>
					{fare}
				</button>
			{/each}
		</div>
	</div>

	<label class="flex items-center gap-2 cursor-pointer w-fit">
		<input type="checkbox" bind:checked={$flightSearchStore.nonStopOnly} class="peer sr-only" />
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
