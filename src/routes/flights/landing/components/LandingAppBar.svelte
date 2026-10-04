<script lang="ts">
	import { flightsTranslationStore } from '$flights/i18n.js';
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

	let walletBalance = 0; // default until the wallet api responds
	let walletFetched = false; // false -> show our fallback pill instead of the library's

	// called by the library with the wallet response
	const handleWalletFetched = (response: any) => {
		walletBalance = response?.balance ?? 0; // adjust the field name to the real response shape
		walletFetched = true;
	};
</script>

<!-- navbar bg override + overflow-visible so the Rewards tag can sit above the buttons -->
<div
	class="[&_nav.bg-secondary]:!bg-[#112e47]
	[&_nav.bg-secondary_>_button]:!shadow-none
	[&_nav.bg-secondary_>_button]:!p-0
	[&_nav.bg-secondary_>_button_svg]:!fill-white
	[&_nav.bg-secondary_>_button_svg]:!stroke-white
	[&_nav.bg-secondary_>_button_svg_path]:!fill-white"
>
	<AppBar
		title={$flightsTranslationStore('flights.title')}
		height="80px"
		enableZIndex
		showBackButton={true}
	>
		<div slot="action" class="flex min-w-0 items-center gap-2 sm:gap-3">
			<!-- wallet pill: the library cta stays mounted so it can fetch, but is hidden until it
     responds. Until then (or if wallet is disabled / the call fails) a default pill shows -->
			<div
				class="{walletFetched
					? 'flex'
					: 'hidden'} h-8 min-w-0 items-center rounded-lg bg-white px-2.5 [&_*]:!text-[#112e47] [&_*]:font-semibold [&_svg_path]:!fill-[#112e47] [&_svg_rect]:!fill-[#112e47]"
			>
				<LandingWalletCta onWalletResponseFetched={handleWalletFetched} />
			</div>

			{#if !walletFetched}
				<div
					class="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 text-sm font-semibold text-[#112e47]"
					aria-label={$flightsTranslationStore('flights.appbar.wallet')}
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<rect x="2.5" y="5.5" width="19" height="14" rx="2.5" fill="#112E47" />
						<rect
							x="14"
							y="10"
							width="9"
							height="5.5"
							rx="1.5"
							fill="#112E47"
							stroke="#fff"
							stroke-width="1.4"
						/>
						<circle cx="17.2" cy="12.75" r="1" fill="#fff" />
					</svg>
					<span>₹{walletBalance}</span>
				</div>
			{/if}

			<!-- offers button -->
			<button
				class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white"
				aria-label={$flightsTranslationStore('flights.appbar.offers')}
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

			<!-- rewards button with -->
			<div class="relative">
				<button
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white"
					aria-label={$flightsTranslationStore('flights.appbar.rewards')}
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
						tabindex="0"
						class="border-t p-3"
					>
						{$flightsTranslationStore('flights.appbar.my_bookings')}
					</li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						on:click={() => handleMenuClick('Web Check-In', closeDropDown)}
						tabindex="0"
						role="menuitem"
						class="border-t p-3"
					>
						{$flightsTranslationStore('flights.appbar.web_check_in')}
					</li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						on:click={() => handleMenuClick('Help', closeDropDown)}
						tabindex="0"
						role="menuitem"
						class="border-t p-3"
					>
						{$flightsTranslationStore('flights.appbar.help')}
					</li>
				</ThreeDotMenu>
			</div>
		</div>
	</AppBar>
</div>

<style>
	/* Back button - remove DaisyUI outline/border */
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

	/* Keep the arrow unchanged except for its white color */
	:global(nav button[aria-label='Back button'] > div.bg-secondary svg) {
		fill: #ffffff !important;
		stroke: #ffffff !important;
	}

	:global(nav button[aria-label='Back button'] > div.bg-secondary svg path) {
		fill: #ffffff !important;
		stroke: #ffffff !important;
	}
</style>
