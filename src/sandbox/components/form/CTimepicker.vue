<template>
  <CInput
    v-model="mutableValue"
    type="time"
    placeholder="HH:mm"
    v-bind="filteredProps" />
</template>

<script>
import CInput from '@/sandbox/components/form/CInput';
import { formTextInput } from '@/sandbox/services/mixins/formTextInput';

export default {
  name: 'CTimepicker',
  components: { CInput },
  mixins: [
    formTextInput,
  ],
};
</script>
