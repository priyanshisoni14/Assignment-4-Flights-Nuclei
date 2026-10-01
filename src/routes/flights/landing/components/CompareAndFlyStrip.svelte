<script lang="ts">
	import ClearTripIcon from '$lib/flights-commons/icons/cleartrip.svelte';
	import EaseMyTripIcon from '$lib/flights-commons/icons/easemytrip.svelte';
</script>

<div class="flex w-full items-center">
	<p
		class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#676767] md:gap-x-2.5 md:text-sm lg:gap-x-3 lg:text-base"
	>
		<span class="whitespace-nowrap">Compare and fly:</span>

		<span
			class="flex h-3 flex-shrink-0 items-center md:h-3.5 lg:h-4 [&>svg]:h-full [&>svg]:w-auto"
			aria-hidden="true"
		>
			<ClearTripIcon />
		</span>

		<span
			class="flex h-5 flex-shrink-0 items-center md:h-6 lg:h-7 [&>svg]:h-full [&>svg]:w-auto"
			aria-hidden="true"
		>
			<EaseMyTripIcon />
		</span>
	</p>
</div>
