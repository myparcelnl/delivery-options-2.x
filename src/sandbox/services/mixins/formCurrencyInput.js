import { formNumberInput } from '@/sandbox/services/mixins/formNumberInput';

export const formCurrencyInput = {
  mixins: [
    formNumberInput,
  ],

  props: {
    symbol: {
      type: String,
      default: null,
    },
  },

  methods: {
    formatter(value) {
      const DECIMALS = 2;

      return Number(value).toFixed(DECIMALS);
    },
  },
};
