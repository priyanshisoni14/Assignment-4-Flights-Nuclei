<script lang="ts">
	import { getBestFare } from '$flights/stores/flightListingStore.js';
	import BookMark from '$lib/flights-commons/icons/Bookmark.svelte';
	import ExtraBaggageIcon from '$lib/flights-commons/icons/ExtraBaggage.svelte';
	import FreeMealIcon from '$lib/flights-commons/icons/FreeMeal.svelte';
	import RefundableIcon from '$lib/flights-commons/icons/Refundable.svelte';
	import type { FlightSegment } from '$lib/flights-commons/messages/flights-listing-msg.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { flightsTranslationStore } from '$flights/i18n.js';

	export let segment: FlightSegment;

	$: details = segment.onwardSegmentDetails;
	$: airline = details.segmentAirlineInfos[0];
	// connecting flights list one entry per leg; count the other carriers
	$: otherAirlines = new Set(details.segmentAirlineInfos.map((a) => a.airlineName)).size - 1;
	// "19:55 - 22:30"
	$: [departTime, arriveTime] = details.airlineTime.split(' - ');
	// "02h 35m | Non-Stop". the duration is ours, but the stops wording comes from the
	// api, so it is only translated when it is one of the values we recognise
	$: [duration, rawStops] = details.airlineDuration.split(' | ');
	$: stopsLabel = translateStops(rawStops);
	$: fare = getBestFare(segment);
	// t is passed in so the labels rebuild when the language changes
	$: badges = buildBadges(segment, $flightsTranslationStore);

	// flights are in IST (UTC+5:30 = 19800s); compare calendar days for the "+1" marker
	const istDay = (ts: string) => Math.floor((Number(ts) + 19800) / 86400);
	$: nextDay = istDay(details.arrivalTimestamp) > istDay(details.departTimestamp);

	// design shows only the positive badges, max two
	function buildBadges(s: FlightSegment, t: (key: string) => string) {
		const titles = new Set(s.specialFeatures.map((f) => f.title));
const out: { label: string; icon: typeof RefundableIcon }[] = [];
		// the api decides which badges show; only our own wording is translated
		if (titles.has('Refundable'))
			out.push({ label: t('flights.listing.badge_refundable'), icon: RefundableIcon });
		if (s.hasFreeMeal || titles.has('Free Meal'))
			out.push({ label: t('flights.listing.badge_free_meal'), icon: FreeMealIcon });
		if (titles.has('Extra Baggage'))
			out.push({ label: t('flights.listing.badge_extra_baggage'), icon: ExtraBaggageIcon });
		return out.slice(0, 2);
	}

	const handleCardClick = () =>
		NucleiLogger.logInfo('Flights', `Flight card clicked: ${segment.segmentId}`);

	const handleCompareClick = () =>
		NucleiLogger.logInfo('Flights', `Compare clicked: ${segment.segmentId}`);

	// map the api's stops text onto our keys without matching on the label itself:
	// non-stop / "1 stop" / "n stops" are recognised by word count and digits only
	function translateStops(raw: string) {
		const value = (raw ?? '').trim();
		if (!value) return '';
		if (/^non[-\s]?stop$/i.test(value)) {
			return $flightsTranslationStore('flights.listing.non_stop');
		}
		const n = Number(value.replace(/[^\d]/g, ''));
		if (!isNaN(n) && /\d/.test(value)) {
			return n === 1
				? $flightsTranslationStore('flights.listing.stops_one')
				: $flightsTranslationStore('flights.listing.stops_many', { count: n });
		}
		return value;
	}
</script>

<!-- flight card: full width, sizes step up from md -->
<div
	class="w-full cursor-pointer overflow-hidden rounded-[0.625rem] bg-white"
	role="button"
	tabindex="0"
	on:click={handleCardClick}
	on:keydown={(e) => e.target === e.currentTarget && e.key === 'Enter' && handleCardClick()}
