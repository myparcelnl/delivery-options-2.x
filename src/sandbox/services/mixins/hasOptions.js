export const hasOptions = {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    translatedOptions: {
      get() {
        return this.options.map((option) => {
          const value = option[this.valueField];
          let text = option[this.textField];

          if (this.$te(text)) {
            text = this.$t(text);
          }

          return {
            [this.valueField]: value,
            [this.textField]: text,
          };
        });
      },
    },
  },
};
