<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 jumbotron">
          <h1>MyParcel checkout sandbox</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <h3>Settings</h3>
          <p>
            This sandbox is meant to provide clarity about the MyParcel delivery options. Below you can see all
            possible options for MyParcel NL. Change the options to see the result.

            More information on each setting:
            <br>
            <a
              class="btn btn-primary"
              href="https://myparcelnl.github.io/api/#8">
              API docs
            </a>
          </p>
        </div>
        <div class="col-6">
          <h3>Code</h3>
          <p>
            If you adjust the options in the left column, you will see the change in the code below. In the code below
            you can see that an object has been built and that object is used in a function. You could build this
            object by adjusting the values inline with backend code. But it would be better if you can retrieve this
            object by means of a (rest) api.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <SettingsForm @update="updateSettings" />
        </div>
        <div class="col-6">
          <prism
            language="js"
            :code="`const data = ${toCodeString(code)};`"
            @click="clickCode" />
        </div>
        <div class="col-12">
          <h1>Checkout -></h1>
          <div id="myparcel-checkout" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/vendor/js/myparcel';
import SettingsForm from '@/components/SettingsForm';
import { samples } from '@/config/samples';

/**
 * @type {Object}
 */
const code = {
  address: {
    cc: 'NL',
    postalCode: '2131 BC',
    number: '679',
  },
  strings: {
    monday: 'maandag',
    tuesday: 'dinsdag',
    wednesday: 'woensdag',
    thursday: 'donderdag',
    friday: 'vrijdag',
    saturday: 'zaterdag',
    sunday: 'zondag',
    addressNotFound: 'Adresgegevens niet ingevuld',
    pickUpFrom: 'Afhalen vanaf',
    openingHours: 'Openingstijden',
    closed: 'Gesloten',
    postcode: 'Postcode',
    houseNumber: 'Huisnummer',
    city: 'Plaats',
    retry: 'Opnieuw',
    wrongHouseNumberPostcode: 'Combinatie postcode/huisnummer onbekend',
    deliveryTitle: 'Bezorgen op',
    deliveryMorningTitle: 'Ochtendlevering',
    deliveryEveningTitle: 'Avondlevering',
    signatureTitle: 'Handtekening',
    onlyRecipientTitle: 'Alleen geadresseerde',
    pickupTitle: 'Afhalen op locatie',
    BEdeliveryTitle: 'Thuis of op het werk',
    deliveryStandardTitle: '',
  },
  config: {
    apiBaseUrl: 'https://api.myparcel.nl/',
    dropOffDays: '1;2;3;4;5;6',
    cutoffTime: '17:00',
    deliverydaysWindow: 5,
    dropoffDelay: 0,
    allowMondayDelivery: true,
    saturdayCutoffTime: '14:30',
    allowMorningDelivery: true,
    priceMorningDelivery: 10,
    priceStandardDelivery: 5.85,
    allowEveningDelivery: true,
    priceEveningDelivery: 1.25,
    allowSignature: true,
    priceSignature: 0.36,
    allowOnlyRecipient: true,
    priceOnlyRecipient: 0.29,
    allowPickupPoints: false,
    pricePickup: 5.85,
    allowPickupExpress: true,
    pricePickupExpress: 7.23,
  },
};

export default {
  name: 'App',
  components: { SettingsForm },
  data() {
    return {
      code,
      regexSectionExpanded: false,
      values: {},
    };
  },

  computed: {
    samples: () => samples,
  },
  created() {
    document.dispatchEvent(new Event('myparcel_update_checkout'));
  },
  methods: {
    clickCode(event) {
      console.log(event);
    },

    /**
     * Convert given code to formatted js notation removing quotes around properties and replacing double quotes.
     *
     * @param {*} code - Code to convert.
     *
     * @returns {string}
     */
    toCodeString(code) {
      return JSON.stringify(code, null, '  ')
        .replace(/"(.+)":/g, '$1:')
        .replace(/(?!\\)"/g, '\'');
    },

    updateSettings(a, b) {
      console.log('updateSettings', a, b);

    },

    setOptions() {
      $('input[name^=\'config\'], input[name^=\'address\'], select[name^=\'address\']').each(function() {
        val = null;
        keys = $(this).attr('name').match(/([a-z]+)\[([a-zA-Z0-9]{1,50})]/);

        if (keys[2] === 'deliverydaysWindow') {
          val = $(this).is(':checked') ? '1' : '0';
        } else if ($(this).is(':checkbox')) {
          val = $(this).is(':checked');
        } else {
          val = $(this).val();
        }

        if (val === 'true') {
          val = true;
        }
        if (val === 'false') {
          val = false;
        }

        Sandbox.formOptions[keys[1]][keys[2]] = val;
      });
    },

  },
};
</script>
