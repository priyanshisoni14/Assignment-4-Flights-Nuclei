import { LayoutUtils } from '@CDNA-Technologies/svelte-vitals/routes-pages';

/** @type {import('./$types').LayoutLoad} */
export function load({ url }) {
	LayoutUtils.load({ url });
}
