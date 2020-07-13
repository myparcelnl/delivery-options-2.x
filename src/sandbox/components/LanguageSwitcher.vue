<template>
  <b-nav-item-dropdown
    :text="languageName($i18n.locale)"
    right>
    <b-dropdown-item
      v-for="(locale, i) of availableLanguages"
      :key="`Lang${i}`"
      :active="locale === $i18n.locale"
      @click.prevent="$i18n.locale = locale">
      {{ languageName(locale) }}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>

export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      availableLanguages: ['nl', 'en'],
      map: {
        nl: 'Nederlands',
        en: 'English',
      },
    };
  },
  methods: {
    languageName(locale) {
      return this.map[locale];
    },
  },
};
</script>
