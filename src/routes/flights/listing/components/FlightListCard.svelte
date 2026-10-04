<script lang="ts">
	import { getBestFare } from '$flights/stores/flightListingStore.js';
	import BookMark from '$lib/flights-commons/icons/Bookmark.svelte';
	import ExtraBaggageIcon from '$lib/flights-commons/icons/ExtraBaggage.svelte';
	import FreeMealIcon from '$lib/flights-commons/icons/FreeMeal.svelte';
	import RefundableIcon from '$lib/flights-commons/icons/Refundable.svelte';
	import type {
		FlightSegment,
		PartnerFare
	} from '$lib/flights-commons/messages/flights-listing-msg.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { createEventDispatcher } from 'svelte';

	export let segment: FlightSegment;
	// round trip: the fare picked on this flight (null = none picked here)
	export let selectedFareId: string | null = null;

	const dispatch = createEventDispatcher<{ select: { fareId: string } }>();

	// sizes are picked from the card's own width, not the browser window's
	const SMALL = {
		head: 'mt-2 min-h-8 pl-4',
		logo: 'h-5 w-5',
		airline: 'text-base leading-6',
		badge: 'h-5 gap-1.5 pl-2 pr-2 text-xs last:pr-4',
		badgeIcon: 'h-4 w-4',
		times: 'mt-[0.5625rem] gap-2 px-3',
		timesInner: 'gap-2',
		time: 'text-lg leading-6',
		code: 'text-xs leading-4',
		arriveCode: 'ml-6',
		mid: 'min-w-0',
		midText: 'text-xs',
		fare: 'text-xl leading-6',
		perAdult: 'text-xs leading-4',
		strip: 'mb-3 ml-14 mt-3.5 h-6 w-[calc(100%-3.5rem)] pr-4 text-sm',
		spacer: 'h-3',
		partners: 'mx-3 mb-3',
		row: 'px-3',
		partnerLogo: 'h-6 w-6',
		partnerName: 'text-sm',
		partnerPrice: 'text-base',
		selectBtn: 'h-9 text-sm',
		showLess: 'text-sm'
	};
	const BIG = {
		head: 'mt-3 min-h-10 pl-5',
		logo: 'h-6 w-6',
		airline: 'text-lg leading-6',
		badge: 'h-6 gap-2 pl-3 pr-3 text-sm last:pr-5',
		badgeIcon: 'h-5 w-5',
		times: 'mt-3 gap-4 px-5',
		timesInner: 'gap-4',
		time: 'text-xl leading-7',
		code: 'text-sm leading-5',
		arriveCode: 'ml-8',
		mid: 'min-w-[4.4375rem] max-w-[22rem]',
		midText: 'text-sm',
		fare: 'text-2xl leading-7',
		perAdult: 'text-sm leading-5',
		strip: 'mb-4 ml-20 mt-4 h-7 w-[calc(100%-5rem)] pr-5 text-base',
		spacer: 'h-4',
		partners: 'mx-4 mb-4',
		row: 'px-4',
		partnerLogo: 'h-7 w-7',
		partnerName: 'text-base',
		partnerPrice: 'text-lg',
		selectBtn: 'h-10 text-base',
		showLess: 'text-base'
	};

	let width = 0;
	$: s = width >= 440 ? BIG : SMALL;

	let expanded = false;

	$: details = segment.onwardSegmentDetails;
	$: airline = details.segmentAirlineInfos[0];
	// connecting flights list one entry per leg; count the other carriers
	$: otherAirlines = new Set(details.segmentAirlineInfos.map((a) => a.airlineName)).size - 1;
	// "19:55 - 22:30"
	$: [departTime, arriveTime] = details.airlineTime.split(' - ');
	// "02h 35m | Non-Stop"
	$: [duration, stopsLabel] = details.airlineDuration.split(' | ');
	$: fare = getBestFare(segment);
	$: badges = buildBadges(segment);
	// cheapest partner first
	$: partnerFares = [...segment.fareList].sort((a, b) => a.fare - b.fare);

	// flights are in IST (UTC+5:30 = 19800s); compare calendar days for the "+1" marker
	const istDay = (ts: string) => Math.floor((Number(ts) + 19800) / 86400);
	$: nextDay = istDay(details.arrivalTimestamp) > istDay(details.departTimestamp);

	// design shows only the positive badges, max two
	function buildBadges(seg: FlightSegment) {
		const titles = new Set(seg.specialFeatures.map((f) => f.title));
		const out: { label: string; icon: typeof RefundableIcon }[] = [];
		if (titles.has('Refundable')) out.push({ label: 'Refundable', icon: RefundableIcon });
		if (seg.hasFreeMeal || titles.has('Free Meal'))
			out.push({ label: 'Free Meal', icon: FreeMealIcon });
		if (titles.has('Extra Baggage')) out.push({ label: 'Extra Baggage', icon: ExtraBaggageIcon });
		return out.slice(0, 2);
	}

	// tapping the card (or "Show less") opens / closes the list of booking partners
	const toggle = () => {
		expanded = !expanded;
		NucleiLogger.logInfo(
			'Flights',
			`Flight card ${expanded ? 'expanded' : 'collapsed'}: ${segment.segmentId}`
		);
	};

	const handleSelect = (partner: PartnerFare) => {
		NucleiLogger.logInfo(
			'Flights',
			`Partner selected: ${partner.partnerName} ${segment.segmentId}`
		);
		dispatch('select', { fareId: partner.fareId });
	};
