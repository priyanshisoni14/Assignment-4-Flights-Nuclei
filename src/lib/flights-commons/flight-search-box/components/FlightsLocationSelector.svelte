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
		<div class="flex-shrink-0 opacity-70">
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

	<div class="border-t border-base-300 mx-4" />

	<button
		class="w-full text-left px-4 py-3.5 flex items-center gap-3"
		on:click={handleDestinationClick}
	>
		<div class="flex-shrink-0 opacity-70" style="transform: rotate(90deg);">
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
		class="absolute right-4 top-1/2 -translate-y-1/2 bg-base-100 rounded-full"
		on:click={handleSwapButtonClick}
		aria-label="Swap source and destination"
	>
		<SwapIcon />
	</button>
</div>
