<script lang="ts">
	export let size = 48;
	export let color = '#929292';
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 48 48"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
>
	<!-- Airplane -->
	<path
		d="M9 19.5L15 23L20 14L18 8
		C17.8 7.2 18.2 6.5 19 6.2
		L21.2 5.5
		C21.9 5.3 22.6 5.6 23 6.2
		L27 13L33 17
		L39 22
		C41.2 23.8 42.5 26.3 42.5 29
		C42.5 30 41.4 30.6 40.5 30
		L29 23.5
		L22 22
		L16 28
		L9 24
		C8 23.4 7.6 22.2 8.2 21.2
		L9 19.5Z"
		stroke={color}
		stroke-width="2.8"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>

	<!-- Ground line -->
	<path d="M7 39H39" stroke={color} stroke-width="2.8" stroke-linecap="round" />
</svg>
