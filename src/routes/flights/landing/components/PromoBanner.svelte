<script lang="ts">
	// TODO: replace with ConfigResponse banners once getConfig is wired
	const banner = {
		title: 'Book Your Flight with Ease',
		code: 'FLYHIGH10'
	};
</script>

<div class="mt-8 w-full">
	<div
		class="rounded-xl bg-[#B0D8E8] p-4 md:p-6 flex items-center justify-between gap-4 overflow-hidden"
	>
		<div class="min-w-0">
			<p class="heading-1 text-[#173541] leading-snug">{banner.title}</p>
			<div class="mt-2 flex items-center gap-2">
				<span class="sub-text text-[#173541]">Use code</span>
				<span class="cta-ghost-text bg-white text-primary px-2.5 py-1 rounded-md">
					{banner.code}
				</span>
			</div>
		</div>
		<div class="text-right flex-shrink-0">
			<p class="font-black italic text-xl md:text-3xl text-[#F25021] leading-none">cleartrip</p>
			<p class="sub-text text-[#173541] mt-1 hidden md:block">Compare &amp; fly</p>
		</div>
	</div>
	<div class="flex items-center gap-1 mt-2 text-sm base-content-light-60">
		<span>Compare and fly with:</span>
		<span class="font-bold text-[#F25021]">cleartrip</span>
		<span class="font-semibold text-base-content">EaseMyTrip</span>
	</div>
</div>
