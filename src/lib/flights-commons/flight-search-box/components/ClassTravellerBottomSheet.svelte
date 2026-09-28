<script lang="ts">
	import { flightsTranslationStore } from '$flights/i18n';
	import { flightConfigStore } from '$flights/stores/flightConfigStore.js';
	import { flightSearchStore } from '$flights/stores/flightSearchStore.js';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import { createEventDispatcher } from 'svelte';
	import Button from '../../../components/Button.svelte';

	const dispatch = createEventDispatcher();

	// Put the current store values into local variables
	// so the store is not updated until the user clicks Done.
	let adults = $flightSearchStore.adults;
	let children = $flightSearchStore.children;
	let infants = $flightSearchStore.infants;
	let travelClass = $flightSearchStore.travelClass;

	// Map API guest types to the corresponding search state
	const guestTypeToField: Record<string, 'adults' | 'children' | 'infants'> = {
		ADULT: 'adults',
		CHILD: 'children',
		INFANT: 'infants'
	};

	const values: Record<string, number> = {
		adults,
		children,
		infants
	};

	// display order for travel classes, per design — excludes First Class entirely
	const CLASS_DISPLAY_ORDER = ['ECONOMY', 'PREMIUM', 'BUSINESS'];

	// Find the config for a given guest type
	function findGuestConfig(guestType: string) {
		return $flightConfigStore.guests.find((g) => g.guestType === guestType);
	}

	// Bump the value of a guest type by a given delta sets min and max values
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

	//  persists the existing state and update the store with the new values
	function handleProceed() {
		NucleiLogger.logInfo('Flights', 'Done button clicked');
		flightSearchStore.update((s) => ({
			...s,
			adults,
			children,
			infants,
			travelClass
		}));

		dispatch('proceed');
	}

	$: sortedTravellers = [...$flightConfigStore.travellers]
		.filter((option) => CLASS_DISPLAY_ORDER.includes(option.key))
		.sort((a, b) => CLASS_DISPLAY_ORDER.indexOf(a.key) - CLASS_DISPLAY_ORDER.indexOf(b.key));
</script>

<div class="flex flex-col gap-6 bg-[#F3F3F7] p-6">
	<div>
		<h3 class="mb-4 text-xl font-bold text-black">{$flightsTranslationStore(
				'flights.select_travellers'
			)}</h3>

		<div class="space-y-5">
			{#each $flightConfigStore.guests.sort((a, b) => a.displayOrder - b.displayOrder) as guest}
				{@const config = findGuestConfig(guest.guestType)}
				{@const currentValue = values[guestTypeToField[guest.guestType]]}

				<div class="flex items-center justify-between">
					<div>
						<p class="font-semibold text-black">{guest.textName}</p>
						<p class="text-sm text-gray-500">
							{guest.subTextName}
						</p>
					</div>

					<!-- single unified pill: minus, value, plus all inside one white rounded box -->
					<div class="flex items-center gap-4 rounded-xl bg-white px-4 py-2.5 shadow-sm">
						<button
							type="button"
							on:click={() => bump(guest.guestType, -1)}
							class="text-lg leading-none text-gray-600 disabled:opacity-30"
							aria-label={`Decrease ${guest.textName}, ${guest.subTextName}, to ${
								currentValue - 1
							}`}
							disabled={config && currentValue <= config.minValue}
						>
							−
						</button>

						<span
							class="w-4 text-center text-lg font-bold text-black"
							aria-live="polite"
							aria-atomic="true"
						>
							{currentValue}
						</span>

						<button
							type="button"
							on:click={() => bump(guest.guestType, 1)}
							class="text-lg leading-none text-gray-600 disabled:opacity-30"
							aria-label={`Increase ${guest.textName}, ${guest.subTextName}, to ${
								currentValue + 1
							}`}
							disabled={config && currentValue >= config.maxValue}
						>
							+
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div>
		<h3 class="mb-4 text-lg font-bold text-black">{$flightsTranslationStore(
				'flights.select_class'
			)}</h3>

		<div class="space-y-4">
			{#each sortedTravellers as option}
				<label class="relative flex cursor-pointer items-center gap-3">
					<input
						type="radio"
						name="travelClass"
						bind:group={travelClass}
						value={option.key}
						class="absolute h-0 w-0 opacity-0"
					/>

					<span
						class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2
							{travelClass === option.key ? 'border-[#112E47]' : 'border-gray-300'}"
						aria-hidden="true"
					>
						{#if travelClass === option.key}
							<span class="h-2.5 w-2.5 rounded-full bg-[#112E47]" aria-hidden="true" />
						{/if}
					</span>

					<span class="font-medium text-black">{option.value}</span>
				</label>
			{/each}
		</div>
	</div>

	<Button on:click={handleProceed}>{$flightsTranslationStore(
			'flights.done'
		)}</Button>
</div>
