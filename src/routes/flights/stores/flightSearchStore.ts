import { writable } from 'svelte/store';

export interface Location {
	locationName: string;
	iataCode: string;
}

export interface FlightSearchState {
	source: Location;
	destination: Location;
	departureDate: Date;
	returnDate?: Date;
	adults: number;
	children: number;
	infants: number;
	travelClass: string;
	nonStopOnly: boolean;
	specialFare: string | null;
}

export const flightSearchStore = writable<FlightSearchState>({
	source: { locationName: 'Bangalore', iataCode: 'BLR' },
	destination: { locationName: 'New Delhi', iataCode: 'DEL' },
	departureDate: new Date('2026-03-17'),
	returnDate: undefined,
	adults: 1,
	children: 0,
	infants: 0,
	travelClass: 'Economy',
	nonStopOnly: true,
	specialFare: null
});