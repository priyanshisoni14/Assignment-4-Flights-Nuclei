<script lang="ts">
	import { base } from '$app/paths';
	import { ErrorPage } from '@CDNA-Technologies/svelte-vitals/routes-pages';

	// SvelteKit passes these to the root error page (see .svelte-kit/generated/root.svelte).
	// Declaring them silences the "unknown prop" dev warnings; unused here.
	export let data: unknown = undefined;
	export let form: unknown = undefined;
</script>

<ErrorPage
  path={base + "/flights/landing"}
  title="flights"
/>
