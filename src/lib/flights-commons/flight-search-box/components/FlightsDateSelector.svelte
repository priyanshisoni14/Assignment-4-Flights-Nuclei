<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import AddIcon from '$lib/flights-commons/icons/AddIcon.svelte';
	import CalendarIcon from '$lib/flights-commons/icons/CalendarIcon.svelte';
	import dayjs from 'dayjs';

	const handleDepartureClick = () => {
		console.log('Departure date clicked');
	};

	const handleReturnClick = () => {
		if (!$flightSearchStore.isRoundTrip) {
			flightSearchStore.update((s) => ({ ...s, isRoundTrip: true }));
		}
		console.log('Return date clicked');
	};
</script>

<div class="flex items-center gap-3 px-4 py-3.5">
	<div class="w-6 flex-shrink-0 opacity-70 [&>svg]:w-5 [&>svg]:h-5">
		<CalendarIcon />
	</div>

	<div class="flex-1 flex items-center">
		<button class="flex-1 text-left min-w-0" on:click={handleDepartureClick}>
			<p class="sub-text base-content-light-60">Departure</p>
			<p class="heading-3 truncate">{dayjs($flightSearchStore.departureDate).format('DD MMM')}</p>
			<p class="sub-text base-content-light-60">
				{dayjs($flightSearchStore.departureDate).format('dddd')}
			</p>
		</button>

		<div class="w-px self-stretch bg-base-300 mx-3" />

		<button class="flex-1 text-left min-w-0" on:click={handleReturnClick}>
			<p class="sub-text base-content-light-60">Return</p>
			{#if $flightSearchStore.isRoundTrip && $flightSearchStore.returnDate}
				<p class="heading-3 truncate">{dayjs($flightSearchStore.returnDate).format('DD MMM')}</p>
				<p class="sub-text base-content-light-60">
					{dayjs($flightSearchStore.returnDate).format('dddd')}
				</p>
			{:else}
				<div class="flex items-center gap-1 text-primary heading-3">
					<span>Add Return</span>
					<AddIcon />
				</div>
				<p class="sub-text base-content-light-60">and save more!</p>
			{/if}
		</button>
	</div>
</div>
