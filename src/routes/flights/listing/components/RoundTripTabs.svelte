<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type Leg = 'onward' | 'return';
	export let activeLeg: Leg = 'onward';

	const dispatch = createEventDispatcher<{ change: Leg }>();
	const tabs: { id: Leg; label: string }[] = [
		{ id: 'onward', label: 'Onward' },
		{ id: 'return', label: 'Return' }
	];

	// RoundTripListing shows both columns once its own area is 700px wide. This bar spans the
	// whole screen (page padding is at most 128px in total), so it hides at 700 + 130
	let width = 0;
	$: showTabs = width < 830;
</script>

<div class="w-full" bind:clientWidth={width}>
	{#if showTabs}
		<div class="flex w-full bg-[#112e47]" role="tablist" aria-label="Flight direction">
			{#each tabs as tab}
				<button
					type="button"
					role="tab"
					aria-selected={activeLeg === tab.id}
					class="relative flex-1 py-3 text-center text-base font-medium sm:text-lg {activeLeg ===
					tab.id
						? 'text-white'
						: 'text-white/70'}"
					on:click={() => dispatch('change', tab.id)}
				>
					{tab.label}
					{#if activeLeg === tab.id}
						<span class="absolute inset-x-6 bottom-0 h-[0.1875rem] rounded-t bg-white" />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
