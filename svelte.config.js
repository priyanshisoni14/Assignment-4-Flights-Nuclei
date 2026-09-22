// import adapter from '@sveltejs/adapter-auto';
import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: node(),
		alias: {
			"$flights": "src/routes/flights",
		},
		version: {
			name: '1.2',
			pollInterval: 600000
		},
		paths: {
			base: "/flights-base/dev"
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	compilerOptions: {
		accessors: process.env.ENABLE_ACCESSORS === 'true'
	}
};

export default config;
