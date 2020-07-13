import { formInputProps } from '@/sandbox/services/mixins/formInputProps';
import isEqual from 'lodash-es/isEqual';

export const formCheckbox = {
  mixins: [
    formInputProps,
  ],

  model: {
    prop: 'checked',
    event: 'input',
  },

  computed: {
    selected: {
      get() {
        return this.checked;
      },
      set(value) {
        if (!isEqual(value, this.selected)) {
          this.$emit('input', value);
        }
      },
    },
  },
};
