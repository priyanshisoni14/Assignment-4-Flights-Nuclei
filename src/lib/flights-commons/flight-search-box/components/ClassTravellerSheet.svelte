<script lang="ts">
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let adults = $flightSearchStore.adults;
	let children = $flightSearchStore.children;
	let infants = $flightSearchStore.infants;
	let travelClass = $flightSearchStore.travelClass;

	const guestTypeToField: Record<string, 'adults' | 'children' | 'infants'> = {
		ADULT: 'adults',
		CHILD: 'children',
		INFANT: 'infants'
	};
	const values: Record<string, number> = { adults, children, infants };

	function findGuestConfig(guestType: string) {
		return $flightConfigStore.guests.find((g) => g.guestType === guestType);
	}

	function bump(guestType: string, delta: number) {
		const field = guestTypeToField[guestType];
		const config = findGuestConfig(guestType);
		if (!config) return;
		const next = Math.max(config.minValue, Math.min(config.maxValue, values[field] + delta));
		values[field] = next;
		if (field === 'adults') adults = next;
		if (field === 'children') children = next;
		if (field === 'infants') infants = next;
	}

	function handleProceed() {
		flightSearchStore.update((s) => ({ ...s, adults, children, infants, travelClass }));
		dispatch('proceed');
	}
</script>

<div class="flex flex-col p-4 space-y-6">
	<div>
		<h3 class="nav-text mb-3">Select Travellers</h3>
		{#each $flightConfigStore.guests.sort((a, b) => a.displayOrder - b.displayOrder) as guest}
			<div class="flex justify-between items-center py-2">
				<div>
					<p class="card-sub-heading">{guest.textName}</p>
					<p class="sub-text base-content-light-60">{guest.subTextName}</p>
				</div>
				<div class="flex items-center gap-3 bg-base-100 rounded-full px-2 py-1">
					<button on:click={() => bump(guest.guestType, -1)} class="h-8 w-8 text-primary">-</button>
					<span class="w-6 text-center">{values[guestTypeToField[guest.guestType]]}</span>
					<button on:click={() => bump(guest.guestType, 1)} class="h-8 w-8 text-primary">+</button>
				</div>
			</div>
		{/each}
	</div>

	<div>
		<h3 class="nav-text mb-3">Select Class</h3>
		{#each $flightConfigStore.travellers as option}
			<label class="flex items-center gap-3 py-2">
				<input
					type="radio"
					name="travelClass"
					bind:group={travelClass}
					value={option.key}
					class="radio radio-primary"
				/>
				<span class="card-sub-heading">{option.value}</span>
			</label>
		{/each}
	</div>

	<button class="w-full bg-primary text-white heading-2 rounded-lg py-3" on:click={handleProceed}>
		Done
	</button>
</div>
