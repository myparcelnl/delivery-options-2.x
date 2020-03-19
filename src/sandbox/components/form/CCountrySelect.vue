<template>
  <CSelect
    v-model="mutableValue"
    :options="mutableOptions" />
</template>

<script>
import CSelect from '@/sandbox/components/form/CSelect';

export default {
  name: 'CCountrySelect',
  components: { CSelect },
  extends: CSelect,

  props: {
    disabledOption: {
      type: String,
      default: 'form.country',
    },
  },

  data() {
    return {
      mutableOptions: this.options,
    };
  },

  watch: {

    /**
     * Update the countries list on load and locale change.
     */
    '$i18n.locale': {
      async handler(locale) {
        const countries = await require(`@/sandbox/translations/countries/${locale}.json`);

        this.mutableOptions = Object.keys(countries).map((country) => {
          return {
            value: country.toLowerCase(),
            text: countries[country],
          };
        });
      },
      immediate: true,
    },
  },
};
</script>
