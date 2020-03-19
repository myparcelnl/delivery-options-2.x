import { formInputProps } from '@/sandbox/services/mixins/formInputProps';
import { vModelMixin } from '@/sandbox/services/mixins/vModel';

export const formTextInput = {
  mixins: [
    vModelMixin,
    formInputProps,
  ],

  props: {
    lazy: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      default: 'text',
    },

    placeholder: {
      type: [Number, String],
      default: null,
    },

    autocomplete: {
      type: String,
      default: null,
    },
  },
};
