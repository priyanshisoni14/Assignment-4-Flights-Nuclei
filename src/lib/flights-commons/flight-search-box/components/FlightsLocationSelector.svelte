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

<div class="relative flex flex-col gap-2">
	<!-- FROM -->
	<button
		type="button"
		class="flex w-full items-center gap-4 rounded-xl bg-white px-4 py-3 text-left mb-1"
		aria-label={`Departure, ${$flightSearchStore.source.locationName}, ${$flightSearchStore.source.iataCode}. Double tap to change.`}
		on:click={handleSourceClick}
	>
		<div class="flex-shrink-0 text-gray-500 opacity-70 [&>svg]:h-6 [&>svg]:w-6" aria-hidden="true">
			<FlightIcon />
		</div>
		<div class="min-w-0 flex-1" aria-hidden="true">
			<p class="text-sm leading-5 text-gray-500">From</p>
			<div class="flex items-center gap-2">
				<span class="truncate text-lg font-semibold leading-6 text-black">
					{$flightSearchStore.source.locationName}
				</span>
				<span
					class="flex-shrink-0 rounded border border-gray-400 px-2 text-xs leading-5 text-black"
				>
					{$flightSearchStore.source.iataCode}
				</span>
			</div>
			<p class="truncate text-sm leading-5 text-gray-500">
				{$flightSearchStore.source.airportName ?? ''}
			</p>
		</div>
	</button>

	<!-- TO -->
	<button
		type="button"
		class="flex w-full items-center gap-4 rounded-xl bg-white px-4 py-3 text-left"
		aria-label={`Destination, ${$flightSearchStore.destination.locationName}, ${$flightSearchStore.destination.iataCode}. Double tap to change.`}
		on:click={handleDestinationClick}
	>
		<div class="flex-shrink-0 text-gray-500 opacity-70 [&>svg]:h-6 [&>svg]:w-6" aria-hidden="true">
			<FlightToIcon />
		</div>
		<div class="min-w-0 flex-1" aria-hidden="true">
			<p class="text-sm leading-5 text-gray-500">To</p>
			<div class="flex items-center gap-2">
				<span class="truncate text-lg font-semibold leading-6 text-black">
					{$flightSearchStore.destination.locationName}
				</span>
				<span
					class="flex-shrink-0 rounded border border-gray-400 px-2 text-xs leading-5 text-black"
				>
					{$flightSearchStore.destination.iataCode}
				</span>
			</div>
			<p class="truncate text-sm leading-5 text-gray-500">
				{$flightSearchStore.destination.airportName ?? ''}
			</p>
		</div>
	</button>

	<!-- SWAP -->
	<button
		type="button"
		class="absolute right-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#4da3f0] bg-white text-[#4da3f0] transition-transform active:scale-95"
		aria-label="Swap departure and destination"
		on:click={handleSwapButtonClick}
	>
		<span aria-hidden="true"><SwapIcon /></span>
	</button>
</div>
