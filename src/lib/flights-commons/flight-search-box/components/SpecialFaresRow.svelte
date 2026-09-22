<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';

	const fares = [
		{ id: 'student', label: 'Student', badge: 'New' },
		{ id: 'senior_citizen', label: 'Senior Citizen' },
		{ id: 'armed_forces', label: 'Armed Forces' }
	];

	function toggle(id: string) {
		flightSearchStore.update((s) => ({ ...s, specialFare: s.specialFare === id ? null : id }));
	}
</script>

<div class="w-full border-t border-base-300 px-4 md:px-6 py-3.5">
	<p class="sub-text base-content-light-60 mb-2">Special Fares (Optional)</p>
	<div class="flex gap-2 flex-wrap">
		{#each fares as fare}
			<button
				class="px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-sm flex items-center gap-1.5
					{$flightSearchStore.specialFare === fare.id
					? 'bg-primary text-white border-primary'
					: 'bg-base-200 border-base-300 text-base-content'}"
				on:click={() => toggle(fare.id)}
			>
				{fare.label}
				{#if fare.badge}
					<span class="text-[10px] bg-red-500 text-white px-1 rounded">{fare.badge}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
