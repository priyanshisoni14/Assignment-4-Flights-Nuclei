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

<div class="w-full min-w-0 bg-[#F0F0F5] font-[Roboto,sans-serif]">
	<!-- relative: offsetLeft of the cards is measured from this scroller.
	     left padding lines the first card up with the page content; it bleeds to both screen edges -->
	<div
		bind:this={scroller}
		class="scrollbar-hide relative flex snap-x snap-proximity gap-4 overflow-x-auto border-b border-[#E3E3E8] pb-3 pr-4 pt-[1.125rem] sm:pr-6 md:pt-5 lg:pr-10 xl:pr-16"
	>
		{#if loading}
			{#each Array(5) as _, i (i)}
				<div
					class="h-[3.25rem] w-[5.5rem] flex-shrink-0 animate-pulse rounded-xl bg-white md:h-14 md:w-28"
				/>
			{/each}
		{:else}
			{#each groups as group (group.key)}
				<!-- sticky is limited to this group, so the next month pushes this card out -->
				<div class="flex flex-shrink-0">
					<!-- sticky month card. bg + pr-4 hide the date cards sliding underneath;
					     the ::after strip also hides their selected underline -->
					<div
						class="sticky left-0 z-10 h-[3.25rem] flex-shrink-0 bg-[#F0F0F5] pr-4 after:absolute after:inset-x-0 after:top-full after:h-3 after:bg-[#F0F0F5] md:h-14"
					>
						<div
							class="flex h-[3.25rem] w-6 items-center justify-center rounded-r-md bg-white md:h-14 md:w-9"
						>
							<span
								class="rotate-180 text-base font-semibold leading-none text-[#4A9FF0] [writing-mode:vertical-rl] md:text-lg"
							>
								{group.label}
							</span>
						</div>
					</div>
					<div class="flex gap-4">
						{#each group.days as item (item.key)}
							{@const isSelected = toKey(selectedDate) === item.key}
							<!-- date card -->
							<button
								type="button"
								class="relative flex h-[3.25rem] w-[5.5rem] flex-shrink-0 snap-center flex-col items-center rounded-xl bg-white pt-[0.5625rem] md:h-14 md:w-28 md:pt-2.5"
								aria-pressed={isSelected}
								aria-current={isSelected ? 'date' : undefined}
								on:click={() => handleSelect(item.date, item.dayLabel)}
							>
								<span
									class="whitespace-nowrap text-xs font-medium leading-4 text-[#7B807D] md:text-sm"
								>
									{item.dayLabel}
								</span>
								<span
									class="mt-px whitespace-nowrap text-sm font-medium leading-[1.125rem] md:text-base md:leading-5"
									style="color: {item.color}"
								>
									{item.fareText}
								</span>

								{#if isSelected}
									<span
										class="absolute -left-2 -right-2 top-full mt-[0.5625rem] h-[0.1875rem] rounded-t-[0.1875rem] bg-[#4A9FF0]"
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