>
	<!-- header: airline + badges (last badge runs to the card edge) -->
	<div
		class="mt-2 flex min-h-8 items-center justify-between gap-2 pl-4 md:mt-3 md:min-h-10 md:pl-5"
	>
		<div class="flex min-w-0 items-center gap-2 md:gap-3">
			{#if airline?.airlineIconUrl}
				<img
					src={airline.airlineIconUrl}
					alt=""
					class="h-5 w-5 shrink-0 rounded object-contain md:h-6 md:w-6"
				/>
			{/if}
			<span class="truncate text-base leading-6 text-[#111] md:text-lg">
				{airline?.airlineName ?? ''}{otherAirlines > 0 ? ` +${otherAirlines}` : ''}
			</span>
		</div>

		<div class="flex min-w-0 shrink items-center gap-2">
			{#each badges as badge (badge.label)}
				<div
					class="flex h-5 min-w-0 items-center gap-1.5 bg-gradient-to-r from-[#FFF8EA] to-[#FCE7BE] pl-2 pr-2 text-xs text-[#111] last:pr-4 md:h-6 md:gap-2 md:pl-3 md:pr-3 md:text-sm md:last:pr-5"
				>
					<span
						class="flex h-4 w-4 flex-shrink-0 items-center justify-center md:h-5 md:w-5 [&>svg]:h-full [&>svg]:w-full"
					>
						<svelte:component this={badge.icon} />
					</span>
					<span class="min-w-0 truncate">{badge.label}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- times + fare -->
	<div
		class="mt-[0.5625rem] flex items-start justify-between gap-2 px-3 sm:px-4 md:mt-3 md:gap-4 md:px-5"
	>
		<div class="flex min-w-0 flex-1 items-start gap-2 sm:gap-3 md:gap-4">
			<!-- depart -->
			<div class="shrink-0">
				<p class="text-lg font-semibold leading-6 text-[#111] md:text-xl md:leading-7">
					{departTime}
				</p>
				<p class="text-xs leading-4 text-[#6B6B6B] md:text-sm md:leading-5">
					{details.sourceAirportCode.iataCode}
				</p>
			</div>

			<!-- duration / line / stops: fixed width on phones, grows with the card from sm -->
			<div
				class="-mt-[0.3125rem] flex w-[4.4375rem] min-w-[3rem] flex-shrink flex-col items-center sm:w-auto sm:min-w-[4.4375rem] sm:max-w-[22rem] sm:flex-1"
			>
				<p class="h-4 max-w-full truncate text-xs leading-4 text-[#6B6B6B] md:text-sm">
					{duration}
				</p>
				<div class="flex h-2.5 w-full items-center">
					<div class="h-[0.09375rem] w-full bg-[#52B36F]" />
				</div>
				<p class="mt-0.5 h-4 max-w-full truncate text-xs leading-4 text-[#6B6B6B] md:text-sm">
					{stopsLabel}
				</p>
			</div>

			<!-- arrive -->
			<div class="shrink-0">
				<p class="text-lg font-semibold leading-6 text-[#111] md:text-xl md:leading-7">
					{arriveTime}{#if nextDay}<sup class="ml-0.5 text-[0.625rem] font-normal text-[#6B6B6B]"
							>+1</sup
						>{/if}
				</p>
				<p class="ml-7 text-xs leading-4 text-[#6B6B6B] md:ml-8 md:text-sm md:leading-5">
					{details.destinationAirportCode.iataCode}
				</p>
			</div>
		</div>

		<!-- fare -->
		<div class="shrink-0 text-right">
			{#if fare}
				<p
					class="whitespace-nowrap text-xl font-semibold leading-6 text-[#52B36F] md:text-2xl md:leading-7"
				>
					{fare.currencySymbol}{fare.fareS}
				</p>
			{/if}
			<p class="text-xs leading-4 text-[#9A9A9A] md:text-sm md:leading-5">
				{$flightsTranslationStore('flights.listing.per_adult')}
			</p>
		</div>
	</div>

	<!-- savings strip: only when the API sends savingsText -->
	{#if segment.savingsText}
		<button
			type="button"
			class="mb-3 ml-14 mt-3.5 flex h-6 w-[calc(100%-3.5rem)] min-w-0 items-center justify-end gap-1.5 bg-gradient-to-r from-transparent to-[#E8F7EC] pr-4 text-sm font-semibold text-[#52B36F] md:mb-4 md:ml-20 md:mt-4 md:h-7 md:w-[calc(100%-5rem)] md:pr-5 md:text-base"
			on:click|stopPropagation={handleCompareClick}
		>
			<BookMark />
			<span class="min-w-0 truncate">{segment.savingsText}</span>
		</button>
	{:else}
		<div class="h-4 md:h-5" />
	{/if}
</div>
