<script lang="ts">
	import {
		appliedFilterCount,
		quickFilters,
		toggleQuickFilter
	} from '$flights/stores/flightListingStore.js';
	import SortAndFilterIcon from '$lib/flights-commons/icons/SortAndFilterIcon.svelte';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: void }>();

	const handleSortFilterClick = () => NucleiLogger.logInfo('Flights', 'Sort & Filter clicked');

	const handleChipClick = (type: string, value: string, title: string) => {
		toggleQuickFilter(type, value);
		NucleiLogger.logInfo('Flights', `${title} clicked`);
		dispatch('change'); // parent re-calls the api with the new filters
	};
</script>

<div class="flex h-11 items-center gap-3 md:h-12">
	<!-- fixed: never scrolls -->
	<button
		type="button"
		class="flex h-11 flex-shrink-0 items-center gap-2 rounded-full bg-[#4A9FF0] px-4 text-sm font-medium text-white sm:px-5 md:h-12 md:px-6 md:text-base"
		on:click={handleSortFilterClick}
	>
		<span class="relative flex h-6 w-6 items-center justify-center">
			<SortAndFilterIcon />
			{#if $appliedFilterCount > 0}
				<span
					class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#E53935] text-[0.625rem] font-semibold leading-none text-white"
				>
					{$appliedFilterCount}
				</span>
			{/if}
		</span>
		Sort &amp; Filter
	</button>

	<!-- scrollable: only the chips swipe. negative right margin + matching padding
	     lets them run to the right screen edge, and the last chip can still scroll fully in -->
	<div
		class="scrollbar-hide -mr-4 flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto pr-4 sm:-mr-6 sm:pr-6 lg:-mr-10 lg:pr-10 xl:-mr-16 xl:pr-16"
		role="list"
		aria-label="Quick filters"
	>
		{#each $quickFilters as chip (chip.filterType + chip.filterValue)}
			<!-- svelte-ignore a11y-no-interactive-element-to-noninteractive-role -->
			<!-- svelte-ignore a11y-role-supports-aria-props -->
			<button
				type="button"
				role="listitem"
				class="flex h-11 flex-shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 text-sm md:h-12 md:px-5 md:text-base
				{chip.isSelected
					? 'border-[#4A9FF0] bg-white text-[#4A9FF0]'
					: 'border-[#D1D1D1] bg-[#F0F0F5] text-[#3D3D3D]'}"
				aria-pressed={chip.isSelected}
				on:click={() => handleChipClick(chip.filterType, chip.filterValue, chip.title)}
			>
				{chip.title}
				{#if chip.isSelected}
					<svg class="h-2 w-2" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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
</div>
