import { getFareCalendar } from '$flights/api/flights-api.js';
import { setFareCalendar, setFareCalendarLoading } from '$flights/stores/fareCalendarStore.js';
import type { CalendarDate } from '$lib/flights-commons/messages/flights-fare-calendar-msg.js';
import dayjs from 'dayjs';
import type { ListingParams } from './listing-url.js';

// convert a dayjs date to the fare calendar api format
export const toCalendarDate = (d: dayjs.Dayjs): CalendarDate => ({
	year: d.year(),
	month: d.month() + 1,
	day: d.date()
});

// calls the fare calendar api for the search in the url and puts the result in the store
export const loadFareCalendar = async (p: ListingParams) => {
	// round trip: the strip is hidden, so skip the api call
	if (p.returnDate !== null) {
		setFareCalendar([]);
		return;
	}
	setFareCalendarLoading();

	const start = dayjs(); // today
	const defaultEnd = start.add(15, 'day'); // 15 days from today
	const depart = dayjs(p.departDate);
	// make sure the searched date is always inside the requested window
	const end = depart.isAfter(defaultEnd) ? depart.add(7, 'day') : defaultEnd;

	const result = await getFareCalendar({
		categoryId: 7,
		startDate: toCalendarDate(start),
		endDate: toCalendarDate(end),
		travellers: { adultCount: p.adults, childCount: p.children, infantCount: p.infants },
		additionalInfo: {
			sourceCode: p.src.iataCode,
			destCode: p.des.iataCode,
			isRoundTrip: String(p.returnDate !== null)
		}
	});

	// on failure or when the feature is disabled, store an empty list so the calendar hides
	setFareCalendar(
		!result.hasError() && result.response?.enabled
			? result.response.onwardJourneyFareDetails ?? []
			: []
	);
};