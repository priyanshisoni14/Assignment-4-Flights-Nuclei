// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

// Lets plain `tsc`/tsserver resolve `.svelte` imports. `svelte-check` injects
// its own equivalent shim, so this is only a fallback for the editor's
// TypeScript server. Keep this file free of top-level import/export so the
// global `App` namespace above stays global.
declare module '*.svelte' {
	import type { ComponentType, SvelteComponent } from 'svelte';
	const component: ComponentType<SvelteComponent>;
	export default component;
}
