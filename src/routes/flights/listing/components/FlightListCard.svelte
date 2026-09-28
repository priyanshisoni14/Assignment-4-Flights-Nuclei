<script lang="ts">
	import type { FlightSegment } from '$flights/messages/flights-listing-msg.js';
	import { getBestFare } from '$flights/stores/flightListingStore.js';
	import ExtraBaggageIcon from '$lib/flights-commons/icons/ExtraBaggage.svelte';
	import FreeMealIcon from '$lib/flights-commons/icons/FreeMeal.svelte';
	import RefundableIcon from '$lib/flights-commons/icons/Refundable.svelte';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import BookMark from '$lib/flights-commons/icons/Bookmark.svelte';

	export let segment: FlightSegment;

	$: details = segment.onwardSegmentDetails;
	$: airline = details.segmentAirlineInfos[0];
	// "19:55 - 22:30"
	$: [departTime, arriveTime] = details.airlineTime.split(' - ');
	// "02h 35m | Non-Stop"
	$: [duration, stopsLabel] = details.airlineDuration.split(' | ');
	$: fare = getBestFare(segment);
	$: badges = buildBadges(segment);

	// design shows only the positive badges, max two
	function buildBadges(s: FlightSegment) {
		const titles = new Set(s.specialFeatures.map((f) => f.title));
		const out: { label: string; icon: typeof RefundableIcon }[] = [];
		if (titles.has('Refundable')) out.push({ label: 'Refundable', icon: RefundableIcon });
		if (s.hasFreeMeal || titles.has('Free Meal'))
			out.push({ label: 'Free Meal', icon: FreeMealIcon });
		if (titles.has('Extra Baggage')) out.push({ label: 'Extra Baggage', icon: ExtraBaggageIcon });
		return out.slice(0, 2);
	}

	const handleCardClick = () =>
		NucleiLogger.logInfo('Flights', `Flight card clicked: ${segment.segmentId}`);

	const handleCompareClick = () =>
		NucleiLogger.logInfo('Flights', `Compare clicked: ${segment.segmentId}`);
</script>

<!-- 366 x 136 (with savings strip) -->
<div
	class="w-full max-w-[366px] cursor-pointer overflow-hidden rounded-[10px] bg-white"
	role="button"
	tabindex="0"
	on:click={handleCardClick}
	on:keydown={(e) => e.key === 'Enter' && handleCardClick()}
>
	<!-- header: airline + badges (last badge runs to the card edge) -->
	<div class="mt-2 pt-2 flex h-8 items-center justify-between pl-4">
		<div class="flex min-w-0 items-center gap-2">
			{#if airline?.airlineIconUrl}
				<img
					src={airline.airlineIconUrl}
					alt=""
					class="h-[20px] w-[20px] shrink-0 rounded object-contain"
				/>
			{/if}
			<span class="truncate text-base leading-6 text-[#111]">{airline?.airlineName ?? ''}</span>
		</div>

		<div class="flex shrink-0 items-center gap-2">
			{#each badges as badge (badge.label)}
				<div
					class="flex h-5 items-center gap-1.5 bg-gradient-to-r from-[#FFF8EA] to-[#FCE7BE] pl-2 pr-2 text-xs text-[#111] last:pr-4"
				>
					<span class="flex h-4 w-4 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
						<svelte:component this={badge.icon} />
					</span>
					{badge.label}
				</div>
			{/each}
		</div>
	</div>

	<!-- times + fare -->
	<div class="mt-[9px] flex items-start justify-between px-4">
		<div class="flex items-start gap-3">
			<!-- depart -->
			<div>
				<p class="text-lg font-semibold leading-6 text-[#111]">{departTime}</p>
				<p class="text-xs leading-4 text-[#6B6B6B]">{details.sourceAirportCode.iataCode}</p>
			</div>

			<!-- duration / line / stops -->
			<div class="-mt-[5px] flex w-[71px] flex-col items-center">
				<p class="h-4 text-xs leading-4 text-[#6B6B6B]">{duration}</p>
				<div class="flex h-[10px] w-full items-center">
					<div class="h-[1.5px] w-full bg-[#52B36F]" />
				</div>
				<p class="mt-0.5 h-4 text-xs leading-4 text-[#6B6B6B]">{stopsLabel}</p>
			</div>

			<!-- arrive -->
			<div>
				<p class="text-lg font-semibold leading-6 text-[#111]">{arriveTime}</p>
				<p class="text-xs leading-4 ml-7 text-[#6B6B6B]">
					{details.destinationAirportCode.iataCode}
				</p>
			</div>
		</div>

		<!-- fare -->
		<div class="text-right">
			{#if fare}
				<p class="whitespace-nowrap text-xl font-semibold leading-6 text-[#52B36F]">
					{fare.currencySymbol}{fare.fareS}
				</p>
			{/if}
			<p class="text-xs leading-4 text-[#9A9A9A]">per adult</p>
		</div>
	</div>

	<!-- savings strip: only when the API sends savingsText -->
	{#if segment.savingsText}
		<button
			type="button"
			class="mb-3 ml-14 mt-3.5 flex h-6 w-[calc(100%-56px)] items-center justify-end gap-1.5 bg-gradient-to-r from-transparent to-[#E8F7EC] pr-4 text-sm font-semibold text-[#52B36F]"
			on:click|stopPropagation={handleCompareClick}
		>
			<BookMark />
			<span class="whitespace-nowrap">{segment.savingsText}</span>
		</button>
	{:else}
		<div class="h-4" />
	{/if}
</div>
