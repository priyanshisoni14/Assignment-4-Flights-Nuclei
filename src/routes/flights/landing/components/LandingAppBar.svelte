<script lang="ts">
	import AppBar from '@CDNA-Technologies/svelte-vitals/components/appbar';
	import ThreeDotMenu from '@CDNA-Technologies/svelte-vitals/components/three-dot-menu';
	import { LandingWalletCta } from '@CDNA-Technologies/svelte-vitals/cart/wallet';

	const handleBack = () => console.log('back clicked');
	const handleMenuClick = (label: string, close: () => void) => {
		console.log(label, 'clicked');
		close();
	};
</script>

<div class="appbar-flights">
	<AppBar title="Flights" height="80px" enableZIndex showBackButton onBackButtonClick={handleBack}>
		<div slot="action" class="flex items-center gap-2">
			<span class="text-xs text-white whitespace-nowrap">Rewards</span>
			<LandingWalletCta />
			<div class="dropdown dropdown-end">
				<ThreeDotMenu let:closeDropDown colour="#FFFFFF">
					<li on:click={() => handleMenuClick('My Bookings', closeDropDown)} class="border-t p-3">
						My Bookings
					</li>
					<li on:click={() => handleMenuClick('Web Check-In', closeDropDown)} class="border-t p-3">
						Web Check-In
					</li>
					<li on:click={() => handleMenuClick('Help', closeDropDown)} class="border-t p-3">Help</li>
				</ThreeDotMenu>
			</div>
		</div>
	</AppBar>
</div>

<style>
	.appbar-flights :global(nav.bg-secondary) {
		background-color: #032f49;
	}
</style>
