<script lang="ts">
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { clamp, getGuestLimits } from '$lib/flights-commons/utils/guest-limits-util.js';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';

	const dispatch = createEventDispatcher();

	// seed local state from the current store, not from config defaults —
	// if the user already picked values, re-opening the sheet shouldn't reset them
	const initial = get(flightSearchStore);
	let adults = initial.adults;
	let children = initial.children;
	let infants = initial.infants;
	let selectedClass = initial.travelClass;

	function updateCount(guestType: 'ADULT' | 'CHILD' | 'INFANT', change: number) {
		const limits = getGuestLimits(guestType, flightConfigStore);
		if (guestType === 'ADULT') adults = clamp(adults + change, limits.min, limits.max);
		if (guestType === 'CHILD') children = clamp(children + change, limits.min, limits.max);
		if (guestType === 'INFANT') infants = clamp(infants + change, limits.min, limits.max);
	}

	function countFor(guestType: string) {
		if (guestType === 'ADULT') return adults;
		if (guestType === 'CHILD') return children;
		return infants;
	}

	function handleProceed() {
		flightSearchStore.update((s) => ({
			...s,
			adults,
			children,
			infants,
			travelClass: selectedClass
		}));
		dispatch('proceed');
	}
</script>

<div class="flex flex-col p-4 space-y-6">
	<div>
		<h3 class="nav-text mb-4">Select Traveller(s)</h3>
		<div class="space-y-4">
			{#each $flightConfigStore.guests as guest}
				{@const limits = getGuestLimits(guest.guestType, flightConfigStore)}
				<div class="flex justify-between items-center">
					<div>
						<p class="card-sub-heading">{guest.textName}</p>
						<p class="sub-text base-content-light-60">{guest.subTextName}</p>
					</div>
					<div class="flex items-center bg-base-200 rounded-xl px-1 py-1">
						<button
							class="px-3 cta-text text-primary disabled:opacity-30"
							on:click={() => updateCount(guest.guestType, -1)}
							disabled={countFor(guest.guestType) <= limits.min}
						>
							−
						</button>
						<span class="px-4 font-semibold w-8 text-center">{countFor(guest.guestType)}</span>
						<button
							class="px-3 cta-text text-primary disabled:opacity-30"
							on:click={() => updateCount(guest.guestType, 1)}
							disabled={countFor(guest.guestType) >= limits.max}
						>
							+
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div>
		<h3 class="nav-text mb-4">Select Class</h3>
		<div class="space-y-3">
			{#each $flightConfigStore.travellers as classOption}
				<label class="flex items-center gap-4">
					<input
						type="radio"
						name="travelClass"
						bind:group={selectedClass}
						value={classOption.key}
						class="radio radio-primary"
					/>
					<span class="card-sub-heading">{classOption.value}</span>
				</label>
			{/each}
		</div>
	</div>

	<button on:click={handleProceed} class="btn btn-primary w-full">Done</button>
</div>
