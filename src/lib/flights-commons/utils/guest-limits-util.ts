import { get, type Writable } from 'svelte/store';
import type { FlightConfigState } from '$flights/stores/flightConfigStore.js';

export function getGuestLimits(guestType: 'ADULT' | 'CHILD' | 'INFANT', flightConfigStore: Writable<FlightConfigState>) {
	const config = get(flightConfigStore);
	const guest = config.guests.find((g) => g.guestType === guestType);
	return {
		min: guest?.minValue ?? (guestType === 'ADULT' ? 1 : 0),
		max: guest?.maxValue ?? 9
	};
}

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}