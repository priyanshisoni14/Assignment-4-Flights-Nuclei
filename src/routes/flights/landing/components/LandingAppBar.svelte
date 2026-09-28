<script lang="ts">
	import { LandingWalletCta } from '@CDNA-Technologies/svelte-vitals/cart/wallet';
	import AppBar from '@CDNA-Technologies/svelte-vitals/components/appbar';
	import ThreeDotMenu from '@CDNA-Technologies/svelte-vitals/components/three-dot-menu';
	import { NucleiLogger } from '@CDNA-Technologies/svelte-vitals/logger';
	import {
		flightsTranslationStore,
		flightsLanguageCode,
		setFlightsLanguage,
		supportedLocales
	} from '$flights/i18n.js';

	// rn no specific action is required for the back button
	// handle the menu click rn just logs the label
	const handleMenuClick = (label: string, close: () => void) => {
		NucleiLogger.logInfo('Flights', `${label} clicked`);
		close();
	};

	const handleOffersClick = () => NucleiLogger.logInfo('Flights', 'Offers clicked');
	const handleRewardsClick = () => NucleiLogger.logInfo('Flights', 'Rewards clicked');

	// display names for the language sub-list — add an entry whenever a new
	// locale is added to translations.js
	const LOCALE_LABELS: Record<string, string> = {
		en: 'English',
		hi: 'हिन्दी'
	};

	let showLanguageOptions = false;

	const toggleLanguageOptions = () => {
		showLanguageOptions = !showLanguageOptions;
	};

	const handleLanguageSelect = (locale: string, close: () => void) => {
		setFlightsLanguage(locale);
		NucleiLogger.logInfo('Flights', `Language changed to ${locale}`);
		showLanguageOptions = false;
		close();
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
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-white"
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
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						on:click={toggleLanguageOptions}
						role="menuitem"
						tabindex="0"
						aria-expanded={showLanguageOptions}
						class="flex items-center justify-between border-t p-3"
					>
						<span>{$flightsTranslationStore('flights.appbar.language')}</span>
						<span class="text-sm text-gray-500"
							>{LOCALE_LABELS[$flightsLanguageCode] ?? $flightsLanguageCode}</span
						>
					</li>
					{#if showLanguageOptions}
						{#each supportedLocales as locale}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<li
								on:click={() => handleLanguageSelect(locale, closeDropDown)}
								role="menuitem"
								tabindex="0"
								aria-current={$flightsLanguageCode === locale}
								class="flex items-center justify-between border-t bg-gray-50 py-3 pl-6 pr-3 text-sm"
							>
								<span>{LOCALE_LABELS[locale] ?? locale}</span>
								{#if $flightsLanguageCode === locale}
									<span aria-hidden="true">✓</span>
								{/if}
							</li>
						{/each}
					{/if}
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
