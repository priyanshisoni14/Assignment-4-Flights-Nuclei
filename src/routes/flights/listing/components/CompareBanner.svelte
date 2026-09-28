<script lang="ts">
	import ClearTripIcon from '$lib/flights-commons/icons/cleartrip.svelte';
	import EaseMyTripIcon from '$lib/flights-commons/icons/easemytrip.svelte';
	import ScaleIcon from '$lib/flights-commons/icons/scale.svelte';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';

	let visible = true;

	const handleBannerClick = () => NucleiLogger.logInfo('Flights', 'Compare banner clicked');

	const handleClose = () => {
		NucleiLogger.logInfo('Flights', 'Compare banner closed');
		visible = false;
	};
</script>

{#if visible}
	<!-- 366 x 54 -->
	<div
		class="relative flex h-[54px] w-full max-w-[366px] items-center gap-3 rounded-lg border border-[#5DBE7E] bg-[#CBEFD7] pl-3 pr-8"
		role="button"
		tabindex="0"
		on:click={handleBannerClick}
		on:keydown={(e) => e.key === 'Enter' && handleBannerClick()}
	>
		<!-- scale icon in a green circle -->
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5DBE7E] text-white"
		>
			<ScaleIcon />
		</div>

		<div class="min-w-0 flex-1">
			<p class="flex items-center gap-2 text-sm font-semibold leading-5 text-[#676767]">
				Compare and fly with :
				<span class="flex-shrink-0 mt-1 [&>svg]:h-3 [&>svg]:w-auto" aria-hidden="true"
					><ClearTripIcon /></span
				>
				<span class="flex-shrink-0 mb-1 [&>svg]:h-5 [&>svg]:w-auto" aria-hidden="true"
					><EaseMyTripIcon /></span
				>
			</p>
			<p class="truncate pt-0.5 text-xs leading-4 text-[#676767]">
				*Compare multiple airlines to find your perfect flight
			</p>
		</div>

		<!-- close -->
		<button
			type="button"
			class="absolute right-2 top-1.5 flex h-5 w-5 items-center justify-center"
			aria-label="Close banner"
			on:click|stopPropagation={handleClose}
		>
			<svg width="8" height="8" viewBox="0 0 12 12" fill="none" aria-hidden="true">
				<path d="M1 1L11 11M11 1L1 11" stroke="#4CAF6A" stroke-width="2" stroke-linecap="round" />
			</svg>
		</button>
	</div>
{/if}
