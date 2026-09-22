<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import dayjs from 'dayjs';

	// TODO: wire to openCalendar (native-bridge-util) once we confirm the request/response shape
	const handleDepartureClick = () => console.log('open departure calendar');
	const handleReturnClick = () => console.log('open return calendar');

	$: departureLabel = dayjs($flightSearchStore.departureDate).format('DD MMM');
	$: departureDay = dayjs($flightSearchStore.departureDate).format('dddd');
</script>

<div class="w-full mt-3 bg-base-100 rounded-lg shadow flex divide-x">
	<button class="flex-1 text-left p-3" on:click={handleDepartureClick}>
		<p class="sub-text base-content-light-60">Departure</p>
		<p class="heading-3 mt-1">{departureLabel}</p>
		<p class="sub-text base-content-light-60 mt-0.5">{departureDay}</p>
	</button>

	<button
		class="flex-1 text-left p-3 flex items-center justify-between"
		on:click={handleReturnClick}
	>
		<div>
			<p class="sub-text base-content-light-60">Return</p>
			{#if $flightSearchStore.returnDate}
				<p class="heading-3 mt-1">{dayjs($flightSearchStore.returnDate).format('DD MMM')}</p>
			{:else}
				<p class="heading-3 mt-1 text-primary">Add Return</p>
				<p class="sub-text base-content-light-60 mt-0.5">and save more!</p>
			{/if}
		</div>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
			<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
	</button>
</div>
