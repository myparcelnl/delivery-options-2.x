<template>
  <table
    :class="[
      `${$classBase}__table`,
      `${$classBase}__pickup-locations--list`
    ]">
    <tr
      v-for="(item, index) in data"
      :key="'option_' + index">
      <td :class="`${$classBase}__input`">
        <input
          :id="`${$classBase}__${item.name}`"
          v-model="selected"
          :value="item.name"
          type="radio">
      </td>
      <pickup-option
        :data="item"
        :selected="selected === item.name" />
    </tr>
  </table>
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
  },
  data() {
    return {
      selected: null,
    };
  },

  watch: {
    selected(name) {
      this.$emit('select', name);
    },
  },
};
</script>
