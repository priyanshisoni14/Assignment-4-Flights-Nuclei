export interface ListingAirport {
	iataCode: string;
	city: string;
	countryCode: string;
}

export interface ListingParams {
	src: ListingAirport;
	des: ListingAirport;
	departDate: string; // YYYY-MM-DD
	returnDate: string | null; // null = one way ("NA" in the url)
	partnerCountry: string;
	adults: number;
	children: number;
	infants: number;
	travelClass: { key: string; value: string };
	fareType: string;
}

const NO_RETURN = 'NA';
const SEGMENT_COUNT = 15;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// object -> "DEL/New%20Delhi/IN/BOM/..." (each segment is encoded, so spaces are safe)
// converts object to a string that can be used as a URL path
export const buildListingPath = (p: ListingParams): string =>
	[
		p.src.iataCode,
		p.src.city,
		p.src.countryCode,
		p.des.iataCode,
		p.des.city,
		p.des.countryCode,
		p.departDate,
		p.returnDate ?? NO_RETURN,
		p.partnerCountry,
		p.adults,
		p.children,
		p.infants,
		p.travelClass.key,
		p.travelClass.value,
		p.fareType
	]
		.map((segment) => encodeURIComponent(String(segment)))
		.join('/');

// "DEL/New Delhi/IN/..." -> object. SvelteKit has already decoded the param, so nothing is decoded here.
// Returns null for anything malformed, so the page can show an error instead of crashing.
export const parseListingParams = (path: string): ListingParams | null => {
	const seg = path.replace(/\/$/, '').split('/');
	if (seg.length !== SEGMENT_COUNT) return null;

	const [
		srcIata, srcCity, srcCountry,
		desIata, desCity, desCountry,
		departDate, returnDate, partnerCountry,
		adults, children, infants,
		classKey, classValue, fareType
	] = seg;

	const counts = [adults, children, infants].map(Number);
	const isValid =
		DATE_REGEX.test(departDate) &&
		(returnDate === NO_RETURN || DATE_REGEX.test(returnDate)) &&
		counts.every((n) => Number.isInteger(n) && n >= 0) &&
		counts[0] >= 1 &&
		srcIata !== '' &&
		desIata !== '';
	if (!isValid) return null;

	return {
		src: { iataCode: srcIata, city: srcCity, countryCode: srcCountry },
		des: { iataCode: desIata, city: desCity, countryCode: desCountry },
		departDate,
		returnDate: returnDate === NO_RETURN ? null : returnDate,
		partnerCountry,
		adults: counts[0],
		children: counts[1],
		infants: counts[2],
		travelClass: { key: classKey, value: classValue },
		fareType
	};
};