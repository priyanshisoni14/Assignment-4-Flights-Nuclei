<script lang="ts">
	import { fareCalendarStore } from '$flights/stores/fareCalendarStore.js';
	import type {
		CalendarDate,
		FareDetail
	} from '$lib/flights-commons/messages/flights-fare-calendar-msg.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	// createEventDispatcher-triggers parent component
	// tick-waits for svelte to update the DOM
	import { createEventDispatcher, tick } from 'svelte';

	//
	type DayItem = {
		key: string;
		date: CalendarDate;
		dayLabel: string;
		fareText: string;
		color: string;
	};
	type MonthGroup = { key: string; label: string; days: DayItem[] };

	export let selectedDate: CalendarDate;

	const dispatch = createEventDispatcher<{ select: CalendarDate }>();
	// both re-run whenever the store changes
	$: loading = $fareCalendarStore.isLoading;
	$: groups = buildGroups($fareCalendarStore.fares);
	const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const MONTHS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	const toKey = (d: CalendarDate) => `${d.year}-${d.month}-${d.day}`;

	// one group per month, so the month card can stick within its own group
	const buildGroups = (list: FareDetail[]): MonthGroup[] => {
		const groups: MonthGroup[] = [];
		for (const f of list) {
			const { year, month, day } = f.calendarDate;
			const groupKey = `m-${year}-${month}`;

			let group = groups[groups.length - 1];
			if (!group || group.key !== groupKey) {
				group = { key: groupKey, label: MONTHS[month - 1], days: [] };
				groups.push(group);
			}

			const weekday = DAYS[new Date(year, month - 1, day).getDay()];
			group.days.push({
				key: toKey(f.calendarDate),
				date: f.calendarDate,
				dayLabel: `${weekday}, ${day} ${MONTHS[month - 1]}`,
				fareText: f.cheapestFareString || (f.cheapestFare > 0 ? `₹ ${f.cheapestFare}` : '--'),
				color: f.colorCode || '#111111'
			});
		}
		return groups;
	};

	let scroller: HTMLDivElement;

	const centerSelected = async () => {
		await tick();
		const el = scroller?.querySelector<HTMLElement>('[aria-current="date"]');
		if (!el) return;
		scroller.scrollTo({
			left: el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2,
			behavior: 'smooth'
		});
	};

	$: if (selectedDate && groups.length) centerSelected();

	const handleSelect = (date: CalendarDate, label: string) => {
		NucleiLogger.logInfo('Flights', `Fare calendar ${label} clicked`);
		dispatch('select', date);
	};
</script>

<div class="w-[414px] max-w-full bg-[#F0F0F5] font-[Roboto,sans-serif]">
	<!-- relative: offsetLeft of the cards is measured from this scroller -->
	<div
		bind:this={scroller}
		class="scrollbar-hide relative flex snap-x snap-proximity gap-4 overflow-x-auto border-b border-[#E3E3E8] pb-3 pl-0 pr-2 pt-[18px]"
	>
		{#if loading}
			{#each Array(5) as _, i (i)}
				<div class="h-[52px] w-[88px] flex-shrink-0 animate-pulse rounded-xl bg-white" />
			{/each}
		{:else}
			{#each groups as group (group.key)}
				<!-- sticky is limited to this group, so the next month pushes this card out -->
				<div class="flex flex-shrink-0 first:ml-2">
					<!-- sticky month card: 24 x 52. bg + pr-4 hide the date cards sliding underneath;
					     the ::after strip also hides their selected underline -->
					<div
						class="sticky left-0 z-10 h-[52px] flex-shrink-0 bg-[#F0F0F5] pr-4 after:absolute after:inset-x-0 after:top-full after:h-3 after:bg-[#F0F0F5]"
					>
						<div class="flex h-[52px] w-[24px] items-center justify-center rounded-md bg-white">
							<span
								class="rotate-180 text-[14px] font-medium leading-none text-[#4A9FF0] [writing-mode:vertical-rl]"
							>
								{group.label}
							</span>
						</div>
					</div>

					<div class="flex gap-4">
						{#each group.days as item (item.key)}
							{@const isSelected = toKey(selectedDate) === item.key}
							<!-- date card: 88 x 52 -->
							<button
								type="button"
								class="relative flex h-[52px] w-[88px] flex-shrink-0 snap-center flex-col items-center rounded-xl bg-white pt-[9px]"
								aria-pressed={isSelected}
								aria-current={isSelected ? 'date' : undefined}
								on:click={() => handleSelect(item.date, item.dayLabel)}
							>
								<span class="whitespace-nowrap text-[12px] font-medium leading-4 text-[#7B807D]">
									{item.dayLabel}
								</span>
								<span
									class="mt-px whitespace-nowrap text-[14px] font-medium leading-[18px]"
									style="color: {item.color}"
								>
									{item.fareText}
								</span>

								{#if isSelected}
									<span
										class="absolute -left-2 -right-2 top-[61px] h-[3px] rounded-t-[3px] bg-[#4A9FF0]"
									/>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
