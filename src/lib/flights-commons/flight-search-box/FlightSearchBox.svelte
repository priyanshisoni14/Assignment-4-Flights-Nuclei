<script lang="ts">
	import { base } from '$app/paths';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';
	import ClassTravellerRow from './components/ClassTravellerRow.svelte';
	import FlightsDateSelector from './components/FlightsDateSelector.svelte';
	import FlightsLocationSelector from './components/FlightsLocationSelector.svelte';

	const handleSearch = () => {
		NucleiLogger.logInfo('Flights', 'Search Flights clicked', $flightSearchStore);
		NavigatorUtils.navigateTo({ url: `${base}/flights/listing` });
	};
</script>

<div class="w-full bg-base-100 rounded-2xl shadow-md divide-y divide-base-300 overflow-hidden">
	<FlightsLocationSelector />
	<FlightsDateSelector />
	<ClassTravellerRow />

	<div class="p-4">
		<button
			class="w-full h-14 bg-primary hover:bg-primary-focus text-white heading-2 rounded-xl"
			on:click={handleSearch}
		>
			Search Flights
		</button>
	</div>
</div>
