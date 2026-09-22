<script lang="ts">
	// TODO: replace with ConfigResponse banners once getConfig is wired
	const banner = {
		title: 'Book Your Flight with Ease',
		code: 'FLYHIGH10',
		imageUrl: 'https://placehold.co/600x200/1E3A5F/FFFFFF?text=Flight+Banner'
	};
</script>

<div class="w-11/12 mx-auto mt-6">
	<div class="relative rounded-lg overflow-hidden shadow">
		<img src={banner.imageUrl} alt={banner.title} class="w-full h-32 object-cover" />
		<div class="absolute inset-0 bg-black/30 flex flex-col justify-end p-3">
			<p class="text-white heading-3">{banner.title}</p>
			<p class="text-white sub-text">Use code {banner.code}</p>
		</div>
	</div>
	<div class="flex items-center gap-3 mt-2 text-sm base-content-light-60">
		<span>Compare and fly with:</span>
		<span class="font-semibold">cleartrip</span>
		<span class="font-semibold">EaseMyTrip</span>
	</div>
</div>
