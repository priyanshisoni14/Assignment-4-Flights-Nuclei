<script lang="ts">
	import { base } from '$app/paths';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { NavigatorUtils } from '@CDNA-Technologies/svelte-vitals/navigator';
	import Button from '../../components/Button.svelte';
	import ClassTravellerRow from './components/ClassTravellerRow.svelte';
	import FlightsDateSelector from './components/FlightsDateSelector.svelte';
	import FlightsLocationSelector from './components/FlightsLocationSelector.svelte';
	const handleSearch = () => {
		NucleiLogger.logInfo('Flights', 'Search Flights clicked', $flightSearchStore);
		NavigatorUtils.navigateTo({ url: `${base}/flights/listing` });
	};
</script>

<div class="w-full space-y-4">
	<div class="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 overflow-hidden">
		<FlightsLocationSelector />
	</div>

	<div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
		<FlightsDateSelector />
	</div>

	<div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
		<ClassTravellerRow />
	</div>

	<Button on:click={handleSearch}>Search Flights</Button>
</div>
