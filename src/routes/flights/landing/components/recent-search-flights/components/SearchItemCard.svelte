<script>
	import ChevronRightIcon from '$lib/flights-commons/icons/ChevronRightIcon.svelte';
	import HistoryIcon from '$lib/flights-commons/icons/HistoryIcon.svelte';

	export let from = '';
	export let to = '';
	export let dateRange = '';
</script>

<button
	type="button"
	class="flex w-full items-center justify-between gap-3 rounded-2xl bg-white p-4 text-left"
	aria-label={`${from} to ${to}, ${dateRange}. Double tap to search again.`}
>
	<div class="flex min-w-0 items-center gap-3" aria-hidden="true">
		<span class="flex-shrink-0 text-gray-600 [&>svg]:h-15 [&>svg]:w-15">
			<HistoryIcon />
		</span>
		<div class="min-w-0">
			<p class="truncate text-xl font-bold text-black">
				<span>{from}</span>
				<span class="mx-2 font-normal text-black">→</span>
				<span>{to}</span>
			</p>
			<p class="mt-1 truncate text-base text-gray-500">{dateRange}</p>
		</div>
	</div>

	<div class="flex-shrink-0 text-black [&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">
		<ChevronRightIcon />
	</div>
</button>
