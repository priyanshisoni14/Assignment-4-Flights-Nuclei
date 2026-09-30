<script lang="ts">
	import FlightSearchBox from '$lib/flights-commons/flight-search-box/FlightSearchBox.svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let open = false;
	const dispatch = createEventDispatcher<{ close: void; searched: void }>();

	const close = () => dispatch('close');
	const onKeydown = (e: KeyboardEvent) => {
		if (open && e.key === 'Escape') close();
	};
</script>

<svelte:window on:keydown={onKeydown} />

{#if open}
	<!-- backdrop -->
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 bg-black/60"
		transition:fade={{ duration: 200 }}
		on:click={close}
	/>

	<!-- top sheet: hangs from the top edge and slides down -->
	<div
		class="fixed inset-x-0 top-0 z-50 mx-auto flex max-h-[95vh] w-full flex-col overflow-y-auto rounded-b-2xl bg-[#F0F0F5] px-6 pb-3 pt-6 md:max-w-2xl"
		transition:fly={{ y: -600, duration: 250 }}
		role="dialog"
		aria-modal="true"
		aria-label="Modify Search"
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold text-black">Modify Search</h2>
			<button
				type="button"
				class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#112e47]"
				aria-label="Close"
				on:click={close}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="M2 2L14 14M14 2L2 14"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>

		<!-- the exact landing component, so it matches the design and stays in sync -->
		<div class="flex justify-center">
			<FlightSearchBox mode="modify" on:search={() => dispatch('searched')} />
		</div>

		<!-- handle pill from the design; tapping it closes the sheet too -->
		<button
			type="button"
			class="mx-auto mt-3 flex h-5 w-full items-center justify-center"
			aria-label="Close"
			on:click={close}
		>
			<span class="h-1 w-10 rounded-full bg-[#CACACA]" />
		</button>
	</div>
{/if}
