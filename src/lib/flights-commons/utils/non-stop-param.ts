// listing url: ?sort_id=1&stop=0   landing url: ?nonStop=true|false
export const isNonStopInUrl = (sp: URLSearchParams) =>
	sp.get('stop') === '0' || sp.get('nonStop') === 'true';

export const setListingNonStop = (sp: URLSearchParams, on: boolean) => {
	sp.delete('nonStop'); // landing-only key, must not linger on the listing
	if (on) {
		sp.set('sort_id', '1');
		sp.set('stop', '0');
	} else {
		sp.delete('sort_id');
		sp.delete('stop');
	}
};