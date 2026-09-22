<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import LocationCard from './components/LocationCard.svelte';
	import DateCard from './components/DateCard.svelte';
	import ClassTravellerCard from './components/ClassTravellerCard.svelte';
	import SpecialFaresRow from './components/SpecialFaresRow.svelte';

	// TODO: navigate to /flights/listing via NavigatorUtils once the listing page exists
	const handleSearch = () => {
		console.log('Search Flights clicked', $flightSearchStore);
	};
</script>

<LocationCard />
<DateCard />
<ClassTravellerCard />
<SpecialFaresRow />

<label class="flex items-center gap-2 w-11/12 mx-auto mt-4 sub-text">
	<input
		type="checkbox"
		bind:checked={$flightSearchStore.nonStopOnly}
		class="checkbox checkbox-primary h-5 w-5"
	/>
	Show only non-stop flights
</label>

<div class="w-11/12 mx-auto mt-4">
	<button
		class="w-full h-14 bg-primary hover:bg-primary-focus text-white heading-2 rounded-lg"
		on:click={handleSearch}
	>
		Search Flights
	</button>
</div>
