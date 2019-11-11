<template>
  <div :class="`${$classBase}__pickup-locations__sidebar`">
    <transition
      name="shove">
      <table
        v-show="mutableIsOpen"
        :class="`${$classBase}__pickup-locations__sidebar__content`">
        <tr
          v-for="(item, index) in data"
          :key="'option_' + index">
          <td>
            <input
              :id="`${$classBase}__${item.name}`"
              v-model="selected"
              :value="item.name"
              type="radio">
          </td>
          <pickup-option
            :data="item"
            :allow-modal="false"
            :selected="selected === item.name" />
        </tr>
      </table>
    </transition>
    <div
      class="tab"
      @click="mutableIsOpen = !mutableIsOpen"
      v-text="mutableIsOpen ? '<': '>'" />
  </div>
</template>

<script>
import PickupOption from '@/components/Pickup/PickupOption';

export default {
  name: 'Sidebar',
  components: { PickupOption },
  props: {
    data: {
      type: Array,
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mutableIsOpen: false,
      selected: null,
    };
  },

  watch: {
    isOpen(value) {
      this.mutableIsOpen = value;
    },

    selected(name) {
      // const selectedPickupItem = this.data.find((item) => item.name === name).pickupData;

      this.$emit('select', name);
    },
  },
};
</script>
