<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';
	import { base } from '$app/paths';

	const handleSourceClick = () =>
		NavigatorUtils.navigateTo({
			url: `${base}/flights/search-city?type=source&title=Select Origin`
		});
	const handleDestinationClick = () =>
		NavigatorUtils.navigateTo({
			url: `${base}/flights/search-city?type=destination&title=Select Destination`
		});
	const handleSwap = () => {
		flightSearchStore.update((s) => ({ ...s, source: s.destination, destination: s.source }));
	};
</script>

<div class="relative w-full">
	<button
		class="w-full text-left pt-3.5 pb-3 px-4 border-b border-base-300 md:px-6 md:py-4"
		on:click={handleSourceClick}
	>
		<p class="sub-text base-content-light-60">From</p>
		<div class="flex items-baseline gap-2 min-w-0">
			<p class="heading-3 truncate">{$flightSearchStore.source.locationName}</p>
			<span class="sub-text border rounded px-1 flex-shrink-0"
				>{$flightSearchStore.source.iataCode}</span
			>
		</div>
		{#if $flightSearchStore.source.airportName}
			<p class="sub-text base-content-light-60 truncate">{$flightSearchStore.source.airportName}</p>
		{/if}
	</button>

	<button
		class="w-full text-left pt-3.5 pb-3.5 px-4 md:px-6 md:py-4"
		on:click={handleDestinationClick}
	>
		<p class="sub-text base-content-light-60">To</p>
		<div class="flex items-baseline gap-2 min-w-0">
			<p class="heading-3 truncate">{$flightSearchStore.destination.locationName}</p>
			<span class="sub-text border rounded px-1 flex-shrink-0"
				>{$flightSearchStore.destination.iataCode}</span
			>
		</div>
		{#if $flightSearchStore.destination.airportName}
			<p class="sub-text base-content-light-60 truncate">
				{$flightSearchStore.destination.airportName}
			</p>
		{/if}
	</button>

	<button
		class="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border bg-base-200 shadow flex items-center justify-center md:right-6 md:w-10 md:h-10"
		on:click={handleSwap}
		aria-label="Swap source and destination"
	>
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-primary">
			<path
				d="M7 7h11l-3-3 1.4-1.4L21 7l-4.6 4.6L15 10l3-3H7V7zm10 10H6l3 3-1.4 1.4L3 17l4.6-4.6L9 14l-3 3h11v0z"
				fill="currentColor"
			/>
		</svg>
	</button>
</div>
