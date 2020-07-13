import { formCheckbox } from '@/sandbox/services/mixins/formCheckbox';
import { hasOptions } from '@/sandbox/services/mixins/hasOptions';

export const formCheckboxGroup = {
  mixins: [
    formCheckbox,
    hasOptions,
  ],
};
