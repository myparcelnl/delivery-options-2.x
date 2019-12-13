<template>
  <div
    :class="{
      [`${$classBase}__modal`]: true,
      [`${$classBase}__modal--full`]: !inline,
      [`${$classBase}__modal--inline`]: inline
    }">
    <div
      v-if="hasCloseButton"
      :class="`${$classBase}__modal__close`"
      @click="inline ? $emit('close') : $configBus.showModal = false">
      <font-awesome-icon icon="times" />
    </div>
    <component
      :is="component"
      :data="modalData">
      <slot
        v-for="(_, name) in $slots"
        :slot="name"
        :name="name" />
    </component>
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
