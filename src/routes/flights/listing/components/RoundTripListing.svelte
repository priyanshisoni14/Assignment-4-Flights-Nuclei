<script lang="ts">
	import {
		onwardFlights,
		returnFlights,
		selectedOnward,
		selectedReturn,
		selectFlight
	} from '$flights/stores/flightListingStore.js';
	import { createEventDispatcher } from 'svelte';
	import FlightListCard from './FlightListCard.svelte';
	import FlightListCardCompact from './FlightListCardCompact.svelte';

	type Leg = 'onward' | 'return';
	export let activeLeg: Leg = 'onward';

	const dispatch = createEventDispatcher<{ legchange: Leg }>();

	// both directions side by side only when this area is wide enough; below that, one wide
	// column (the active direction) and one thin compact column
	const WIDE_AT = 700;
	let width = 0;
	$: wide = width >= WIDE_AT;

	// the two directions share the same markup, so they are looped over
	$: legs = [
		{
			id: 'onward' as Leg,
			label: 'Onward flights',
			flights: $onwardFlights,
			picked: $selectedOnward
		},
		{
			id: 'return' as Leg,
			label: 'Return flights',
			flights: $returnFlights,
			picked: $selectedReturn
		}
	];
</script>

<div class="flex items-start {wide ? 'gap-4' : 'gap-3'}" bind:clientWidth={width}>
	{#each legs as leg (leg.id)}
		{@const isActive = activeLeg === leg.id}
		<section
			class="min-w-0 space-y-3 {wide
				? 'w-1/2 md:space-y-4'
				: isActive
				? 'w-[72%]'
				: 'w-[28%]'} {leg.id === 'return' && !wide ? 'border-l border-gray-300 pl-3' : ''}"
			role="list"
			aria-label={leg.label}
		>
			{#if leg.flights.length === 0}
				<p class="py-6 text-center text-xs text-[#6B6B6B]">No flights found</p>
			{/if}

			{#each leg.flights as segment (segment.segmentId)}
				{@const pickedFareId =
					leg.picked?.segmentId === segment.segmentId ? leg.picked.fareId : null}
				<div role="listitem">
					{#if isActive || wide}
						<FlightListCard
							{segment}
							selectedFareId={pickedFareId}
							on:select={(e) => selectFlight(leg.id, segment.segmentId, e.detail.fareId)}
						/>
					{:else}
						<!-- narrow area: a thin card, tapping it brings that direction to the front -->
						<FlightListCardCompact
							{segment}
							selected={pickedFareId !== null}
							on:select={() => dispatch('legchange', leg.id)}
						/>
					{/if}
				</div>
			{/each}
		</section>
	{/each}
</div>
