<script lang="ts">
	import {
		appliedFilterCount,
		quickFilters,
		toggleQuickFilter
	} from '$flights/stores/flightListingStore.js';
	import SortAndFilterIcon from '$lib/flights-commons/icons/SortAndFilterIcon.svelte';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';

	// static for now; will come from the API's quickFilters later
	let chips = [
		{ id: 'cheapest', title: 'Cheapest', isSelected: false },
		{ id: 'refundable', title: 'Refundable', isSelected: true },
		{ id: 'non-stop', title: 'Non Stop', isSelected: false },
		{ id: 'morning', title: 'Morning Departure', isSelected: false }
	];

	const handleSortFilterClick = () => NucleiLogger.logInfo('Flights', 'Sort & Filter clicked');

	const handleChipClick = (type: string, value: string, title: string) => {
		toggleQuickFilter(type, value);
		NucleiLogger.logInfo('Flights', `${title} clicked`);
	};
</script>

<!-- 40px tall; -mx-6 px-6 lets the row scroll edge to edge inside a px-6 parent -->
<div
	class="scrollbar-hide flex h-13 snap-x snap-mandatory gap-3 overflow-x-auto px-6"
	role="list"
	aria-label="Sort and filter options"
>
	<!-- sort & filter -->
	<button
		type="button"
		class="flex h-11 flex-shrink-0 snap-start items-center gap-2 rounded-full bg-[#4A9FF0] px-5 text-sm font-medium text-white"
		on:click={handleSortFilterClick}
	>
		<span class="relative flex h-6 w-6 items-center justify-center">
			<SortAndFilterIcon />
			{#if $appliedFilterCount > 0}
				<span
					class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#E53935] text-[10px] font-semibold leading-none text-white"
				>
					{$appliedFilterCount}
				</span>
			{/if}
		</span>
		Sort &amp; Filter
	</button>

	{#each $quickFilters as chip (chip.filterType + chip.filterValue)}
		<button
			type="button"
			class="flex h-11 flex-shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 text-sm
			{chip.isSelected
				? 'border-[#4A9FF0] bg-white text-[#4A9FF0]'
				: 'border-[#D1D1D1] bg-[#F0F0F5] text-[#3D3D3D]'}"
			aria-pressed={chip.isSelected}
			on:click={() => handleChipClick(chip.filterType, chip.filterValue, chip.title)}
		>
			{chip.title}
			{#if chip.isSelected}
				<svg width="8" height="8" viewBox="0 0 12 12" fill="none" aria-hidden="true">
					<path
						d="M1 1L11 11M11 1L1 11"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			{/if}
		</button>
	{/each}
</div>
