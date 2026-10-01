<script lang="ts">
	import { base } from '$app/paths';
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
					<svg
						class="h-[0.8125rem] w-[0.8125rem] md:h-4 md:w-4"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="10" fill="#E32526" />
						<path
							d="M7.5 12.5 10 15l6.5-7"
							stroke="#fff"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					cleartrip
				</span>

				<p
					class="max-w-full text-sm font-bold leading-5 text-[#26323b] sm:whitespace-nowrap md:text-base md:leading-6 lg:text-xl lg:leading-7"
				>
					Book Your Flight with Ease
				</p>

				<span
					class="rounded-md border border-dashed border-gray-400 px-2.5 py-0.5 text-xs font-medium text-gray-600 md:text-sm lg:px-3.5 lg:py-1"
				>
					Use code: FLYHIGH10
				</span>

				<button
					type="button"
					class="rounded-lg bg-[#E2803F] px-5 py-1.5 text-sm font-semibold text-white md:px-6 md:py-2 md:text-base lg:px-8 lg:py-2.5"
					aria-label="Explore offers"
					on:click={handleExploreClick}
				>
					Explore
				</button>
			</div>
		</div>
	</div>
</div>
