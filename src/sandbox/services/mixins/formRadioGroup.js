import { formCheckboxGroup } from '@/sandbox/services/mixins/formCheckboxGroup';
import { hasOptions } from '@/sandbox/services/mixins/hasOptions';

export const formRadioGroup = {
  mixins: [
    hasOptions,
    formCheckboxGroup,
  ],
};
