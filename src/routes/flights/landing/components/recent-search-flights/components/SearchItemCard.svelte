<script>
	import ChevronRightIcon from '$lib/flights-commons/icons/ChevronRightIcon.svelte';
	import HistoryIcon from '$lib/flights-commons/icons/HistoryIcon.svelte';

	export let from = '';
	export let to = '';
	export let dateRange = '';
</script>

<div
	class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
>
	<div class="flex items-center space-x-4">
		<div class="base-200 p-2 rounded-full">
			<HistoryIcon />
		</div>
		<div class="flex-1">
			<p class="card-heading truncate">
				<span>{from}</span>
				<span class="ml-3">{to}</span>
			</p>

			<p class="sub-text base-content-light-60 mt-1 truncate">{dateRange}</p>
		</div>
	</div>

	<div class="flex-shrink-0">
		<ChevronRightIcon />
	</div>
</div>
