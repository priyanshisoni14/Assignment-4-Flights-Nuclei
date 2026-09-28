<script lang="ts">
	import PencilIcon from '$lib/flights-commons/icons/PencilIcon.svelte';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import AppBar from '@CDNA-Technologies/svelte-vitals/components/appbar';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';

	// "22 Dec"
	const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

	// "PREMIUM_ECONOMY" -> "Premium Economy"
	const formatClass = (key: string) =>
		key
			.toLowerCase()
			.split('_')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');

	$: search = $flightSearchStore;
	$: travellerCount = search.adults + search.children + search.infants;
	$: travellerLabel = `${travellerCount} ${travellerCount === 1 ? 'Traveller' : 'Travellers'}`;
	$: subtitle = `${formatDate(search.departureDate)} | ${travellerLabel} | ${formatClass(
		search.travelClass
	)}`;

	const handleBack = () => history.back();

	const handleEditClick = () => {
		NucleiLogger.logInfo('Flights', 'Edit option clicked');
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
					<span class="truncate">{search.source.locationName}</span>
					<span class="mx-3 shrink-0 font-normal">→</span>
					<span class="truncate">{search.destination.locationName}</span>
				</p>
				<p class="truncate text-sm font-medium leading-5">{subtitle}</p>
			</div>
		</svelte:fragment>

		<div slot="action" class="flex h-full items-center">
			<button
				type="button"
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#112e47]"
				aria-label="Edit search"
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
