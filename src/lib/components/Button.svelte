<script lang="ts">
	export let disabled = false;
</script>

<button
	{disabled}
	class="w-full h-14 bg-[#1ba4f7] hover:bg-[#0d93d6] active:scale-[0.99]
		text-white heading-2 rounded-xl shadow-sm transition-all duration-150"
	on:click
>
	<slot />
</button>
