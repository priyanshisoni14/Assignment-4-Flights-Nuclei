<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';

	// TODO: once /flights/search-city exists, navigate there instead of logging
	const handleSourceClick = () => console.log('open source city picker');
	const handleDestinationClick = () => console.log('open destination city picker');

	const handleSwap = () => {
		flightSearchStore.update((s) => ({ ...s, source: s.destination, destination: s.source }));
	};
</script>

<div class="relative w-11/12 mx-auto mt-4 bg-base-100 rounded-lg shadow p-4">
	<button class="w-full text-left pb-3 border-b" on:click={handleSourceClick}>
		<p class="sub-text base-content-light-60">From</p>
		<div class="flex items-baseline gap-2">
			<p class="heading-3">{$flightSearchStore.source.locationName}</p>
			<span class="sub-text border rounded px-1">{$flightSearchStore.source.iataCode}</span>
		</div>
	</button>

	<button class="w-full text-left pt-3" on:click={handleDestinationClick}>
		<p class="sub-text base-content-light-60">To</p>
		<div class="flex items-baseline gap-2">
			<p class="heading-3">{$flightSearchStore.destination.locationName}</p>
			<span class="sub-text border rounded px-1">{$flightSearchStore.destination.iataCode}</span>
		</div>
	</button>

	<button
		class="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border bg-base-100 shadow flex items-center justify-center"
		on:click={handleSwap}
		aria-label="Swap source and destination"
	>
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
			<path
				d="M7 7h11l-3-3 1.4-1.4L21 7l-4.6 4.6L15 10l3-3H7V7zm10 10H6l3 3-1.4 1.4L3 17l4.6-4.6L9 14l-3 3h11v0z"
				fill="currentColor"
			/>
		</svg>
	</button>
</div>
