<script lang="ts">
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
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

	// Figma orders classes Economy → Premium Economy → Business
	// but the config API doesn't guarantee that order, so we force it here.
	const CLASS_ORDER = ['economy class', 'premium economy class', 'business class'];
	function classRank(value: string) {
		const idx = CLASS_ORDER.indexOf(value.toLowerCase());
		return idx === -1 ? CLASS_ORDER.length : idx;
	}
	$: sortedTravellers = [...$flightConfigStore.travellers].sort(
		(a, b) => classRank(a.value) - classRank(b.value)
	);

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
		<h3 class="text-lg font-bold mb-4">Select Travellers</h3>
		<div class="space-y-5">
			{#each $flightConfigStore.guests.sort((a, b) => a.displayOrder - b.displayOrder) as guest}
				{@const config = findGuestConfig(guest.guestType)}
				<div class="flex justify-between items-center">
					<div>
						<p class="font-semibold">{guest.textName}</p>
						<p class="sub-text base-content-light-60">{guest.subTextName}</p>
					</div>
					<div class="flex items-center gap-3">
						<button
							on:click={() => bump(guest.guestType, -1)}
							class="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-lg leading-none text-gray-600 disabled:opacity-30"
							disabled={config && values[guestTypeToField[guest.guestType]] <= config.minValue}
						>
							−
						</button>
						<span class="font-semibold w-4 text-center"
							>{values[guestTypeToField[guest.guestType]]}</span
						>
						<button
							on:click={() => bump(guest.guestType, 1)}
							class="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center text-lg leading-none text-gray-600 disabled:opacity-30"
							disabled={config && values[guestTypeToField[guest.guestType]] >= config.maxValue}
						>
							+
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div>
		<h3 class="text-lg font-bold mb-4">Select Class</h3>
		<div class="space-y-4">
			{#each sortedTravellers as option}
				<label class="relative flex items-center gap-3 cursor-pointer">
					<input
						type="radio"
						name="travelClass"
						bind:group={travelClass}
						value={option.key}
						class="absolute opacity-0 w-0 h-0"
					/>
					<span
						class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
							{travelClass === option.key ? 'border-primary' : 'border-gray-300'}"
					>
						{#if travelClass === option.key}
							<span class="w-2.5 h-2.5 rounded-full bg-primary" />
						{/if}
					</span>
					<span class="font-medium">{option.value}</span>
				</label>
			{/each}
		</div>
	</div>

	<button
		on:click={handleProceed}
		class="w-full h-14 bg-primary hover:bg-primary-focus active:scale-[0.99] text-white heading-2 rounded-xl transition-all duration-150"
	>
		Done
	</button>
</div>
