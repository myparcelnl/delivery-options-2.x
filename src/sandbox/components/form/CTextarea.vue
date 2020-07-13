<template>
  <CInput
    ref="textarea"
    v-model="mutableValue"
    component="b-form-textarea"
    v-bind="filteredProps" />
</template>

<script>
import CInput from '@/sandbox/components/form/CInput';
import { formTextarea } from '@/sandbox/services/mixins/formTextarea';

export default {
  name: 'CTextarea',
  components: { CInput },
  mixins: [
    formTextarea,
  ],
};
</script>
