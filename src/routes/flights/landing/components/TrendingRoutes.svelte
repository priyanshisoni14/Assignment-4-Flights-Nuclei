<script lang="ts">
	// TODO: replace with ConfigResponse.trendingRoutes once getConfig is wired
	const routes = [
		{
			from: 'BLR',
			to: 'HYD',
			fare: 4999,
			imageUrl: 'https://placehold.co/200x140/1E3A5F/FFFFFF?text=HYD'
		},
		{
			from: 'BLR',
			to: 'DEL',
			fare: 5499,
			imageUrl: 'https://placehold.co/200x140/1E3A5F/FFFFFF?text=DEL'
		},
		{
			from: 'BLR',
			to: 'BOM',
			fare: 4599,
			imageUrl: 'https://placehold.co/200x140/1E3A5F/FFFFFF?text=BOM'
		}
	];
</script>

<div class="mt-6 px-4">
	<h2 class="heading-2 mb-3">Trending routes</h2>
	<div class="flex gap-3 overflow-x-auto pb-2">
		{#each routes as route}
			<div class="flex-shrink-0 w-36 rounded-lg overflow-hidden shadow">
				<img
					src={route.imageUrl}
					alt="{route.from} to {route.to}"
					class="w-full h-24 object-cover"
				/>
				<div class="p-2">
					<p class="card-sub-heading">{route.from} → {route.to}</p>
					<p class="sub-text base-content-light-60">₹{route.fare}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
