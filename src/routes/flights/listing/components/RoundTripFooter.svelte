<script lang="ts">
	import { canProceed, selectedTotal } from '$flights/stores/flightListingStore.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';

	// the booking screen does not exist yet: for now Proceed only logs
	const handleProceed = () => NucleiLogger.logInfo('Flights', 'Proceed clicked');
</script>

<div class="shrink-0 border-t border-gray-200 bg-white">
	<div
		class="flex items-center justify-between gap-4 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 lg:px-10 xl:px-16"
	>
		<p class="whitespace-nowrap text-lg font-semibold text-black" aria-live="polite">
			₹ {$selectedTotal.toLocaleString('en-IN')}
		</p>
		<button
			type="button"
			disabled={!$canProceed}
			class="h-12 flex-1 rounded-xl text-base font-semibold sm:max-w-xs {$canProceed
				? 'bg-[#4A9FF0] text-white'
				: 'cursor-not-allowed bg-[#C9E1F7] text-[#8FA9C4]'}"
			on:click={handleProceed}
		>
			Proceed
		</button>
	</div>
</div>
