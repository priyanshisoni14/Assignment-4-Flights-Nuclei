<script lang="ts">
	// extra classes for the wrapper, e.g. a background colour
	let className = '';
	export { className as class };
</script>

<!-- shared look for the dark flights app bars: navy bar, flat buttons, white icons -->
<div
	class="[&_nav.bg-secondary]:!bg-[#112e47]
	[&_nav.bg-secondary_>_button]:!shadow-none
	[&_nav.bg-secondary_>_button]:!p-0
	[&_nav.bg-secondary_>_button_svg]:!fill-white
	[&_nav.bg-secondary_>_button_svg]:!stroke-white
	[&_nav.bg-secondary_>_button_svg_path]:!fill-white {className}"
>
	<slot />
</div>

<style>
	/* Back button: remove the DaisyUI outline/border */
	:global(nav button[aria-label='Back button']) {
		border: 0 !important;
		border-width: 0 !important;
		border-color: transparent !important;
		outline: 0 !important;
		box-shadow: none !important;
		background: transparent !important;
	}

	/* Also remove any border from the inner back-button container */
	:global(nav button[aria-label='Back button'] > div.bg-secondary) {
		background-color: #112e47 !important;
		border: 0 !important;
		border-width: 0 !important;
		border-color: transparent !important;
		outline: 0 !important;
		box-shadow: none !important;
	}

	/* Keep the arrow unchanged except for its white colour */
	:global(nav button[aria-label='Back button'] > div.bg-secondary svg),
	:global(nav button[aria-label='Back button'] > div.bg-secondary svg path) {
		fill: #ffffff !important;
		stroke: #ffffff !important;
	}
</style>
