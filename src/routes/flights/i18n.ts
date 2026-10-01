import { I18n } from '@CDNA-Technologies/svelte-vitals/i18n';
import { browser } from '$app/environment';
import translations from './translations/index.js';
import type { Writable } from 'svelte/store';

const SAVED_LOCALE_KEY = 'flights_preferred_locale';

// create a new instance of the I18n class, passing in the translations
// creates the language store
// reads the nativve LOCALE header and defaults to en if not found
// creates translation store
const flightsI18n = new I18n(translations);

export const flightsTranslationStore = flightsI18n.getTranslateStore();
// language store - it holds the current language code
export const flightsLanguageCode = (flightsI18n as any).languageCode as Writable<string>;

// list of locales your own translations.js actually supports, for the dropdown
export const supportedLocales = Object.keys(translations);

// if the user manually picked a language before, that choice wins over the
// native header's default — otherwise native stays in control, as before
if (browser) {
	const savedLocale = localStorage.getItem(SAVED_LOCALE_KEY);
	if (savedLocale && supportedLocales.includes(savedLocale)) {
		flightsLanguageCode.set(savedLocale);
	}
}

// single entry point for changing language from the UI — updates the store
// AND remembers the choice for next time, so callers never touch
// localStorage or the store directly
export function setFlightsLanguage(locale:string) {
	if (!supportedLocales.includes(locale)) return;
	flightsLanguageCode.set(locale);
	if (browser) {
		localStorage.setItem(SAVED_LOCALE_KEY, locale);
	}
}