import { BFormSelect } from 'bootstrap-vue/src/components/form-select/form-select';
import { formInputProps } from '@/sandbox/services/mixins/formInputProps';
import { hasOptions } from '@/sandbox/services/mixins/hasOptions';
import { vModelMixin } from '@/sandbox/services/mixins/vModel';

export const formSelect = {
  extends: BFormSelect,

  mixins: [
    vModelMixin,
    formInputProps,
    hasOptions,
  ],

  props: {
    multiple: {
      type: Boolean,
    },
  },
};
