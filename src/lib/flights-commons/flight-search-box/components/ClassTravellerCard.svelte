<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import {
		BottomSheet,
		openBottomSheet,
		closeBottomSheet
	} from '@CDNA-Technologies/svelte-vitals/components/bottom-sheet';
	import ClassTravellerSheet from './ClassTravellerSheet.svelte';

	$: totalTravellers =
		$flightSearchStore.adults + $flightSearchStore.children + $flightSearchStore.infants;

	const open = () => openBottomSheet('class-traveller-sheet');
	const handleProceed = () => closeBottomSheet();
</script>

<div class="w-full mt-3 bg-base-100 rounded-lg shadow flex divide-x">
	<button class="flex-1 text-left p-3" on:click={open}>
		<p class="sub-text base-content-light-60">Class</p>
		<p class="heading-3 mt-1">{$flightSearchStore.travelClass}</p>
	</button>
	<button class="flex-1 text-left p-3" on:click={open}>
		<p class="sub-text base-content-light-60">Traveller(s)</p>
		<p class="heading-3 mt-1">{String(totalTravellers).padStart(2, '0')}</p>
	</button>
</div>

<BottomSheet
	modelId="class-traveller-sheet"
	modalPosition="flex-end"
	height="h-auto"
	borderRadius="rounded-t-lg"
	showCrossIcon={true}
	showBackButton={false}
	disableOuterClick={true}
>
	<div slot="details">
		<ClassTravellerSheet on:proceed={handleProceed} />
	</div>
</BottomSheet>
