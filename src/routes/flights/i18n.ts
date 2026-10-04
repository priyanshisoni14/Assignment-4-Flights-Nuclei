import { I18n } from '@CDNA-Technologies/svelte-vitals/i18n';
import translations from './translations/index.js';
import type { Writable } from 'svelte/store';

// the language comes only from the native LOCALE header (stored in the cookies), which the
// I18n class reads itself, and it falls back to en if it is missing.
// there is no in-app language picker, so nothing here sets the language
const flightsI18n = new I18n(translations);

export const flightsTranslationStore = flightsI18n.getTranslateStore();

// read-only use: the current language code (the config cache is scoped by it)
export const flightsLanguageCode = (flightsI18n as any).languageCode as Writable<string>;