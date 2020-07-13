export const vModelMixin = {
  model: {
    prop: 'value',
    event: 'input',
  },

  computed: {
    mutableValue: {
      get() {
        return this.value;
      },

      /**
       * Emit event with the new value.
       *
       * @param {*} value - New value.
       */
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  props: {
    value: {
      default: null,
    },
  },
};
