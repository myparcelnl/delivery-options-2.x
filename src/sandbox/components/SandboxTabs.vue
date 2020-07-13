<template>
  <b-tabs
    v-if="tabs.length > 1"
    justified
    content-class="py-2">
    <b-tab
      v-for="(tab, index) in tabs"
      :key="'tab_' + tab.name"
      :title="$te(tab.label) ? $t(tab.label) : tab.label"
      :active="activeTab ? activeTab === tab.name : index === 0"
      @click="() => handleClick(tab)">
      <component
        :is="tab.component"
        v-bind="tab.props" />
    </b-tab>
  </b-tabs>

  <component
    :is="tabs[0].component"
    v-else
    v-bind="tabs[0].props" />
</template>

<script>
export default {
  name: 'SandboxTabs',

  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      activeTab: null,
    };
  },
  methods: {
    handleClick(tab) {
      this.activeTab = tab.name;
      this.$emit('switched-tab', tab.name);
    },
  },
};
</script>
