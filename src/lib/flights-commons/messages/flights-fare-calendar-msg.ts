export interface CalendarDate {
	year: number;
	month: number; // 1-12
	day: number;
}

export interface FareCalendarTravellers {
	adultCount: number;
	childCount: number;
	infantCount: number;
}

export interface FareCalendarAdditionalInfo {
	sourceCode: string;
	destCode: string;
	isRoundTrip: string; // backend expects "true" / "false" as a string
}

export interface CalendarWithFareRequest {
	categoryId: number;
	startDate: CalendarDate;
	endDate: CalendarDate;
	travellers: FareCalendarTravellers;
	additionalInfo: FareCalendarAdditionalInfo;
}

export interface FareDetail {
	calendarDate: CalendarDate;
	cheapestFare: number;
	colorCode: string;
	cheapestFareString: string;
}

export interface FareCalendarStatus {
	responseCode: string;
	responseCodeCause: string;
	responseMessage: string;
}

export interface CalendarWithFareResponse {
	enabled: boolean;
	onwardJourneyFareDetails: FareDetail[];
	returnJourneyFareDetails: FareDetail[];
	status: FareCalendarStatus;
}