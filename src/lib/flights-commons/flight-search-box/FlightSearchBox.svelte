<script lang="ts">
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';
	import { base } from '$app/paths';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import LocationCard from './components/LocationCard.svelte';
	import DateCard from './components/DateCard.svelte';
	import ClassTravellerCard from './components/ClassTravellerCard.svelte';
	import SpecialFaresRow from './components/SpecialFaresRow.svelte';

	const handleSearch = () => {
		NucleiLogger.logInfo('Flights', 'Search Flights clicked', $flightSearchStore);
		NavigatorUtils.navigateTo({ url: `${base}/flights/listing` });
	};
</script>

<div class="w-full max-w-3xl mx-auto">
	<p class="sub-text base-content-light-60 flex flex-wrap items-center gap-x-1 mb-3">
		Compare and fly:
		<span class="font-bold text-[#F25021]">cleartrip</span>
		<span class="font-semibold text-base-content">EaseMyTrip</span>
	</p>

	<div class="w-full bg-base-200 rounded-xl shadow overflow-hidden">
		<LocationCard />

		<DateCard />

		<ClassTravellerCard />

		<SpecialFaresRow />

		<label
			class="flex items-center gap-2 border-t border-base-300 px-4 md:px-6 py-3 w-full sub-text base-content-light-60"
		>
			<input
				type="checkbox"
				bind:checked={$flightSearchStore.nonStopOnly}
				class="checkbox checkbox-primary h-5 w-5 shrink-0"
			/>
			Show only non-stop flights
		</label>

		<div class="pt-3">
			<button
				class="w-full h-14 bg-primary hover:bg-primary-focus text-white heading-2"
				on:click={handleSearch}
			>
				Search Flights
			</button>
		</div>
	</div>

	<p class="text-center sub-text mt-4 text-[#385868]">Compare Multiple Airlines for Best Offer!</p>
</div>
