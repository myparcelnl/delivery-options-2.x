<template>
  <div class="form-group row">
    <label
      :for="model"
      class="col-4 col-xs-12 col-form-label"
      :class="{
        [`col-form-label-${size}`]: size
      }"
      v-text="label" />
    <div class="col-8">
      <select
        v-if="type === 'select'"
        :id="model"
        v-model="mutableValue"
        :class="fieldClass">
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
          v-text="option.text" />
      </select>

      <input
        v-else
        :id="model"
        v-model="mutableValue"
        :type="type"
        :class="fieldClass">
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormControl',
  props: {
    model: {
      default: null,
      type: String,
    },
    value: {
      type: String,
      default: null,
    },
    label: {
      default: null,
      type: String,
    },
    size: {
      default: null,
      type: String,
    },
    type: {
      default: 'text',
      type: String,
    },
  },
  data() {
    return {
      selects: ['select', 'countrySelect'],
    };
  },
  computed: {
    mutableValue: {
      get() {
        return this.value;
      },
      set(mutableValue) {
        this.$emit('input', mutableValue);
      },
    },
    fieldClass() {
      const str = this.selects.includes(this.type) ? 'custom-select' : 'form-control';
      const cls = [str];

      if (this.size) {
        cls.push(`${str}-${this.size}`);
      }

      return cls.join(' ');
    },
  },
};
</script>
