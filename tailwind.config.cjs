/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@CDNA-Technologies/svelte-vitals/tailwind')],
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@CDNA-Technologies/svelte-vitals/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {}
	}
};