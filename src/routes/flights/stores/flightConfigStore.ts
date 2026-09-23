// writable creates a Svelte store whose value can be read and updated by different components.
import { writable } from 'svelte/store';

export interface GuestConfig {
	guestType: string;
	textName: string;
	subTextName: string;
	defaultValue: number;
	minValue: number;
	maxValue: number;
	displayOrder: number;
	errorMessage: string;
}

export interface TravellerClassOption {
	key: string;
	value: string;
}

export interface VendorDetail {
	name: string;
	id: number;
	url: string;
}

export interface FlightConfigState {
	guests: GuestConfig[];
	travellers: TravellerClassOption[];
	configMap: Record<string, string>;
	vendorDetails: VendorDetail[];
}

export const flightConfigStore = writable<FlightConfigState>({
	guests: [],
	travellers: [],
	configMap: {},
	vendorDetails: []
});