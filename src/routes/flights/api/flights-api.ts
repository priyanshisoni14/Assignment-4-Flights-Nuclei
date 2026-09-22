import { ApiUtil, type DataOrError } from '@CDNA-Technologies/svelte-vitals/api-util';

export async function fetchFlightsCoreConfig(): Promise<DataOrError<any>> {
	return await ApiUtil.post(
		'/com.gonuclei.flights.v1.LandingService/getConfig'
	);
}

export async function getFlightBookingDetails(
	requestType: any,
	resultsPerPage: number,
	pageNumberToGet: number
): Promise<DataOrError<any>> {
	const flightBookingsRequest = {
		paginationRequest: {
			resultsPerPage,
			pageNumberToGet
		},
		requestType
	};

	return await ApiUtil.post(
		'/com.gonuclei.flights.v1.FlightTicketService/GetAllBookings',
		flightBookingsRequest
	);
}