<script lang="ts">
	import { getBestFare } from '$flights/stores/flightListingStore.js';
	import type { FlightSegment } from '$lib/flights-commons/messages/flights-listing-msg.js';
	import { createEventDispatcher } from 'svelte';

	export let segment: FlightSegment;
	export let selected = false;

	const dispatch = createEventDispatcher<{ select: void }>();

	$: details = segment.onwardSegmentDetails;
	$: airline = details.segmentAirlineInfos[0];
	// "19:55 - 22:30"
	$: [departTime, arriveTime] = details.airlineTime.split(' - ');
	$: fare = getBestFare(segment);
</script>

<!-- the narrow card of the direction that is not in front -->
<button
	type="button"
	class="block w-full min-w-0 overflow-hidden rounded-lg bg-white p-2 text-left {selected
		? 'ring-2 ring-[#4A9FF0]'
		: ''}"
	aria-label={`${
		airline?.airlineName ?? ''
	}, ${departTime} to ${arriveTime}. Double tap to open this direction.`}
	on:click={() => dispatch('select')}
>
	<span class="flex items-center gap-1.5" aria-hidden="true">
		{#if airline?.airlineIconUrl}
			<img src={airline.airlineIconUrl} alt="" class="h-5 w-5 shrink-0 rounded object-contain" />
		{/if}
		<span class="truncate text-xs text-[#111]">{airline?.airlineName ?? ''}</span>
	</span>

	<span class="mt-2 block text-xs font-medium text-[#111]" aria-hidden="true">{departTime}</span>
	<span class="my-1 ml-1 block h-3 w-px bg-[#B5B5B5]" aria-hidden="true" />
	<span class="block text-xs font-medium text-[#111]" aria-hidden="true">{arriveTime}</span>

	{#if fare}
		<span
			class="mt-2 block whitespace-nowrap text-sm font-semibold {fare.isLowestPrice
				? 'text-[#52B36F]'
				: 'text-[#111]'}"
			aria-hidden="true"
		>
			{fare.currencySymbol}{fare.fareS}
		</span>
	{/if}
</button>
