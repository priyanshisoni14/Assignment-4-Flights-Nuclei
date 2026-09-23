<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Airport } from '../types.js';

	export let airport: Airport;

	const dispatch = createEventDispatcher<{ select: Airport }>();

	const handleClick = () => dispatch('select', airport);
</script>

<button
	class="w-full text-left px-6 py-4 flex items-center gap-3
		hover:bg-gray-50 active:bg-gray-50 transition-colors focus:outline-none focus-visible:bg-gray-50"
	on:click={handleClick}
>
	<span
		class="w-10 h-10 rounded-lg bg-[#f0f0f5] text-[#4c5973] font-semibold text-sm
			flex items-center justify-center flex-shrink-0"
	>
		{airport.iataCode}
	</span>
	<span class="min-w-0 flex-1">
		<span class="block card-sub-heading text-base-content truncate">{airport.city}</span>
		<span class="block card-content base-content-light truncate">{airport.name}</span>
	</span>
</button>
