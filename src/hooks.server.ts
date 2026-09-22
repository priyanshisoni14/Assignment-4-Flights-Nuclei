import { hooksHandler } from '@CDNA-Technologies/svelte-vitals/util';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await hooksHandler({event, resolve});
	return response;
}