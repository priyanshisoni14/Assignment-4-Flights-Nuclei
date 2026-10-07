<script lang="ts">
	import { base } from '$app/paths';
	import { flightsTranslationStore } from '$flights/i18n.js';
	import Cleartrip from '$lib/flights-commons/icons/cleartrip.svelte';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import CompareAndFlyStrip from './CompareAndFlyStrip.svelte';
	const bannerImageUrl = `${base}/images/promobanner.png`;

	const handleExploreClick = () => {
		NucleiLogger.logInfo('Flights', 'Compare and fly Explore clicked');
	};
</script>

<div class="flex flex-col gap-3 md:gap-4">
	<CompareAndFlyStrip />

	<!-- banner card: height grows with the screen so the photo is not cropped to a thin strip -->
	<div
		class="relative h-36 w-full overflow-hidden rounded-2xl border-4 border-white bg-cover bg-center bg-no-repeat shadow-sm sm:h-44 md:h-52 lg:h-60 xl:h-72"
		style={`background-image: url(${bannerImageUrl});`}
	>
		<div class="flex h-full items-center justify-between gap-4 px-4 sm:px-6 md:px-10 lg:px-14">
			<!-- left side stays empty / transparent so the plane photo shows through -->
			<div class="flex-1" aria-hidden="true" />

			<div
				class="flex w-3/5 min-w-0 flex-shrink-0 flex-col items-end gap-1.5 text-right sm:w-1/2 md:gap-2 lg:w-2/5 lg:gap-3"
			>
				<span
					class="flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#E32526] shadow-sm md:text-sm lg:px-3.5 lg:py-1.5"
				>
					<Cleartrip />
				</span>

				<p class="max-w-full text-sm font-bold ...">
					{$flightsTranslationStore('flights.promo.title')}
				</p>

				<span class="rounded-md border border-dashed ...">
					{$flightsTranslationStore('flights.promo.code')}
				</span>

				<button
					type="button"
					class="..."
					aria-label={$flightsTranslationStore('flights.promo.explore_aria')}
					on:click={handleExploreClick}
				>
					{$flightsTranslationStore('flights.promo.explore')}
				</button>
			</div>
		</div>
	</div>
</div>
