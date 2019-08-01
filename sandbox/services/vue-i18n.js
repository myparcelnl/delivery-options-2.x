import Vue from 'vue';
import VueI18n from 'vue-i18n';
import translationsEn from '../translations/en';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'en',
  messages: translationsEn,
  // Don't warn if translations don't exist
  silentTranslationWarn: true,
  silentFallbackWarn: true,
});
