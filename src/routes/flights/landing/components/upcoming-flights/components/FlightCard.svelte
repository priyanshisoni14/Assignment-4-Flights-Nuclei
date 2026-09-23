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

<div class="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 cursor-pointer">
	<div
		class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-primary flex items-center justify-center"
	>
		{#if airlineLogo}
			<img
				class="w-full h-full object-cover"
				src={airlineLogo}
				alt={airlineName || 'Airline logo'}
			/>
		{:else}
			<span class="text-xs font-bold text-primary-content"
				>{airlineName.slice(0, 2).toUpperCase()}</span
			>
		{/if}
	</div>

	<div class="flex-1 min-w-0">
		<div class="flex items-center gap-1.5 min-w-0">
			<p class="card-heading flex-shrink-0 truncate">{from}</p>
			<span class="flex-shrink-0"><ArrowRightIcon /></span>
			<p class="card-heading truncate">{to}</p>
		</div>

		<p class="sub-text base-content-light-60 mt-0.5 truncate">{dateRange}</p>

		<div
			class="mt-1 flex items-center gap-1.5 text-sm text-base-content whitespace-nowrap overflow-hidden"
		>
			<span>{travellers} Traveller{travellers > 1 ? 's' : ''}</span>
			<span class="text-base-300">|</span>
			<span>{travelClass}</span>
			<span class="text-base-300">|</span>
			<span>{duration}</span>
		</div>
	</div>

	<div class="flex-shrink-0 opacity-50">
		<ChevronRightIcon />
	</div>
</div>
