<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import AddIcon from '$lib/flights-commons/icons/AddIcon.svelte';
	import CalendarIcon from '$lib/flights-commons/icons/CalendarIcon.svelte';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import dayjs from 'dayjs';

	const handleDepartureClick = () => {
		NucleiLogger.logInfo('Flights', 'Departure date clicked');
	};

	const handleReturnClick = () => {
		if (!$flightSearchStore.isRoundTrip) {
			flightSearchStore.update((s) => ({ ...s, isRoundTrip: true }));
		}
		NucleiLogger.logInfo('Flights', 'Return date clicked');
	};

	// screen-reader labels
	$: departureLabel = `Departure, ${dayjs($flightSearchStore.departureDate).format(
		'DD MMMM'
	)}, ${dayjs($flightSearchStore.departureDate).format('dddd')}. Double tap to change.`;

	$: returnLabel =
		$flightSearchStore.isRoundTrip && $flightSearchStore.returnDate
			? `Return, ${dayjs($flightSearchStore.returnDate).format('DD MMMM')}, ${dayjs(
					$flightSearchStore.returnDate
			  ).format('dddd')}. Double tap to change.`
			: 'Add return date, and save more. Double tap to add.';
</script>

<div
	class="box-border flex h-[86px] w-[366px] items-stretch rounded-xl bg-white px-4 py-2.5"
	role="group"
	aria-label="Travel dates"
>
	<!-- DEPARTURE: icon + text share this half -->
	<button
		type="button"
		class="flex min-w-0 flex-1 items-center gap-3 text-left"
		aria-label={departureLabel}
		on:click={handleDepartureClick}
	>
		<span class="flex-shrink-0 text-gray-500 opacity-60 [&>svg]:h-7 [&>svg]:w-7" aria-hidden="true">
			<CalendarIcon />
		</span>
		<span class="min-w-0" aria-hidden="true">
			<p class="text-sm leading-5 text-gray-500">Departure</p>
			<p class="truncate text-lg font-semibold leading-6 text-black">
				{dayjs($flightSearchStore.departureDate).format('DD MMM')}
			</p>
			<p class="text-sm leading-5 text-gray-500">
				{dayjs($flightSearchStore.departureDate).format('dddd')}
			</p>
		</span>
	</button>

	<div class="mx-3 w-px self-stretch bg-gray-200" aria-hidden="true" />

	<!-- RETURN: other equal half -->
	<button
		type="button"
		class="min-w-0 flex-1 text-left ml-1"
		aria-label={returnLabel}
		on:click={handleReturnClick}
	>
		<p class="text-sm leading-5 text-gray-500" aria-hidden="true">Return</p>
		{#if $flightSearchStore.isRoundTrip && $flightSearchStore.returnDate}
			<p class="truncate text-lg font-semibold leading-6 text-black" aria-hidden="true">
				{dayjs($flightSearchStore.returnDate).format('DD MMM')}
			</p>
			<p class="text-sm leading-5 text-gray-500" aria-hidden="true">
				{dayjs($flightSearchStore.returnDate).format('dddd')}
			</p>
		{:else}
			<div
				class="flex items-center gap-2 text-lg font-semibold leading-6 text-primary"
				aria-hidden="true"
			>
				<span>Add Return</span>
				<span
					class="flex h-6 w-6 flex-shrink-0 items-center justify-center [&>svg]:h-6 [&>svg]:w-6 ml-2"
				>
					<AddIcon />
				</span>
			</div>
			<p class="text-sm leading-5 text-gray-500" aria-hidden="true">and save more!</p>
		{/if}
	</button>
</div>
