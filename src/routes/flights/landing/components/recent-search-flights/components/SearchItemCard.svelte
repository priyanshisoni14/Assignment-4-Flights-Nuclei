<script>
	import ChevronRightIcon from '$lib/flights-commons/icons/ChevronRightIcon.svelte';
	import HistoryIcon from '$lib/flights-commons/icons/HistoryIcon.svelte';

	export let from = '';
	export let to = '';
	export let dateRange = '';
</script>

<div
	class="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between gap-3 cursor-pointer"
>
	<div class="flex items-center gap-3 min-w-0">
		<div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 [&>svg]:w-full [&>svg]:h-full">
			<HistoryIcon />
		</div>
		<div class="min-w-0">
			<p class="card-heading truncate">
				<span>{from}</span>
				<span class="mx-2 text-gray-400 font-normal">→</span>
				<span>{to}</span>
			</p>
			<p class="sub-text base-content-light-60 mt-1 truncate">{dateRange}</p>
		</div>
	</div>

	<div class="flex-shrink-0 opacity-50">
		<ChevronRightIcon />
	</div>
</div>
