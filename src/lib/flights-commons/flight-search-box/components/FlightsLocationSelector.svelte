<script lang="ts">
	import { base } from '$app/paths';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import FlightIcon from '$lib/flights-commons/icons/FlightIcon.svelte';
	import FlightToIcon from '$lib/flights-commons/icons/FlightToIcon.svelte';
	import SwapIcon from '$lib/flights-commons/icons/SwapIcon.svelte';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';

	const handleSourceClick = () =>
		NavigatorUtils.navigateTo({
			url: `${base}/flights/search-city?type=source&title=Search Source City`
		});

	const handleDestinationClick = () =>
		NavigatorUtils.navigateTo({
			url: `${base}/flights/search-city?type=destination&title=Search Destination City`
		});
	// spread the current state so existing state remains same
	// and update the source and destination
	// current represents the current flight search state
	const handleSwapButtonClick = () => {
		flightSearchStore.update((current) => ({
			...current,
			source: current.destination,
			destination: current.source
		}));
	};
</script>

<div class="relative">
	<div class="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-1">
		<button
			class="w-full text-left px-4 py-3.5 flex items-center gap-3"
			on:click={handleSourceClick}
		>
			<div class="flex-shrink-0 opacity-60 [&>svg]:w-5 [&>svg]:h-5">
				<FlightIcon />
			</div>
			<div class="min-w-0 flex-1">
				<p class="sub-text base-content-light-60">From</p>
				<p class="heading-3 truncate">
					{$flightSearchStore.source.locationName}
					<span class="sub-text text-gray-400">| {$flightSearchStore.source.iataCode}</span>
				</p>
			</div>
		</button>
	</div>

	<div class="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-1">
		<button
			class="w-full text-left px-4 py-3.5 flex items-center gap-3"
			on:click={handleDestinationClick}
		>
			<div class="flex-shrink-0 opacity-60 [&>svg]:w-5 [&>svg]:h-5">
				<FlightToIcon />
			</div>
			<div class="min-w-0 flex-1">
				<p class="sub-text base-content-light-60">To</p>
				<p class="heading-3 truncate">
					{$flightSearchStore.destination.locationName}
					<span class="sub-text text-gray-400">| {$flightSearchStore.destination.iataCode}</span>
				</p>
			</div>
		</button>
	</div>

	<button
		class="absolute right-8 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 flex items-center justify-center border-2 border-[#1ba4f7] text-[#1ba4f7] hover:bg-[#f0faff] active:scale-95 transition-transform"
		on:click={handleSwapButtonClick}
		aria-label="Swap source and destination"
	>
		<SwapIcon />
	</button>
</div>
