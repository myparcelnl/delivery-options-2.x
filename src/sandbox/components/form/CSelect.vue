<template>
  <CInput
    v-model="mutableValue"
    v-bind="filteredProps"
    :options="translatedOptions"
    component="BFormSelect" />
</template>

<script>
import CInput from '@/sandbox/components/form/CInput';
import { formSelect } from '@/sandbox/services/mixins/formSelect';
import { hasOptions } from '@/sandbox/services/mixins/hasOptions';

export default {
  name: 'CSelect',
  components: { CInput },

  mixins: [
    formSelect,
    hasOptions,
  ],
};
</script>
