<script>
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
	class="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left"
	aria-label={`${from} to ${to}, ${dateRange}, ${travellers} traveller${
		travellers > 1 ? 's' : ''
	}, ${travelClass}, ${duration}. Double tap for details.`}
>
	<div
		class="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e32526]"
		aria-hidden="true"
	>
		{#if airlineLogo}
			<img class="h-full w-full object-cover" src={airlineLogo} alt="" />
		{:else}
			<span class="px-1 text-center font-serif text-sm italic text-white">{airlineName}</span>
		{/if}
	</div>

	<div class="min-w-0 flex-1" aria-hidden="true">
		<div class="flex min-w-0 items-center gap-2">
			<p class="flex-shrink-0 truncate text-xl font-bold text-black">{from}</p>
			<span class="flex-shrink-0 text-black [&>svg]:h-4 [&>svg]:w-4"><ArrowRightIcon /></span>
			<p class="truncate text-xl font-bold text-black">{to}</p>
		</div>

		<p class="mt-0.5 truncate text-base text-gray-500">{dateRange}</p>

		<div class="mt-1 flex items-center gap-1.5 whitespace-nowrap text-base text-black">
			<span>{travellers} Traveller{travellers > 1 ? 's' : ''}</span>
			<span class="text-gray-300">|</span>
			<span>{travelClass}</span>
			<span class="text-gray-300">|</span>
			<span>{duration}</span>
		</div>
	</div>

	<div class="flex-shrink-0 text-black [&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">
		<ChevronRightIcon />
	</div>
</button>
