<template>
  <div
    :class="{
      [`${$classBase}__loader`]: true,
      [`${$classBase}__loader--inline`]: 'inline' === type,
    }">
    <transition-group
      name="shove"
      appear>
      <div
        v-for="index in 3"
        :key="`block-${index}`"
        :style="{
          'animation-delay': index * .05 + 's',
          'transition-delay': index * .035 + 's',
        }" />
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    type: {
      type: String,
      default: 'inline',
    },
  },
};
</script>
