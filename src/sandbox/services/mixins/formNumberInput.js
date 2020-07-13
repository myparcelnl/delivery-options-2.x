import { formTextInput } from '@/sandbox/services/mixins/formTextInput';

export const formNumberInput = {
  mixins: [
    formTextInput,
  ],

  props: {
    step: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
  },
};
