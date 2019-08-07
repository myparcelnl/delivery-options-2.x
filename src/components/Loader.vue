<template>
  <transition
    appear
    name="fade">
    <div
      class="myparcel-checkout__loader"
      :class="{
        'myparcel-checkout__loader--big': 'big' === type,
        'myparcel-checkout__loader--inline': 'inline' === type
      }">
      <transition-group
        v-if="'inline' === type"
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

      <transition
        v-else
        name="fade" />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    type: {
      type: String,
      default: 'big',
    },
  },
};
</script>
