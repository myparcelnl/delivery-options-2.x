<template>
  <div :class="`${$classBase}__errors`">
    <h4 v-text="$configBus.strings.addressNotFound" />
    <form v-if="hasRetry">
      <template v-for="part in requiredAddressParts">
        <p :key="part">
          <label>
            {{ $configBus.strings[part] }}
            <input
              v-model="values[part]"
              :name="part + '-input'"
              type="text"
              :placeholder="$configBus.strings[part]"
              v-text="$configBus.strings[part]">
          </label>
        </p>
      </template>
      <button
        @click.prevent="retry"
        v-text="$configBus.strings.retry" />
    </form>
  </div>
</template>

<script>
import * as EVENTS from '@/config/eventConfig';
import { FEATURE_ALLOW_RETRY } from '@/data/keys/configKeys';
import { addressRequirements } from '@/config/localeConfig';

export default {
  name: 'Errors',
  data() {
    return {
      values: { ...this.$configBus.address },
    };
  },
  computed: {
    requiredAddressParts() {
      return addressRequirements[this.$configBus.address.cc];
    },

    hasRetry() {
      return this.$configBus.get(FEATURE_ALLOW_RETRY);
    },
  },
  methods: {
    /**
     * Update the address in the configBus with the new address and send the it to the external platform.
     */
    retry() {
      const newAddress = { ...this.$configBus.address, ...this.values };

      // Trigger the event to make the checkout update.
      document.dispatchEvent(new CustomEvent(EVENTS.UPDATE_DELIVERY_OPTIONS, { detail: { address: newAddress } }));

      // Send the new values in an event. It's up to the external platform to do handle this event or not.
      document.dispatchEvent(new CustomEvent(EVENTS.UPDATED_ADDRESS, { detail: newAddress }));
    },
  },
};
</script>
