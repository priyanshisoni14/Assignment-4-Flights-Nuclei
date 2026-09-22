<script lang="ts">
	// TODO: replace with ConfigResponse.trendingRoutes once getConfig is wired
	const routes = [
		{
			from: 'BLR',
			to: 'HYD',
			fare: 4999,
			imageUrl: 'https://placehold.co/200x140/E8E8EE/94A3B8?text=BLR-HYD'
		},
		{
			from: 'BLR',
			to: 'DEL',
			fare: 5499,
			imageUrl: 'https://placehold.co/200x140/E8E8EE/94A3B8?text=BLR-DEL'
		},
		{
			from: 'BLR',
			to: 'BOM',
			fare: 4599,
			imageUrl: 'https://placehold.co/200x140/E8E8EE/94A3B8?text=BLR-BOM'
		}
	];
</script>

<div class="mt-8">
	<h2 class="heading-2 mb-3">Trending routes</h2>
	<div
		class="flex gap-3 overflow-x-auto scrollbar-hide pb-2 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:pb-0"
	>
		{#each routes as route}
			<div class="flex-shrink-0 w-36 lg:w-full rounded-lg overflow-hidden shadow bg-base-200">
				<img
					src={route.imageUrl}
					alt="{route.from} to {route.to}"
					class="w-full h-24 lg:h-28 object-cover"
				/>
				<div class="p-2 lg:p-3">
					<p class="card-sub-heading">{route.from} → {route.to}</p>
					<p class="sub-text base-content-light-60">₹{route.fare}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
