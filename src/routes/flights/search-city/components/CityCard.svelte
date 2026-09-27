<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Airport } from '../types.js';

	export let airport: Airport;

	const dispatch = createEventDispatcher<{ select: Airport }>();

	const handleClick = () => dispatch('select', airport);
</script>

<button
	type="button"
	class="flex w-full items-center gap-4 px-6 py-4 text-left
		transition-colors hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-50 active:bg-gray-50"
	aria-label={`${airport.city}, ${airport.iataCode}, ${airport.name}`}
	on:click={handleClick}
>
	<span
		class="flex h-10 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#F0F0F5] text-sm font-semibold text-gray-500"
		aria-hidden="true"
	>
		{airport.iataCode}
	</span>
	<span class="min-w-0 flex-1" aria-hidden="true">
		<span class="block truncate text-xl font-bold text-black">{airport.city}</span>
		<span class="block truncate text-base text-gray-500">{airport.name}</span>
	</span>
</button>
