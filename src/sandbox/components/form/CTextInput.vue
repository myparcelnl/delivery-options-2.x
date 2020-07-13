<template>
  <CInput
    v-model="mutableValue"
    component="BFormInput"
    v-bind="filteredProps" />
</template>

<script>
import CInput from '@/sandbox/components/form/CInput';
import { formTextInput } from '@/sandbox/services/mixins/formTextInput';

export default {
  name: 'CTextInput',
  components: { CInput },
  mixins: [
    formTextInput,
  ],
};
</script>
