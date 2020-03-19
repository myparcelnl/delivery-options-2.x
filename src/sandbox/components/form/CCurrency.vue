<template>
  <component :is="symbol ? 'b-input-group' : 'div'">
    <b-input-group-prepend v-if="symbol">
      <b-input-group-text v-text="symbol" />
    </b-input-group-prepend>

    <CNumber
      v-model="mutableValue"
      :min="-20"
      :max="20"
      :step="0.01"
      lazy-formatter
      :formatter="formatter"
      v-bind="filteredProps" />
  </component>
</template>

<script>
import CNumber from '@/sandbox/components/form/CNumber';
import { formCurrencyInput } from '@/sandbox/services/mixins/formCurrencyInput';

export default {
  name: 'CCurrency',
  components: { CNumber },
  mixins: [
    formCurrencyInput,
  ],
};
</script>
