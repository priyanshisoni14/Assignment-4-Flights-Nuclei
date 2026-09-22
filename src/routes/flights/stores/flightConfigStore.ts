import { writable } from 'svelte/store';

export const flightConfigStore = writable({
	guests: [] as any[],
	travellers: [] as any[],
	configMap: {} as Record<string, string>,
	vendorDetails: [] as any[]
});