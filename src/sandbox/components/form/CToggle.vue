<template>
  <BFormCheckbox
    :id="$props.id"
    v-model="selected"
    v-bind="filteredProps"
    switch />
</template>

<script>
import { formCheckbox } from '@/sandbox/services/mixins/formCheckbox';

export default {
  name: 'CToggle',
  mixins: [
    formCheckbox,
  ],

  props: {
    checked: Boolean,
    size: {
      type: String,
      default: () => 'lg',
    },
  },
};
</script>
