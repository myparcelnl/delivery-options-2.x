<template>
  <div :class="`${$classBase}__modal`">
    <div
      v-if="hasCloseButton"
      :class="`${$classBase}__modal__close`"
      @click="inline ? $emit('close') : $configBus.showModal = false">
      <font-awesome-icon icon="times" />
    </div>
    <component
      :is="component"
      :data="modalData" />
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
    component: {
      type: Object,
      default: null,
    },
    modalData: {
      type: Object,
      default: null,
    },
    hasCloseButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