</script>

<div
	bind:clientWidth={width}
	class="w-full min-w-0 overflow-hidden rounded-[0.625rem] border {expanded
		? 'border-[#4A9FF0] bg-[#EAF4FD]'
		: 'border-transparent bg-white'} {selectedFareId ? 'ring-2 ring-[#4A9FF0]' : ''}"
>
	<!-- summary: the part that opens / closes the card -->
	<div
		class="cursor-pointer"
		role="button"
		tabindex="0"
		aria-expanded={expanded}
		on:click={toggle}
		on:keydown={(e) => e.target === e.currentTarget && e.key === 'Enter' && toggle()}
	>
		<!-- header: airline + badges (last badge runs to the card edge) -->
		<div class="flex items-center justify-between gap-2 {s.head}">
			<div class="flex min-w-0 items-center gap-2">
				{#if airline?.airlineIconUrl}
					<img
						src={airline.airlineIconUrl}
						alt=""
						class="shrink-0 rounded object-contain {s.logo}"
					/>
				{/if}
				<span class="truncate text-[#111] {s.airline}">
					{airline?.airlineName ?? ''}{otherAirlines > 0 ? ` +${otherAirlines}` : ''}
				</span>
			</div>

			<div class="flex min-w-0 shrink items-center gap-2">
				{#each badges as badge (badge.label)}
					<div
						class="flex min-w-0 items-center bg-gradient-to-r from-[#FFF8EA] to-[#FCE7BE] text-[#111] {s.badge}"
					>
						<span
							class="flex flex-shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full {s.badgeIcon}"
						>
							<svelte:component this={badge.icon} />
						</span>
						<span class="min-w-0 truncate">{badge.label}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- times + fare -->
		<div class="flex items-start justify-between {s.times}">
			<div class="flex min-w-0 flex-1 items-start {s.timesInner}">
				<!-- depart -->
				<div class="shrink-0">
					<p class="font-semibold text-[#111] {s.time}">{departTime}</p>
					<p class="text-[#6B6B6B] {s.code}">{details.sourceAirportCode.iataCode}</p>
				</div>

				<!-- duration / line / stops: takes whatever width is left, never pushes the fare -->
				<div class="-mt-[0.3125rem] flex flex-1 flex-col items-center {s.mid}">
					<p class="h-4 max-w-full truncate leading-4 text-[#6B6B6B] {s.midText}">{duration}</p>
					<div class="flex h-2.5 w-full items-center">
						<div class="h-[0.09375rem] w-full bg-[#52B36F]" />
					</div>
					<p class="mt-0.5 h-4 max-w-full truncate leading-4 text-[#6B6B6B] {s.midText}">
						{stopsLabel}
					</p>
				</div>

				<!-- arrive -->
				<div class="shrink-0">
					<p class="whitespace-nowrap font-semibold text-[#111] {s.time}">
						{arriveTime}{#if nextDay}<sup class="ml-0.5 text-[0.625rem] font-normal text-[#6B6B6B]"
								>+1</sup
							>{/if}
					</p>
					<p class="text-[#6B6B6B] {s.code} {s.arriveCode}">
						{details.destinationAirportCode.iataCode}
					</p>
				</div>
			</div>

			<!-- fare -->
			<div class="shrink-0 text-right">
				{#if fare}
					<p class="whitespace-nowrap font-semibold text-[#52B36F] {s.fare}">
						{fare.currencySymbol}{fare.fareS}
					</p>
				{/if}
				<p class="whitespace-nowrap text-[#9A9A9A] {s.perAdult}">per adult</p>
			</div>
		</div>

		<!-- savings strip: only when the API sends savingsText. a div, not a button: it sits inside
		     the tappable summary, and a tap on it opens the card like a tap anywhere else -->
		{#if segment.savingsText && !expanded}
			<div
				class="flex min-w-0 items-center justify-end gap-1.5 bg-gradient-to-r from-transparent to-[#E8F7EC] font-semibold text-[#52B36F] {s.strip}"
			>
				<BookMark />
				<span class="min-w-0 truncate">{segment.savingsText}</span>
			</div>
		{:else}
			<div class={s.spacer} />
		{/if}
	</div>

	<!-- booking partners -->
	{#if expanded}
		<div
			class="overflow-hidden rounded-lg bg-white {s.partners}"
			role="list"
			aria-label="Booking partners"
		>
			{#each partnerFares as partner, i (`${partner.fareId}-${i}`)}
				{@const isSelected = selectedFareId === partner.fareId}
				<div
					class="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 {s.row} {i > 0
						? 'border-t border-gray-100'
						: ''}"
					role="listitem"
				>
					{#if partner.partnerIconUrl}
						<img
							src={partner.partnerIconUrl}
							alt=""
							class="shrink-0 rounded object-contain {s.partnerLogo}"
						/>
					{/if}
					<span class="min-w-0 flex-1 basis-20 truncate text-black {s.partnerName}">
						{partner.partnerName}
					</span>

					<span
						class="flex items-center gap-1 whitespace-nowrap font-semibold {s.partnerPrice} {partner.isLowestPrice
							? 'text-[#52B36F]'
							: 'text-black'}"
					>
						{#if partner.isLowestPrice}
							<svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
								<path
									d="M9.2 1.5h5.3v5.3l-6.9 6.9a1.2 1.2 0 0 1-1.7 0L2.3 10.1a1.2 1.2 0 0 1 0-1.7l6.9-6.9Zm3 2.4a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z"
								/>
							</svg>
						{/if}
						{partner.currencySymbol}{partner.fareS}
					</span>

					<button
						type="button"
						class="ml-auto w-24 shrink-0 rounded-lg border border-[#4A9FF0] font-medium {s.selectBtn} {isSelected
							? 'bg-[#4A9FF0] text-white'
							: 'bg-white text-[#4A9FF0]'}"
						aria-pressed={isSelected}
						on:click={() => handleSelect(partner)}
					>
						{isSelected ? 'Selected' : 'Select'}
					</button>
				</div>
			{/each}

			<button
				type="button"
				class="w-full border-t border-gray-100 py-3 text-center font-medium text-[#4A9FF0] {s.showLess}"
				on:click={toggle}
			>
				Show less
			</button>
		</div>
	{/if}
</div>
