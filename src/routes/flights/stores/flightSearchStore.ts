import { writable } from 'svelte/store';

export interface Location {
	locationName: string;
	iataCode: string;
	airportName?: string;
}

export interface FlightSearchState {
	source: Location;
	destination: Location;
	departureDate: Date;
	returnDate?: Date;
	isRoundTrip: boolean;
	adults: number;
	children: number;
	infants: number;
	travelClass: string;
	nonStopOnly: boolean;
	specialFare: string | null;
}

export const flightSearchStore = writable<FlightSearchState>({
	source: { locationName: 'Bangalore', iataCode: 'BLR', airportName: 'Bangalore International Airport' },
	destination: { locationName: 'New Delhi', iataCode: 'DEL', airportName: 'Indira Gandhi International Airport' },
	departureDate: new Date(),
	returnDate: undefined,
	isRoundTrip: false,
	adults: 1,
	children: 0,
	infants: 0,
	travelClass: 'ECONOMY',
	nonStopOnly: false,
	specialFare: null
});