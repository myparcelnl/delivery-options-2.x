<template>
  <div class="${$classBase}__modal">
    <div
      class="${$classBase}__modal__close"
      @click="$configBus.showModal = false">
      <font-awesome-icon icon="times" />
    </div>
    <component
      :is="component"
      :data="data" />
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    component: {
      type: Object,
      default: null,
    },
    data: {
      type: Object,
      default: null,
    },
  },
};
</script>
