import type {
	AppliedSortFilter,
	QuickFilter
} from '$lib/flights-commons/messages/flights-listing-msg.js';

// sortId sent with every filtered request (default sort)
const DEFAULT_SORT_ID = '1';

/**
 * Converts the selected quick-filter chips into the request's appliedSortFilter.
 * - grouped by tab (ONWARD / RETURN), then by filterId
 * - chips sharing a filterId (e.g. all airlines = 6) merge into one filterValues array
 * - returns undefined when nothing is selected, so the field is left out of the request
 */
export const buildAppliedSortFilter = (chips: QuickFilter[]): AppliedSortFilter[] | undefined => {
	const selected = chips.filter((c) => c.isSelected);
	if (selected.length === 0) return undefined;

	const tabs = new Map<string, Map<number, string[]>>();
	for (const chip of selected) {
		const tabId = chip.appliedOn || 'ONWARD';
		const filters = tabs.get(tabId) ?? new Map<number, string[]>();
		filters.set(chip.id, [...(filters.get(chip.id) ?? []), chip.filterValue]);
		tabs.set(tabId, filters);
	}

	return [...tabs].map(([tabId, filters]) => ({
		tabId,
		sortId: DEFAULT_SORT_ID,
		filtersList: [...filters].map(([filterId, filterValues]) => ({
			filterId,
			appliedFilterValueList: { filterValues }
		}))
	}));
};