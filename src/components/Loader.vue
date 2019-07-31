<template>
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
        :class="`myparcel-checkout__loader--inline__${index}`" />
    </transition-group>

    <transition
      v-else
      name="fade" />
    <span />
  </div>
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
