<template>
  <div
    v-if="isMissingAddressPart"
    class="myparcel-checkout__errors">
    <h4 v-text="$configBus.strings.addressNotFound" />
    <form v-if="$configBus.get('allowRetry')">
      <template v-for="part in requiredAddressParts">
        <p :key="part">
          <label>
            {{ $configBus.strings[part + 'Text'] }}
            <input
              v-model="values[part]"
              :name="part + '-input'"
              type="text"
              :placeholder="$configBus.strings[part + 'Text']"
              v-text="$configBus.strings[part + 'Text']">
          </label>
        </p>
      </template>
      <button
        @click.prevent="retry()"
        v-text="$configBus.strings.retry" />
    </form>
  </div>
</template>

<script>
import * as EVENTS from '@/config/data/eventConfig';
import { MISSING_ADDRESS } from '@/config/data/errorConfig';
import { addressRequirements } from '@/config/data/platformConfig';

export default {
  name: 'Errors',
  data() {
    return {
      values: {},
    };
  },
  computed: {
    requiredAddressParts() {
      return addressRequirements[this.$configBus.address.cc];
    },
    isMissingAddressPart() {
      return this.$configBus.errors.hasOwnProperty(MISSING_ADDRESS);
    },
  },
  methods: {
    /**
     * Update the address in the configBus with the new address and send the it to the external platform.
     */
    retry() {
      this.$configBus.address = { ...this.$configBus.address, ...this.values };

      // Trigger the checkout_in event to make the checkout update.
      document.dispatchEvent(new Event(EVENTS.UPDATE_CHECKOUT_IN));

      // Send the new values in an event. It's up to the external platform to do handle this event or not.
      document.dispatchEvent(new CustomEvent(EVENTS.ADDRESS_UPDATED_OUT, { detail: this.values }));
    },
  },
};
</script>
