import { BFormTextarea } from 'bootstrap-vue';
import { formInputProps } from '@/sandbox/services/mixins/formInputProps';
import { vModelMixin } from '@/sandbox/services/mixins/vModel';

export const formTextarea = {
  extends: BFormTextarea,

  mixins: [
    vModelMixin,
    formInputProps,
  ],
};
