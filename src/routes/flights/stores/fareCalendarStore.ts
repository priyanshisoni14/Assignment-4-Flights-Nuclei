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

// 2026-10-05 -> 20261005, so dates compare as plain numbers
const dateValue = ({ calendarDate: d }: FareDetail) => d.year * 10000 + d.month * 100 + d.day;

// the api does not guarantee order (or uniqueness): sort oldest -> newest and keep one entry per date
const sortAndDedupe = (fares: FareDetail[]): FareDetail[] => {
	const byDate = new Map<number, FareDetail>();
	for (const f of fares) byDate.set(dateValue(f), f); // a later duplicate replaces the earlier one
	return [...byDate.entries()].sort((a, b) => a[0] - b[0]).map(([, f]) => f);
};

export const setFareCalendar = (fares: FareDetail[]) =>
	fareCalendarStore.set({ fares: sortAndDedupe(fares), isLoading: false });