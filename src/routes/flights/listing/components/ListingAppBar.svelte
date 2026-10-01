<script lang="ts">
	import { page } from '$app/stores';
	import PencilIcon from '$lib/flights-commons/icons/PencilIcon.svelte';
	import { parseListingParams } from '$lib/flights-commons/utils/listing-url.js';
	import { flightsTranslationStore } from '$flights/i18n.js';
	import AppBar from '@CDNA-Technologies/svelte-vitals/components/appbar';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ edit: void }>();

	// month short names come from the locale files, so the header follows the language
	const MONTH_KEYS = [
		'flights.month.jan',
		'flights.month.feb',
		'flights.month.mar',
		'flights.month.apr',
		'flights.month.may',
		'flights.month.jun',
		'flights.month.jul',
		'flights.month.aug',
		'flights.month.sep',
		'flights.month.oct',
		'flights.month.nov',
		'flights.month.dec'
	];

	// "30 Sep". The date is built from its parts, because new Date('2026-09-30')
	// is read as UTC and can shift by a day in some timezones
	const formatDate = (isoDate: string, t: (key: string) => string) => {
		const [, m, d] = isoDate.split('-').map(Number);
		return `${d} ${t(MONTH_KEYS[m - 1])}`;
	};

	// "PREMIUM_ECONOMY" -> "Premium Economy"
	const formatClass = (key: string) =>
		key
			.toLowerCase()
			.split('_')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');

	// everything comes from the url, which is available on the server too,
	// so the first paint already shows the right route
	$: t = $flightsTranslationStore;
	$: search = parseListingParams($page.params.params ?? '');
	$: travellerCount = search ? search.adults + search.children + search.infants : 0;
	$: travellerLabel = t(
		travellerCount === 1 ? 'flights.traveller_count' : 'flights.traveller_count_plural',
		{ count: travellerCount }
	);
	$: subtitle = search
		? t('flights.listing.subtitle', {
				date: formatDate(search.departDate, t),
				travellers: travellerLabel,
				class: formatClass(search.travelClass.key)
		  })
		: '';

	const handleBack = () => history.back();

	const handleEditClick = () => {
		NucleiLogger.logInfo('Flights', 'Edit option clicked');
		dispatch('edit');
	};
</script>

<div
	class="bg-[#112e47]
	[&_nav.bg-secondary]:!bg-[#112e47]
	[&_nav.bg-secondary_>_button]:!shadow-none
	[&_nav.bg-secondary_>_button]:!p-0
	[&_nav.bg-secondary_>_button_svg]:!fill-white
	[&_nav.bg-secondary_>_button_svg]:!stroke-white
	[&_nav.bg-secondary_>_button_svg_path]:!fill-white"
>
	<AppBar height="80px" enableZIndex showBackButton={true} onBackButtonClick={handleBack}>
		<!-- both lines live in the title slot, so the back button and pencil
		     centre against the whole two-line block -->
		<svelte:fragment slot="title">
			<div class="flex min-w-0 flex-col justify-center gap-[5px] text-white">
				<p class="flex min-w-0 items-center text-xl font-semibold leading-6">
					<span class="truncate">{search?.src.city ?? ''}</span>
					<span class="mx-2 shrink-0 font-normal sm:mx-3">→</span>
					<span class="truncate">{search?.des.city ?? ''}</span>
				</p>
				<p class="truncate text-sm font-medium leading-5">{subtitle}</p>
			</div>
		</svelte:fragment>

		<div slot="action" class="flex h-full items-center">
			<button
				type="button"
				class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#112e47]"
				aria-label={$flightsTranslationStore('flights.listing.edit_search_label')}
				on:click={handleEditClick}
			>
				<PencilIcon />
			</button>
		</div>
	</AppBar>
</div>

<style>
	/* Back button - remove DaisyUI outline/border (same as LandingAppBar) */
	:global(nav button[aria-label='Back button']) {
		border: 0 !important;
		border-width: 0 !important;
		border-color: transparent !important;
		outline: 0 !important;
		box-shadow: none !important;
		background: transparent !important;
	}

	:global(nav button[aria-label='Back button'] > div.bg-secondary) {
		background-color: #112e47 !important;
		border: 0 !important;
		border-width: 0 !important;
		border-color: transparent !important;
		outline: 0 !important;
		box-shadow: none !important;
	}

	:global(nav button[aria-label='Back button'] > div.bg-secondary svg),
	:global(nav button[aria-label='Back button'] > div.bg-secondary svg path) {
		fill: #ffffff !important;
		stroke: #ffffff !important;
	}
</style>
