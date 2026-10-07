export const REGULAR_FARE_TYPE = 'regular';
export const SPECIAL_FARE_TYPES = ['student', 'senior_citizen', 'armed_forces'] as const;

export const toFareType = (specialFare: string | null) => specialFare ?? REGULAR_FARE_TYPE;
export const fromFareType = (fareType: string | null | undefined): string | null =>
	(SPECIAL_FARE_TYPES as readonly string[]).includes(fareType ?? '') ? (fareType as string) : null;