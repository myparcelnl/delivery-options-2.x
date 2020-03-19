import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { englishTranslations } from '@/sandbox/translations/en';

Vue.use(VueI18n);

/**
 * Create an i18n instance.
 *
 * @returns {VueI18n}
 */
export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: englishTranslations,
  },
});
