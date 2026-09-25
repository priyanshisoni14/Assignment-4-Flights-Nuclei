<script lang="ts">
	import { LandingWalletCta } from '@CDNA-Technologies/svelte-vitals/cart/wallet';
	import AppBar from '@CDNA-Technologies/svelte-vitals/components/appbar';
	import ThreeDotMenu from '@CDNA-Technologies/svelte-vitals/components/three-dot-menu';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';

	// rn no specific action is required for the back button
	// handle the menu click rn just logs the label
	const handleMenuClick = (label: string, close: () => void) => {
		NucleiLogger.logInfo('Flights', `${label} clicked`);
		close();
	};

	const handleOffersClick = () => NucleiLogger.logInfo('Flights', 'Offers clicked');
	const handleRewardsClick = () => NucleiLogger.logInfo('Flights', 'Rewards clicked');
</script>

<!-- navbar bg override + overflow-visible so the Rewards tag can sit above the buttons -->
<div class="[&_nav.bg-secondary]:!bg-[#112e47] [&_nav.bg-secondary]:!overflow-visible">
	<AppBar title="Flights" height="80px" enableZIndex showBackButton={true}>
		<div slot="action" class="flex items-center gap-3">
			<!-- wallet pill: white bg, navy icon + amount (overrides the library's blue) -->
			<div
				class="flex h-8 items-center rounded-lg bg-white px-2.5 [&_*]:!text-[#112e47] [&_*]:font-semibold [&_svg_path]:!fill-[#112e47] [&_svg_rect]:!fill-[#112e47]"
			>
				<LandingWalletCta />
			</div>

			<!-- offers button -->
			<button
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-white"
				aria-label="Offers"
				on:click={handleOffersClick}
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect x="4" y="4" width="16" height="16" rx="3" fill="#112E47" />
					<rect
						x="4"
						y="4"
						width="16"
						height="16"
						rx="3"
						fill="#112E47"
						transform="rotate(45 12 12)"
					/>
					<circle cx="9.5" cy="9.5" r="1.4" fill="#fff" />
					<circle cx="14.5" cy="14.5" r="1.4" fill="#fff" />
					<path d="M15 9 L9 15" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
				</svg>
			</button>

			<!-- rewards button with the green tag on top -->
			<div class="relative">
				<button
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-white"
					aria-label="Rewards"
					on:click={handleRewardsClick}
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<!-- lid -->
						<rect x="2.5" y="7.5" width="19" height="4" rx="1" fill="#112E47" />
						<!-- box -->
						<rect x="4" y="12" width="16" height="9.5" rx="1" fill="#112E47" />
						<!-- ribbon gap -->
						<rect x="11" y="7.5" width="2" height="14" fill="#fff" />
						<!-- bow -->
						<path
							d="M12 7.5 C12 7.5 9.2 7.5 8.4 5.9 C7.6 4.3 9.4 2.6 10.8 3.6 C12 4.5 12 7.5 12 7.5 Z"
							fill="#112E47"
						/>
						<path
							d="M12 7.5 C12 7.5 14.8 7.5 15.6 5.9 C16.4 4.3 14.6 2.6 13.2 3.6 C12 4.5 12 7.5 12 7.5 Z"
							fill="#112E47"
						/>
					</svg>
				</button>
			</div>

			<div class="dropdown dropdown-end">
				<ThreeDotMenu let:closeDropDown colour="#FFFFFF">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						on:click={() => handleMenuClick('My Bookings', closeDropDown)}
						role="menuitem"
						class="border-t p-3"
					>
						My Bookings
					</li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						on:click={() => handleMenuClick('Web Check-In', closeDropDown)}
						tabindex="0"
						role="menuitem"
						class="border-t p-3"
					>
						Web Check-In
					</li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						on:click={() => handleMenuClick('Help', closeDropDown)}
						tabindex="0"
						role="menuitem"
						class="border-t p-3"
					>
						Help
					</li>
				</ThreeDotMenu>
			</div>
		</div>
	</AppBar>
</div>
