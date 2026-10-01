import { writable } from 'svelte/store';
import type { FareDetail } from '$lib/flights-commons/messages/flights-fare-calendar-msg.js';

export interface FareCalendarState {
	fares: FareDetail[];
	isLoading: boolean;
}

const initialState: FareCalendarState = {
	fares: [],
	isLoading: true
};

export const fareCalendarStore = writable<FareCalendarState>(initialState);

export const resetFareCalendar = () => fareCalendarStore.set({ ...initialState });

export const setFareCalendarLoading = () =>
	fareCalendarStore.update((s) => ({ ...s, isLoading: true }));

export const setFareCalendar = (fares: FareDetail[]) =>
	fareCalendarStore.set({ fares, isLoading: false });