<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Airport } from '../types.js';

	export let airport: Airport;

	const dispatch = createEventDispatcher<{ select: Airport }>();

	const handleClick = () => dispatch('select', airport);
</script>

<button class="w-full text-left" on:click={handleClick}>
	<div class="p-4 md:px-6">
		<p class="card-sub-heading">
			{airport.city} <span class="text-xs">({airport.iataCode})</span>
		</p>
		<p class="card-content base-content-light">{airport.name}</p>
	</div>
</button>
