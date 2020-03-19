export const formInputProps = {
  props: {
    id: {
      type: String,
      default: () => '',
    },

    name: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      default: 'text',
    },

    disabled: {
      type: Boolean,
    },

    readonly: {
      type: Boolean,
    },
  },

  computed: {
    /**
     * Use this instead of $props.
     *
     * We create this property here so all components can use filteredProps instead of $props, regardless of whether
     *  the components or their mixins have this property, for consistency across all components.
     *
     * @returns {Object}
     */
    filteredProps() {
      return this.$props;
    },
  },
};
