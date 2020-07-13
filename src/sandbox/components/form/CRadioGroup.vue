<template>
  <CInput
    v-model="selected"
    component="BFormRadioGroup"
    :options="translatedOptions" />
</template>

<script>
import { BFormRadioGroup } from 'bootstrap-vue/src/components/form-radio';
import CInput from '@/sandbox/components/form/CInput';
import { formRadioGroup } from '@/sandbox/services/mixins/formRadioGroup';

export default {
  name: 'CRadioGroup',
  components: { CInput },
  extends: BFormRadioGroup,
  mixins: [
    formRadioGroup,
  ],
};
</script>
