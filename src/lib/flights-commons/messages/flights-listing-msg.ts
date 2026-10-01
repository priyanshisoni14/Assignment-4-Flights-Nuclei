
export interface AirportInfo {
	iataCode: string;
	city: string;
	name: string;
	/** Empty string in listing responses */
	countryCode: string;
	iconUrl: string;
}

export interface KeyValue<K extends string = string> {
	key: K;
	value: string;
}

export type TravellerClassKey = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

export interface PassengerCount {
	adultCount: number;
	childCount: number;
	infantCount: number;
}

/** Free-form bag the backend sends as `{}` on most objects */
export type AdditionalInfo = Record<string, unknown>;

// ---------- Request ----------

export interface AppliedFilterValueList {
	filterValues: string[];
}

export interface AppliedFilter {
	filterId: number;
	appliedFilterValueList: AppliedFilterValueList;
}

export interface AppliedSortFilter {
	tabId: string;
	sortId: string;
	filtersList: AppliedFilter[];
}

export interface FlightListingRequest {
	src: AirportInfo;
	des: AirportInfo;
	/** Format: DD-MM-YYYY */
	departDate: string;
	/** Format: DD-MM-YYYY, empty string for one-way */
	returnDate: string;
	travellerClass: KeyValue<TravellerClassKey>;
	passenger: PassengerCount;
	appliedSortFilter?: AppliedSortFilter[];
	is_round_trip: boolean;
	partnerCountry: string;
	fareType: string;
}

// ---------- Response ----------

export interface SegmentAirlineInfo {
	airlineName: string;
	airlineIconUrl: string;
}

export interface SegmentDetails {
	/** Unused by backend (always ""); use airlineTime / airlineDuration for display */
	arrivalTime: string;
	departTime: string;
	/** Epoch seconds, sent as string */
	arrivalTimestamp: string;
	departTimestamp: string;
	duration: string;
	stops: string;
	airlineCode: string;
	sourceAirportCode: AirportInfo;
	destinationAirportCode: AirportInfo;
	/** e.g. "19:55 - 22:30" */
	airlineTime: string;
	/** e.g. "02h 35m | Non-Stop" */
	airlineDuration: string;
	segmentAirlineInfos: SegmentAirlineInfo[];
	additionalInfo: AdditionalInfo;
}

export interface FareColor {
	red: number;
	green: number;
	blue: number;
}

export interface PartnerFare {
	fareId: string;
	partnerId: number;
	/** e.g. "EaseMyTrip", "ClearTrip" */
	partnerName: string;
	/** Numeric fare, e.g. 5820 */
	fare: number;
	/** e.g. "₹ " (note the trailing space) */
	currencySymbol: string;
	/** Formatted fare, e.g. "5,820" */
	fareS: string;
	/** Only present on some fares */
	color?: FareColor;
	vendorId: number;
	segmentId: string;
	partnerIconUrl: string;
	additionalInfo: AdditionalInfo;
	isLowestPrice: boolean;
}

export interface SpecialFeature {
	/** e.g. "Refundable", "Non-Refundable" */
	title: string;
	icon: string;
}

/** One flight option; fareList holds one entry per booking partner */
export interface FlightSegment {
	segmentId: string;
	/** Named onwardSegmentDetails in the payload (also used for return flights) */
	onwardSegmentDetails: SegmentDetails;
	refundable: boolean;
	hasFreeMeal: boolean;
	handBaggageOnlyFare: boolean;
	fareList: PartnerFare[];
	specialFeatures: SpecialFeature[];
	additionalInfo: AdditionalInfo;
	/** e.g. "Found ₹76 off – Tap to compare", "" when none */
	savingsText: string;
}

export type QuickFilterType =
	| 'NO_OF_STOPS'
	| 'DEPARTURE_TIME'
	| 'AIRLINES'
	| (string & {});

export interface QuickFilter {
	/** filterId; NOT unique across quick filters (all airlines share 6) */
	id: number;
	title: string;
	filterType: QuickFilterType;
	/** e.g. "0", "MORNING", "NIGHT", "6E" */
	filterValue: string;
	isSelected: boolean;
	/** "ONWARD" | "RETURN" */
	appliedOn: 'ONWARD' | 'RETURN' | (string & {});
}

export interface WarningMessage {
	key: string;
	/** HTML string with %s placeholders */
	value: string;
}

export interface FlightListingResponse {
	onwardFlights: FlightSegment[];
	returnFlights: FlightSegment[];
	isRoundTrip: boolean;
	onwardFareCalendar: unknown[];
	quickFilters: QuickFilter[];
	/** Seconds, sent as string, e.g. "14400" */
	minimumTimeGapForRoundTrip: string;
	isInternational: boolean;
	warningMessages: WarningMessage[];
	vendorDetails: unknown[];
	onwardSpecialFlights: FlightSegment[];
	returnSpecialFlights: FlightSegment[];
	/** e.g. "Regular" */
	fareType: string;
	additionalInfo: AdditionalInfo;
}