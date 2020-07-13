<template>
  <CInput
    v-model="mutableValue"
    component="BFormInput"
    type="number"
    v-bind="filteredProps" />
</template>

<script>
import { BFormInput } from 'bootstrap-vue/src/components/form-input';
import CInput from '@/sandbox/components/form/CInput';
import { formNumberInput } from '@/sandbox/services/mixins/formNumberInput';

export default {
  name: 'CNumber',
  components: { CInput },
  extends: BFormInput,
  mixins: [
    formNumberInput,
  ],
};
</script>
