<script>
	import ArrowRightIcon from '$lib/flights-commons/icons/ArrowRightIcon.svelte';

	export let airlineLogo = '';
	export let airlineName = '';
	export let from = '';
	export let to = '';
	export let dateRange = '';
	export let travellers = 1;
	export let travelClass = '';
	export let duration = '';
</script>

<div
	class="bg-base-100 border border-base-300 rounded-xl p-3 flex items-center space-x-3
	       hover:shadow-md transition-shadow duration-200 cursor-pointer"
>
	<!-- Airline Logo -->
	<div
		class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-primary flex items-center justify-center"
	>
		{#if airlineLogo}
			<img
				class="w-full h-full object-cover"
				src={airlineLogo}
				alt={airlineName || 'Airline logo'}
			/>
		{:else}
			<span class="heading-3 text-primary-content">{airlineName.slice(0, 2).toUpperCase()}</span>
		{/if}
	</div>

	<!-- Flight Details -->
	<div class="flex-1 min-w-0">
		<div class="flex items-center gap-2 min-w-0">
			<p class="card-heading flex-shrink-0 truncate">{from}</p>
			<ArrowRightIcon class="flex-shrink-0" />
			<p class="card-heading truncate">{to}</p>
		</div>

		<p class="sub-text base-content-light-60 mt-1 truncate">{dateRange}</p>

		<div class="content-2m mt-2 flex items-center gap-2 text-base-content-light-60">
			<span>{travellers} Traveller{travellers > 1 ? 's' : ''}</span>
			<span class="text-base-300">|</span>
			<span>{travelClass}</span>
			<span class="text-base-300">|</span>
			<span>{duration}</span>
		</div>
	</div>
</div>
