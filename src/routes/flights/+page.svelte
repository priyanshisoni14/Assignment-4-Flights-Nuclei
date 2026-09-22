<script lang="ts">
    import { base } from "$app/paths";
    import { onMount } from "svelte";

    onMount(() => {
        location.replace(base + "/flights/landing");
    });
</script>
