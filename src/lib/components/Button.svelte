<script lang="ts">
	export let disabled = false;
</script>

<button
	{disabled}
	class="w-full h-14 bg-primary hover:bg-primary-focus active:scale-[0.99]
		text-white heading-2 rounded-xl transition-all duration-150"
	on:click
>
	<slot />
</button>
