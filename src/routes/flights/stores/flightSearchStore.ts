import { writable } from 'svelte/store';

export interface Location {
	locationName: string;
	iataCode: string;
	airportName?: string;
	countryCode?: string;
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

// true while the Modify Search sheet is open on the listing screen. It is a store (not a local
// variable) so it survives the trip to the search-city screen, where the listing is destroyed
export const modifySheetOpen = writable(false);