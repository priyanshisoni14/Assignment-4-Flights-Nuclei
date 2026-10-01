/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@CDNA-Technologies/svelte-vitals/tailwind')],
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@CDNA-Technologies/svelte-vitals/**/*.{html,js,svelte,ts}',
		// this is a single ~18MB line of base64 svg data with no class attributes.
		// tailwind's extractor runs one regex over each file, and a string that big
		// overflows the stack ("Maximum call stack size exceeded"). it contributes no
		// classes, so excluding it changes the generated css not at all.
		'!./src/lib/flights-commons/icons/Flights.svelte'
	],
	theme: {
		extend: {
			fontWeight: {
				bold: '500'
			}
		}
	}
};