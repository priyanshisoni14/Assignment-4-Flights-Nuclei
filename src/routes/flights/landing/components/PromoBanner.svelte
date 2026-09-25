<script lang="ts">
	import { base } from '$app/paths';
	import ClearTripIcon from '$lib/flights-commons/icons/cleartrip.svelte';
	import EaseMyTripIcon from '$lib/flights-commons/icons/easemytrip.svelte';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';

	const bannerImageUrl = `${base}/images/promobanner.png`;

	const handleExploreClick = () => {
		NucleiLogger.logInfo('Flights', 'Compare and fly Explore clicked');
	};
</script>

<div class="flex flex-col gap-3">
	<!-- "Compare and fly: cleartrip EaseMyTrip" -->
	<p class="flex flex-wrap items-center gap-1.5 text-base text-gray-500">
		<span>Compare and fly:</span>
		<span class="flex-shrink-0 [&>svg]:h-3 [&>svg]:w-auto"><ClearTripIcon /></span>
		<span class="flex-shrink-0 [&>svg]:h-4 [&>svg]:w-auto"><EaseMyTripIcon /></span>
	</p>

	<!-- banner card -->
	<div
		class="relative w-[366px] max-w-full h-[141px] overflow-hidden rounded-2xl border-4 border-white bg-cover bg-center shadow-sm"
		style={`background-image: url(${bannerImageUrl});`}
		role="img"
		aria-label="Promotional banner: Book your flight with ease using code FLYHIGH10, in partnership with cleartrip"
	>
		<div class="flex h-full items-center justify-between gap-4 px-5">
			<!-- left side stays empty / transparent so the plane photo shows through -->
			<div class="flex-1" aria-hidden="true" />

			<div
				class="flex w-1/2 flex-shrink-0 flex-col items-end gap-1.5 text-right"
				aria-hidden="true"
			>
				<span
					class="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#E2703F] shadow-sm"
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="12" cy="12" r="10" fill="#E2703F" />
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

				<p class="text-base font-bold leading-5 text-[#26323b]">Book Your Flight with Ease</p>

				<span
					class="rounded-md border border-dashed border-gray-400 px-2.5 py-0.5 text-xs font-medium text-gray-600"
				>
					Use code: FLYHIGH10
				</span>

				<button
					type="button"
					class="rounded-lg bg-[#E2803F] px-5 py-1.5 text-sm font-semibold text-white"
					on:click={handleExploreClick}
				>
					Explore
				</button>
			</div>
		</div>
	</div>
</div>
