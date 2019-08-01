<template>
  <form class="form">
    <FormGroup
      v-for="setting in settings"
      :key="setting.name"
      :data="setting"
      @change="$emit('update', $event)" />
  </form>
</template>

<script>
/* eslint-disable max-len */
import FormGroup from './FormGroup';
import { settings } from '../settings';

export default {
  name: 'SettingsForm',
  components: { FormGroup },

  data() {
    return {
      settings,
    };
  },
};
</script>
