<script lang="ts">
	import { Layout } from '@CDNA-Technologies/svelte-vitals/routes-pages';
	export let data: any;
</script>

<Layout {data}>
	<slot />
</Layout>
