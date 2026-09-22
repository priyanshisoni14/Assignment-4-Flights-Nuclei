<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const classOptions = ['Economy', 'Premium Economy', 'Business'];

	// TODO: replace with real min/max from ConfigResponse.searchRequest.guests once API is wired
	const LIMITS = {
		adults: { min: 1, max: 9 },
		children: { min: 0, max: 9 },
		infants: { min: 0, max: 9 }
	};

	let adults = $flightSearchStore.adults;
	let children = $flightSearchStore.children;
	let infants = $flightSearchStore.infants;
	let travelClass = $flightSearchStore.travelClass;

	function bump(field: 'adults' | 'children' | 'infants', delta: number) {
		const limits = LIMITS[field];
		if (field === 'adults') adults = Math.max(limits.min, Math.min(limits.max, adults + delta));
		if (field === 'children')
			children = Math.max(limits.min, Math.min(limits.max, children + delta));
		if (field === 'infants') infants = Math.max(limits.min, Math.min(limits.max, infants + delta));
	}

	function handleProceed() {
		flightSearchStore.update((s) => ({ ...s, adults, children, infants, travelClass }));
		dispatch('proceed');
	}
</script>

<div class="flex flex-col p-4 space-y-6">
	<div>
		<h3 class="nav-text mb-3">Travellers</h3>
		{#each [['adults', 'Adults', '12+ yrs'], ['children', 'Children', '2-11 yrs'], ['infants', 'Infants', 'Under 2 yrs']] as [field, label, sub]}
			<div class="flex justify-between items-center py-2">
				<div>
					<p class="card-sub-heading">{label}</p>
					<p class="sub-text base-content-light-60">{sub}</p>
				</div>
				<div class="flex items-center gap-3 bg-base-200 rounded-full px-2 py-1">
					<button on:click={() => bump(field, -1)} class="px-2 text-primary">-</button>
					<span class="w-6 text-center"
						>{field === 'adults' ? adults : field === 'children' ? children : infants}</span
					>
					<button on:click={() => bump(field, 1)} class="px-2 text-primary">+</button>
				</div>
			</div>
		{/each}
	</div>

	<div>
		<h3 class="nav-text mb-3">Class</h3>
		{#each classOptions as option}
			<label class="flex items-center gap-3 py-2">
				<input
					type="radio"
					name="travelClass"
					bind:group={travelClass}
					value={option}
					class="radio radio-primary"
				/>
				<span class="card-sub-heading">{option}</span>
			</label>
		{/each}
	</div>

	<button class="w-full bg-primary text-white heading-3 rounded-lg py-3" on:click={handleProceed}>
		Proceed
	</button>
</div>
