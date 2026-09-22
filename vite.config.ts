import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		target: ['es2015', 'safari11']
	},
	plugins: [sveltekit()],
	test: {
		mockReset: true,
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.test.{js,ts}'],
		setupFiles: 'src/setupTests.ts',
		deps: {
			inline: [`@sveltejs/kit`]
		}
	},
	optimizeDeps: {
		exclude: ['@CDNA-Technologies/svelte-vitals']
	},
	server: {
		fs: {
			allow: ['.svelte-kit', 'node-modules', 'src', 'src/lib', 'src/routes']
		}
	}
};

export default config;
