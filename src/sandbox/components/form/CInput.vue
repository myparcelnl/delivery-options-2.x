<script>
import { formInputProps } from '@/sandbox/services/mixins/formInputProps';

const INPUT_DEBOUNCE_DELAY = 300;

export default {
  name: 'CInput',
  functional: true,

  mixins: [
    formInputProps,
  ],

  props: {
    component: {
      type: [Object, String],
      default: 'b-input',
    },
  },

  /**
   * Set default values and merge all attributes and props into the child's props.
   *
   * @param {Function} createElement
   * @param {Object} context
   *
   * @returns {VNode}
   */
  render(createElement, context) {
    context.data.props = {
      debounce: INPUT_DEBOUNCE_DELAY,
      trim: true,
      autocomplete: 'off',
      ...context.data.attrs,
      ...context.data.props,
      ...context.props,
    };

    return createElement(context.props.component, context.data, context.children);
  },
};
</script>
