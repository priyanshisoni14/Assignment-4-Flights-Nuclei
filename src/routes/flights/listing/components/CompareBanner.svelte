<script lang="ts">
	import ClearTripIcon from '$lib/flights-commons/icons/cleartrip.svelte';
	import EaseMyTripIcon from '$lib/flights-commons/icons/easemytrip.svelte';
	import ScaleIcon from '$lib/flights-commons/icons/scale.svelte';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { flightsTranslationStore } from '$flights/i18n.js';

	let visible = true;

	const handleBannerClick = () => NucleiLogger.logInfo('Flights', 'Compare banner clicked');

	const handleClose = () => {
		NucleiLogger.logInfo('Flights', 'Compare banner closed');
		visible = false;
	};
</script>

{#if visible}
	<div
		class="relative flex min-h-[3.375rem] w-full items-center gap-3 rounded-lg border border-[#5DBE7E] bg-[#CBEFD7] py-2 pl-3 pr-8 md:min-h-[4rem] md:gap-4 md:pl-5 md:pr-10"
		role="button"
		tabindex="0"
		on:click={handleBannerClick}
		on:keydown={(e) => e.key === 'Enter' && handleBannerClick()}
	>
		<!-- scale icon in a green circle -->
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5DBE7E] text-white md:h-12 md:w-12"
		>
			<ScaleIcon />
		</div>

		<div class="min-w-0 flex-1">
			<p
				class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold leading-5 text-[#676767] md:text-base"
			>
				<span class="whitespace-nowrap">
					{$flightsTranslationStore('flights.listing.compare_banner')}
				</span>
				<span
					class="mt-1 flex-shrink-0 [&>svg]:h-3 [&>svg]:w-auto md:[&>svg]:h-4"
					aria-hidden="true"><ClearTripIcon /></span
				>
				<span
					class="mb-1 flex-shrink-0 [&>svg]:h-5 [&>svg]:w-auto md:[&>svg]:h-6"
					aria-hidden="true"><EaseMyTripIcon /></span
				>
			</p>
			<p class="truncate pt-0.5 text-xs leading-4 text-[#676767] md:text-sm md:leading-5">
				{$flightsTranslationStore('flights.listing.compare_banner_hint')}
			</p>
		</div>

		<!-- close -->
		<button
			type="button"
			class="absolute right-2 top-1.5 flex h-5 w-5 items-center justify-center md:right-3 md:top-2"
			aria-label="Close banner"
			on:click|stopPropagation={handleClose}
		>
			<svg class="h-2 w-2" viewBox="0 0 12 12" fill="none" aria-hidden="true">
				<path d="M1 1L11 11M11 1L1 11" stroke="#4CAF6A" stroke-width="2" stroke-linecap="round" />
			</svg>
		</button>
	</div>
{/if}
