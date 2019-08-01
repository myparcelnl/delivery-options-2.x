<template>
  <div
    v-if="!data.title"
    class="form-group row">
    <label
      class="col-6 col-form-label"
      :for="data.name"
      v-text="data.label || data.name" />

    <div class="col-6">
      <select
        v-if="data.type === 'select'"
        :id="data.name"
        class="custom-select custom-select-sm"
        :name="data.name"
        @update="$emit('update', $event)">
        <option
          v-if="hasTranslation('placeholder')"
          value=""
          v-text="translation('placeholder')" />
        <option
          v-for="option in data.options"
          :key="option.value"
          :value="option.value"
          v-text="option.label" />
      </select>

      <input
        v-else
        :id="data.name"
        class="form-control form-control-sm"
        :class="data.class"
        :value="data.value || data.placeholder"
        :checked="data.checked"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :placeholder="hasTranslation('placeholder') ? translation('placeholder') : null"
        :type="data.type"
        @update="$emit('update', $event)">
    </div>

    <div class="col-12">
      <p
        v-if="hasTranslation('description')"
        class="small mt-2 text-muted"
        v-html="translation('description')" />
    </div>
  </div>
  <div
    v-else
    :class="{
      'form-group row': isTopLevel
    }">
    <div
      :class="{
        'col-12': isTopLevel,
      }">
      <hr v-if="isTopLevel">
      <component
        :is="'h' + (level + 1)"
        id="data.title"
        v-text="translation('title')" />
      <p
        v-if="hasTranslation('description')"
        class="small mt-2 text-muted"
        v-html="translation('description')" />
      <FormGroup
        v-for="setting in data.settings"
        :key="setting.name"
        :data="setting"
        :level="level + 1"
        @change="$emit('update', $event)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormGroup',
  props: {
    data: {
      type: Object,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    isTitle() {
      return this.data.hasOwnProperty('title');
    },
    isTopLevel() {
      return this.level === 1;
    },
    translationGroup() {
      const prefix = this.isTitle ? 'titles' : 'settings';
      const translation = this.isTitle ? this.data.title : this.data.name;
      return `${prefix}.${translation}`;
    },
  },
  methods: {
    translation(name) {
      return this.$t(`${this.translationGroup}.${name}`);
    },
    hasTranslation(name) {
      return ![`${this.translationGroup}.${name}`, ''].includes(this.translation(name));
    },
  },
};
</script>
