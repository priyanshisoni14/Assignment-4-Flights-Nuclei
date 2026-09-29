import type {
	FlightSegment,
	QuickFilter
} from '$lib/flights-commons/messages/flights-listing-msg.js';

// "1 Stop" / "Non-Stop" from "02h 35m | Non-Stop"
const stopsCount = (s: FlightSegment): number => {
	const label = s.onwardSegmentDetails.airlineDuration.split('|')[1]?.trim() ?? '';
	return /non-?stop/i.test(label) ? 0 : parseInt(label, 10) || 1;
};
//

// "19:55 - 22:30" -> 19 (departure hour at the origin airport)
const departHour = (s: FlightSegment): number =>
	Number(s.onwardSegmentDetails.airlineTime.split(':')[0]);

const matchesChip = (s: FlightSegment, chip: QuickFilter): boolean => {
	switch (chip.filterType) {
		case 'NO_OF_STOPS':
			return stopsCount(s) === Number(chip.filterValue);
		case 'DEPARTURE_TIME': {
			const h = departHour(s);
			return chip.filterValue === 'MORNING' ? h >= 5 && h < 12 : h >= 18 || h < 5; // NIGHT
		}
		case 'AIRLINES':
			// airline code is the 3rd token of segmentId, e.g. DEL_BOM_6E_...
			return s.segmentId.split('_')[2] === chip.filterValue;
		default:
			return true; // unknown chip type: don't hide anything
	}
};

/** OR within a filter type (Indigo + Air India), AND across types (Non Stop + Morning) */
export const applyQuickFilters = (
	flights: FlightSegment[],
	chips: QuickFilter[]
): FlightSegment[] => {
	const groups = new Map<string, QuickFilter[]>();
	for (const c of chips) {
		if (!c.isSelected) continue;
		groups.set(c.filterType, [...(groups.get(c.filterType) ?? []), c]);
	}
	if (groups.size === 0) return flights;

	return flights.filter((f) =>
		[...groups.values()].every((group) => group.some((chip) => matchesChip(f, chip)))
	);
};