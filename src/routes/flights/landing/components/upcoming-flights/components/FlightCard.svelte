<script>
	import { flightsTranslationStore } from '$flights/i18n.js';
	import ArrowRightIcon from '$lib/flights-commons/icons/ArrowRightIcon.svelte';
	import ChevronRightIcon from '$lib/flights-commons/icons/ChevronRightIcon.svelte';

	// creating props
	export let airlineLogo = '';
	export let airlineName = '';
	export let from = '';
	export let to = '';
	export let dateRange = '';
	export let travellers = 1;
	export let travelClass = '';
	export let duration = '';
</script>

<button
	type="button"
	class="flex h-[88px] w-[316px] items-center gap-3 rounded-2xl bg-white p-3 text-left"
	aria-label={`${from} to ${to}, ${dateRange}, ${travellers} traveller${
		travellers > 1 ? 's' : ''
	}, ${travelClass}, ${duration}. Double tap for details.`}
>
	<div
		class="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e32526]"
		aria-hidden="true"
	>
		{#if airlineLogo}
			<img class="h-full w-full object-cover" src={airlineLogo} alt="" />
		{:else}
			<span class="px-1 text-center font-serif text-base italic text-white">{airlineName}</span>
		{/if}
	</div>

	<div class="flex min-w-0 flex-1 flex-col justify-center self-stretch" aria-hidden="true">
		<div class="flex min-w-0 items-center gap-2">
			<p class="flex-shrink-0 truncate text-lg font-bold text-black">{from}</p>
			<span class="flex-shrink-0 text-black [&>svg]:h-5 [&>svg]:w-5"><ArrowRightIcon /></span>
			<p class="truncate text-lg font-bold text-black">{to}</p>
		</div>

		<p class="mt-0.5 truncate text-xs text-gray-500">{dateRange}</p>

		<div class="mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-xs text-black">
			<span>{$flightsTranslationStore(
					travellers > 1 ? 'flights.traveller_count_plural' : 'flights.traveller_count',
					{ count: travellers }
				)}</span>
			<span class="text-gray-300">|</span>
			<span>{travelClass}</span>
			<span class="text-gray-300">|</span>
			<span>{duration}</span>
		</div>
	</div>

	<div class="flex-shrink-0 text-black [&>svg]:h-6 [&>svg]:w-6" aria-hidden="true">
		<ChevronRightIcon />
	</div>
</button>
