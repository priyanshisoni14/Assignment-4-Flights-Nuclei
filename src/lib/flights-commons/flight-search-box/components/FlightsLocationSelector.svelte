<script lang="ts">
	import { base } from '$app/paths';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import FlightIcon from '$lib/flights-commons/icons/FlightIcon.svelte';
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
	<button class="w-full text-left px-4 py-3.5 flex items-center gap-3" on:click={handleSourceClick}>
		<div class="flex-shrink-0 opacity-60 [&>svg]:w-5 [&>svg]:h-5">
			<FlightIcon />
		</div>
		<div class="min-w-0 flex-1">
			<p class="sub-text base-content-light-60">From</p>
			<div class="flex items-baseline gap-2 min-w-0">
				<p class="heading-3 truncate">{$flightSearchStore.source.locationName}</p>
				<span class="sub-text border border-gray-300 rounded px-1 flex-shrink-0">
					{$flightSearchStore.source.iataCode}
				</span>
			</div>
		</div>
	</button>

	<div class="border-t border-gray-200 mx-4" />

	<button
		class="w-full text-left px-4 py-3.5 flex items-center gap-3"
		on:click={handleDestinationClick}
	>
		<div
			class="flex-shrink-0 opacity-60 [&>svg]:w-5 [&>svg]:h-5"
			style="transform: rotate(135deg);"
		>
			<FlightIcon />
		</div>
		<div class="min-w-0 flex-1">
			<p class="sub-text base-content-light-60">To</p>
			<div class="flex items-baseline gap-2 min-w-0">
				<p class="heading-3 truncate">{$flightSearchStore.destination.locationName}</p>
				<span class="sub-text border border-gray-300 rounded px-1 flex-shrink-0">
					{$flightSearchStore.destination.iataCode}
				</span>
			</div>
		</div>
	</button>

	<button
		class="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 flex items-center justify-center border-2 border-primary text-primary"
		on:click={handleSwapButtonClick}
		aria-label="Swap source and destination"
	>
		<SwapIcon />
	</button>
</div>
