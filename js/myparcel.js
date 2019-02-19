MyParcel = {
    /*
     * Init
     *
     * Initialize the MyParcel checkout.
     *
     */
    data:            {},
    currentLocation: {},

    DELIVERY_MORNING:        'morning',
    DELIVERY_NORMAL:         'standard',
    DELIVERY_EVENING:        'avond',
    DELIVERY_PICKUP:         'retail',
    DELIVERY_PICKUP_EXPRESS: 'retailexpress',
    DELIVERY_SIGNATURE:      0,
    DELIVERY_ONLY_RECIPIENT: 0,

    CC_ALLOWED_SIGNATURE:              ['NL', 'BE'],
    CC_ALLOWED_DELIVERY_DAYS_WINDOW:   ['NL', 'BE'],
    CC_ALLOWED_ONLY_RECIPIENT:         ['NL'],
    CC_ALLOWED_EXTRA_DELIVERY_OPTIONS: ['NL'],

    SPLIT_STREET_REGEX: /(.*?)\s?(\d{1,4})[/\s\-]{0,2}([a-zA-Z]{1}\d{1,3}|-\d{1,4}|\d{2}\w{1,2}|[a-zA-Z]{1}[a-zA-Z\s]{0,3})?$/g,

    init: function(externalData) {
        this.data = externalData;
        isMobile = jQuery(window).width() < 980;

        /* Titles of the options*/
        if (MyParcel.data.config.deliveryTitle) {
            jQuery('#mypa-delivery-title').html(MyParcel.data.config.deliveryTitle);
        }
        if (MyParcel.data.config.headerDeliveryOptions) {
            jQuery('#mypa-delivery-options-title').html(MyParcel.data.config.headerDeliveryOptions);
            jQuery('#header-delivery-options-title').show();
        }
        if (MyParcel.data.config.onlyRecipientTitle) {
            jQuery('#mypa-only-recipient-title').html(MyParcel.data.config.onlyRecipientTitle);
        }
        if (MyParcel.data.config.signatureTitle) {
            jQuery('#mypa-signature-title').html(MyParcel.data.config.signatureTitle);
        }
        if (MyParcel.data.config.pickupTitle) {
            jQuery('#mypa-pickup-title').html(MyParcel.data.config.pickupTitle);
            jQuery('.mypa-pickup-delivery-titel').html(MyParcel.data.config.pickUpFrom);
        }

        /* Prices */
        var prices = {
            'morning':        this.data.config.priceMorningDelivery,
            'evening':        this.data.config.priceEveningDelivery,
            'normal':         this.data.config.priceStandardDelivery,
            'signature':      this.data.config.priceSignature,
            'only-recipient': this.data.config.priceOnlyRecipient,
            'pickup':         this.data.config.pricePickup
        };

        MyParcel.showPrices(prices);
        MyParcel.callDeliveryOptions();

        /* Engage defaults */
        MyParcel.hideDelivery();
        jQuery('#method-myparcel-normal').click();

        MyParcel.bind();
    },

    showPrices: function(prices) {
        jQuery.each(prices, function(selectName, price) {
            jQuery('#mypa-' + selectName + '-delivery, #mypa-' + selectName + '-price').html(MyParcel.getPriceHtml(price));
        });
    },

    getPriceHtml: function(priceOfDeliveryOption) {
        var price;

        if (!priceOfDeliveryOption) {
            price = "";
        }

        if (parseFloat(priceOfDeliveryOption) >= 0) {
            price = '+ &euro; ' + Number(priceOfDeliveryOption).toFixed(2).replace(".", ",");
        }

        if (parseFloat(priceOfDeliveryOption) < 0) {
            price = "<p class='colorGreen'>"+'- &euro; ' + Number(priceOfDeliveryOption).toFixed(2).replace(/-|\./g,function(match) {return (match==".")?",":""})+"</p>";
        }

        if (priceOfDeliveryOption && isNaN(parseFloat(priceOfDeliveryOption))) {
            price = priceOfDeliveryOption;
        }

        return price;
    },

    setCurrentDeliveryOptions: function() {
        if (typeof MyParcel.storeDeliveryOptions === 'undefined') {
            console.error('setCurrentDeliveryOptions() MyParcel.storeDeliveryOptions === undefined');
            return;
        }

        var selectedDate = jQuery('#mypa-select-date').val();
        var selectDateKey = MyParcel.storeDeliveryOptions.data.delivery[selectedDate]['time'];

        MyParcel.hideMorningDelivery();
        MyParcel.hideEveningDelivery();

        jQuery.each(selectDateKey, function(key, value) {
            if (value['price_comment'] == 'morning' && MyParcel.data.config.allowMorningDelivery) {
                var morningTitle = MyParcel.data.config.deliveryMorningTitle;
                MyParcel.getDeliveryTime(morningTitle, 'morning', value['start'], value['end']);
                MyParcel.showMorningDelivery();
            }

            if (value['price_comment'] == 'standard') {
                var standardTitle = MyParcel.data.config.deliveryStandardTitle;
                MyParcel.getDeliveryTime(standardTitle, 'standard', value['start'], value['end']);
            }
            if (value['price_comment'] == 'avond' && MyParcel.data.config.allowEveningDelivery) {
                var eveningTitle = MyParcel.data.config.deliveryEveningTitle;
                MyParcel.getDeliveryTime(eveningTitle, 'evening', value['start'], value['end']);
                MyParcel.showEveningDelivery();
            }
        });
    },

    getDeliveryTime: function(configDeliveryTitle, deliveryMoment, startTime, endTime) {
        jQuery('#mypa-' + deliveryMoment + '-title').html(configDeliveryTitle);

        if (!configDeliveryTitle) {
            jQuery('#mypa-' + deliveryMoment + '-title').html(startTime + ' – ' + endTime);
        }
    },

    setCurrentLocation: function() {
        var locationId = jQuery('#mypa-pickup-location').val();
        this.currentLocation = this.getPickupByLocationId(MyParcel.storeDeliveryOptions.data.pickup, locationId);
    },

    /*
     * Bind
     *
     * Bind actions to selectors.
     *
     */
    bind: function() {
        jQuery('#mypa-submit').on('click', function(e) {
            e.preventDefault();
            MyParcel.exportDeliveryOptionToWebshop();
        });

        /* show default delivery options and hide PostNL options */
        jQuery('#mypa-select-delivery').on('click', function() {
            MyParcel.setCurrentDeliveryOptions();
            MyParcel.showDelivery();
            MyParcel.hidePickUpLocations();
        });

        /* hide default delivery options and show PostNL options */
        jQuery('#mypa-pickup-delivery').on('click', function() {
            MyParcel.hideDelivery();
            MyParcel.showPickUpLocations();
        });

        jQuery('#method-myparcel-delivery-morning, #method-myparcel-delivery-evening').on('click', function() {
            MyParcel.defaultCheckCheckbox('mypa-only-recipient');
        });

        /* Mobile specific triggers */
        if (isMobile) {
            jQuery('#mypa-show-location-details').on('click', function() {
                MyParcel.setCurrentLocation();
                MyParcel.showLocationDetails();
                MyParcel.hideDelivery();
            });
        }

        /* Desktop specific triggers */
        else {
            jQuery('#mypa-show-location-details').on('click', function() {
                MyParcel.setCurrentLocation();
                MyParcel.showLocationDetails();
            });
        }

        jQuery('#mypa-location-details').on('click', function() {
            MyParcel.hideLocationDetails();
        });

        jQuery('#method-myparcel-normal').on('click', function() {
            MyParcel.defaultCheckCheckbox('method-myparcel-normal');
        });

        jQuery('#mypa-pickup-delivery, #mypa-pickup-location').on('change', function(e) {
            MyParcel.setCurrentLocation();
            MyParcel.toggleDeliveryOptions();
            MyParcel.mapExternalWebshopTriggers();
        });

        jQuery('#mypa-select-date').on('change', function(e) {
            MyParcel.setCurrentDeliveryOptions();
            MyParcel.mapExternalWebshopTriggers();
        });

        /* External webshop triggers */
        jQuery('#mypa-load input, #mypa-load select').on('input', function() {
            MyParcel.mapExternalWebshopTriggers()
        });
    },

    mapExternalWebshopTriggers: function() {
        MyParcel.DELIVERY_SIGNATURE = 0;
        MyParcel.DELIVERY_ONLY_RECIPIENT = 0;
        MyParcel.removeStyleFromPrice();

        /**
         * Morning delivery
         *
         */
        if (jQuery('#mypa-pickup-delivery').prop('checked') === false && jQuery('#method-myparcel-delivery-morning').prop('checked')) {
            jQuery('#s_method_myparcel_morning').click();
            MyParcel.DELIVERY_ONLY_RECIPIENT = 1;
            MyParcel.addStyleToPrice('#mypa-morning-delivery, #mypa-only-recipient-price');

            /**
             * Signature
             */
            if (jQuery('#mypa-signature-selector').prop('checked')) {
                jQuery('#s_method_myparcel_morning_signature').click();
                MyParcel.DELIVERY_SIGNATURE = 1;
                MyParcel.addStyleToPrice('#mypa-signature-price');
            }

            MyParcel.addDeliveryToExternalInput(MyParcel.DELIVERY_MORNING);
            return;
        }

        /**
         * Normal delivery
         *
         */
        if (jQuery('#mypa-pickup-delivery').prop('checked') === false && jQuery('#method-myparcel-normal').prop('checked')) {
            MyParcel.addStyleToPrice('#mypa-normal-delivery');

            /**
             * Signature and only recipient
             */
            if (jQuery('#mypa-signature-selector').prop('checked') && jQuery('#mypa-only-recipient-selector').prop('checked')) {
                jQuery('#s_method_myparcel_delivery_signature_and_only_recipient_fee').click();
                MyParcel.DELIVERY_SIGNATURE = 1;
                MyParcel.DELIVERY_ONLY_RECIPIENT = 1;
                MyParcel.addStyleToPrice('#mypa-signature-price, #mypa-only-recipient-price');
            } else

            /**
             * Signature
             */
            if (jQuery('#mypa-signature-selector').prop('checked')) {
                jQuery('#s_method_myparcel_delivery_signature').click();
                MyParcel.DELIVERY_SIGNATURE = 1;
                MyParcel.addStyleToPrice('#mypa-signature-price');

            } else

            /**
             * Only recipient
             */
            if (jQuery('#mypa-only-recipient-selector').prop('checked')) {
                jQuery('#s_method_myparcel_delivery_only_recipient').click();
                MyParcel.DELIVERY_ONLY_RECIPIENT = 1;
                MyParcel.addStyleToPrice('#mypa-only-recipient-price');

            } else {
                jQuery('#s_method_myparcel_flatrate, #s_method_myparcel_tablerate').click();
            }

            MyParcel.addDeliveryToExternalInput(MyParcel.DELIVERY_NORMAL);
            return;
        }

        /**
         * Evening delivery
         *
         */
        if (jQuery('#mypa-pickup-delivery').prop('checked') === false && jQuery('#method-myparcel-delivery-evening').prop('checked')) {
            jQuery('#s_method_myparcel_evening').click();
            MyParcel.DELIVERY_ONLY_RECIPIENT = 1;
            MyParcel.addStyleToPrice('#mypa-evening-delivery, #mypa-only-recipient-price');

            /**
             * Signature
             */
            if (jQuery('#mypa-signature-selector').prop('checked')) {
                jQuery('#s_method_myparcel_evening_signature').click();
                MyParcel.DELIVERY_SIGNATURE = 1;
                MyParcel.addStyleToPrice('#mypa-signature-price');
            }

            MyParcel.addDeliveryToExternalInput(MyParcel.DELIVERY_EVENING);
            return;
        }

        /**
         * Pickup
         *
         */
        if (jQuery('#mypa-pickup-delivery').prop('checked') || jQuery('#mypa-pickup-selector').prop('checked')) {
            /**
             * Early morning pickup
             */
            if (jQuery('#mypa-pickup-express-selector').prop('checked')) {
                jQuery('#s_method_myparcel_pickup_express').click();
                MyParcel.addPickupToExternalInput(MyParcel.DELIVERY_PICKUP_EXPRESS);
                MyParcel.addStyleToPrice('#mypa-pickup-express-price');
                return;
            } else {
                MyParcel.addStyleToPrice('#mypa-pickup-price');
            }

            jQuery('#s_method_myparcel_pickup').click();
            MyParcel.addPickupToExternalInput(MyParcel.DELIVERY_PICKUP);
        }
    },

    addPickupToExternalInput: function(selectedPriceComment) {
        var locationId = jQuery('#mypa-pickup-location').val();
        var currentLocation = MyParcel.getPickupByLocationId(MyParcel.storeDeliveryOptions.data.pickup, locationId);

        var result = jQuery.extend({}, currentLocation);

        /* If pickup; convert pickup express to pickup */
        if (selectedPriceComment === MyParcel.DELIVERY_PICKUP) {
            result.price_comment = MyParcel.DELIVERY_PICKUP;
        }

        jQuery('body').trigger('update_checkout');
        jQuery('#mypa-input').val(JSON.stringify(result));
    },

    addDeliveryToExternalInput: function(deliveryMomentOfDay) {
        var deliveryDateId = jQuery('#mypa-select-date').val();
        var currentDeliveryData = MyParcel.triggerDefaultOptionDelivery(deliveryDateId, deliveryMomentOfDay);

        if (currentDeliveryData !== null) {
            currentDeliveryData.signature = MyParcel.DELIVERY_SIGNATURE;
            currentDeliveryData.only_recipient = MyParcel.DELIVERY_ONLY_RECIPIENT;
            jQuery('#mypa-input').val(JSON.stringify(currentDeliveryData));
        }
        jQuery('body').trigger('update_checkout');
    },

    addStyleToPrice: function(chosenDelivery) {
        jQuery(chosenDelivery).addClass('mypa-bold-price');
    },

    removeStyleFromPrice: function() {
        jQuery('.mypa-delivery-option-table').find("span").removeClass('mypa-bold-price');
    },

    triggerDefaultOptionDelivery: function(deliveryDateId, deliveryMomentOfDay) {
        var dateArray = MyParcel.data.deliveryOptions.data.delivery[deliveryDateId];
        var currentDeliveryData = null;

        jQuery.each(dateArray['time'], function(key, value) {
            if (value.price_comment === deliveryMomentOfDay) {
                currentDeliveryData = jQuery.extend({}, dateArray);
                currentDeliveryData['time'] = [value];
            }
        });

        if (currentDeliveryData === null) {
            jQuery('#mypa-only-recipient-selector').prop('disabled', false).prop('checked', false);
            jQuery('#method-myparcel-normal').prop('checked', true);
            MyParcel.mapExternalWebshopTriggers();
        }

        return currentDeliveryData;
    },

    /*
     * defaultCheckCheckbox
     *
     * Check the additional options that are required for certain delivery options
     *
     */
    defaultCheckCheckbox: function(selectedOption) {
        if (selectedOption === 'mypa-only-recipient') {
            jQuery('#mypa-only-recipient-selector').prop('checked', true).prop({disabled: true});
            jQuery('#mypa-only-recipient-price').html('Inclusief');
        } else {
            jQuery('#mypa-only-recipient-selector').prop('checked', false).removeAttr("disabled");
            jQuery('#mypa-only-recipient-price').html(MyParcel.getPriceHtml(this.data.config.priceOnlyRecipient));
        }
    },

    /*
     * toggleDeliveryOptions
     *
     * Shows and hides the display options that are valid for the recipient only and signature required pre-selectors
     *
     */
    toggleDeliveryOptions: function() {
        var isPickup = jQuery('#mypa-pickup-delivery').is(':checked');
        jQuery('#mypa-pickup-selector').prop('checked', true);

        if (isPickup && this.currentLocation.price_comment === MyParcel.DELIVERY_PICKUP_EXPRESS && this.data.config.allowPickupExpress) {
            jQuery('#mypa-pickup-express-price').html(MyParcel.getPriceHtml(this.data.config.pricePickupExpress));
            jQuery('#mypa-pickup-express').show();
        } else {
            jQuery('#mypa-pickup-express-selector').attr("checked", false);
            jQuery('#mypa-pickup-express').hide();
        }
    },

    /*
     * exportDeliverOptionToWebshop
     *
     * Exports the selected delivery option to the webshop.
     *
     */
    exportDeliveryOptionToWebshop: function() {
        var deliveryOption = "";
        var selected = jQuery("#mypa-delivery-option-form").find("input[type='radio']:checked");
        if (selected.length > 0) {
            deliveryOption = selected.val();
        }
    },

    /*
     * hideMessage
     *
     * Hides pop-up message.
     *
     */
    hideMessage: function() {
        jQuery('.mypa-message-model').hide();
        jQuery('#mypa-delivery-option-form').show();
    },

    /*
     * hideMessage
     *
     * Hides pop-up message.
     *
     */
    showMessage: function(message) {
        jQuery('.mypa-message-model').html(message).show();
        jQuery('#mypa-delivery-option-form').hide();
    },

    /*
     * hideDelivery
     *
     * Hides interface part for delivery.
     *
     */
    hideDelivery: function() {
        jQuery('#mypa-delivery-date-text,.mypa-extra-delivery-options').hide();
        jQuery('#mypa-select-date, #mypa-delivery').parent().parent().hide();
        MyParcel.hideSignature();
        MyParcel.hideOnlyRecipient();
        MyParcel.hideMorningDelivery();
        MyParcel.hideEveningDelivery();
    },

    /*
     * showDelivery
     *
     * Shows interface part for delivery.
     *
     */
    showDelivery: function () {
        jQuery('#mypa-delivery').parent().parent().show();
        MyParcel.hideSignature();
        MyParcel.hideOnlyRecipient();
        cc = MyParcel.data.address.cc;

        if (MyParcel.CC_ALLOWED_DELIVERY_DAYS_WINDOW.includes(cc) && this.data.config.deliverydaysWindow >= 2) {
            jQuery('#mypa-delivery-date-select').show();
        }

        if (MyParcel.CC_ALLOWED_SIGNATURE.includes(cc) && this.data.config.allowSignature) {
            MyParcel.showSignature();
        }

        if (MyParcel.CC_ALLOWED_ONLY_RECIPIENT.includes(cc) && this.data.config.allowOnlyRecipient) {
            MyParcel.showOnlyRecipient();
        }

        if (MyParcel.CC_ALLOWED_EXTRA_DELIVERY_OPTIONS.includes(cc)) {
            jQuery('#mypa-delivery-selectors-' + this.data.address.cc.toLowerCase()).show();
            jQuery('.mypa-extra-delivery-options').show();
        }
    },

    hideAllDeliveryOptions: function() {
        jQuery('#mypa-load').hide();
    },

    showAllDeliveryOptions: function() {
        jQuery('#mypa-load').show();
    },

    /*
     * showSpinner
     *
     * Shows the MyParcel spinner.
     *
     */
    showSpinner: function() {
        jQuery('#mypa-delivery-option-form').hide();
        jQuery('.mypa-message-model').hide();
        jQuery('#mypa-spinner-model').show();
    },

    /*
     * hideSpinner
     *
     * Hides the MyParcel spinner.
     *
     */
    hideSpinner: function() {
        jQuery('#mypa-spinner-model').hide();
    },

    showMorningDelivery: function() {
        jQuery('#method-myparcel-delivery-morning-div').show();
    },

    hideMorningDelivery: function() {
        jQuery('#method-myparcel-delivery-morning-div').hide();
    },

    showEveningDelivery: function() {
        jQuery('#method-myparcel-delivery-evening-div').show();
    },

    hideEveningDelivery: function() {
        jQuery('#method-myparcel-delivery-evening-div').hide();
    },

    showSignature: function() {
        jQuery('.mypa-extra-delivery-option-signature, #mypa-signature-price').show();
    },

    hideSignature: function() {
        jQuery('.mypa-extra-delivery-option-signature, #mypa-signature-price').hide();
    },

    showOnlyRecipient: function() {
        jQuery('#mypa-only-recipient, #mypa-only-recipient-price').parent().show();
    },

    hideOnlyRecipient: function() {
        jQuery('#mypa-only-recipient, #mypa-only-recipient-price').parent().hide();
    },

    /*
     * dateToString
     *
     * Convert api date string format to human readable string format
     *
     */
    dateToString: function(apiDate) {
        var deliveryDate = apiDate;
        var dateArr = deliveryDate.split('-');
        var dateObj = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
        var day = ("0" + (dateObj.getDate())).slice(-2);
        var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);

        return this.data.txtWeekDays[dateObj.getDay()] + " " + day + "-" + month + "-" + dateObj.getFullYear();
    },

    /*
     * showDeliveryDates
     *
     * Show possible delivery dates.
     *
     */
    showDeliveryDates: function() {
        var html = "";
        var deliveryWindow = parseInt(MyParcel.data.config.deliverydaysWindow);

        jQuery.each(MyParcel.data.deliveryOptions.data.delivery, function(key, value) {
            html += '<option value="' + key + '">' + MyParcel.dateToString(value.date) + ' </option>\n';
        });

        /* Hide the day selector when the value of the deliverydaysWindow is 0*/
        if (deliveryWindow === 0) {
            jQuery('#mypa-delivery-date-select').hide();
        }

        /* When deliverydaysWindow is 1, hide the day selector and show a div to show the date */
        if (deliveryWindow === 1) {
            jQuery('#mypa-select-date').hide();
            jQuery('#mypa-delivery-date-text').show();
        }

        /* When deliverydaysWindow > 1, show the day selector */
        if (deliveryWindow > 1) {
            jQuery('#mypa-select-date').show();
        }

        jQuery('#mypa-select-date, #mypa-date').html(html);
    },

    hideDeliveryDates: function() {
        jQuery('#mypa-delivery-date-text').parent().hide();
    },

    /*
     * clearPickupLocations
     *
     * Clear pickup locations and show a non-value option.
     *
     */
    clearPickUpLocations: function() {
        var html = '<option value="">---</option>';
        jQuery('#mypa-pickup-location').html(html);
    },

    /*
     * hidePickupLocations
     *
     * Hide the pickup location option.
     *
     */
    hidePickUpLocations: function() {
        if (!MyParcel.data.config.allowPickupPoints) {
            jQuery('#mypa-pickup-location-selector').hide();
        }

        jQuery('#mypa-pickup-options, #mypa-pickup, #mypa-pickup-express').hide();
    },

    /*
     * showPickupLocations
     *
     * Shows possible pickup locations, from closest to further.
     *
     */
    showPickUpLocations: function() {
        if (false === MyParcel.data.config.allowPickupPoints) {
            return;
        }

        var html = "";
        jQuery.each(MyParcel.data.deliveryOptions.data.pickup, function(key, value) {
            var distance = parseFloat(Math.round(value.distance) / 1000).toFixed(1);
            html += '<option value="' + value.location_code + '">' + value.location + ', ' + value.street + ' ' + value.number + ", " + value.city + " (" + distance + " km) </option>\n";
        });
        jQuery('#mypa-pickup-location').html(html).prop("checked", true);
        jQuery('#mypa-pickup-location-selector, #mypa-pickup-options, #mypa-pickup').show();
    },

    /*
     * hideLocationDetails
     *
     * Hide the detailed information pop-up for selected location.
     *
     */
    hideLocationDetails: function() {
        jQuery('#mypa-delivery-option-form').show();
        jQuery('#mypa-location-details').hide();
    },

    /*
     * showLocationDetails
     *
     * Shows the detailed information pop-up for the selected pick-up location.
     */
    showLocationDetails: function() {
        var html = "";
        var locationId = jQuery('#mypa-pickup-location').val();

        var currentLocation = MyParcel.getPickupByLocationId(MyParcel.storeDeliveryOptions.data.pickup, locationId);
        var startTime = currentLocation.start_time;

        /* Strip seconds if present */
        if (startTime.length > 5) {
            startTime = startTime.slice(0, -3);
        }

        html += '<svg class="svg-inline--fa mypa-fa-times fa-w-12" aria-hidden="true" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"></path></svg>';
        html += '<span class="mypa-pickup-location-details-location"><h3>' + currentLocation.location + '</h3></span>';
        html += '<svg class="mypa-bpost-logo" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 99" enable-background="new 0 0 100 99" xml:space="preserve"><image id="bpost-logo" width="100" height="99" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAYzAAAGMwH7vU8fAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTgtMTAtMDNUMTY6MDErMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTEwLTAzVDE2OjAyOjM1KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTEwLTAzVDE2OjAyOjM1KzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZjM3ODgwLWJmY2MtNDAyMy1hNGQ4LTg2MjkzMWU3OWFjYyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmM3OGFlMDc0LTRjZjQtM2Y0Yi05ZTFkLTNjMDM5ZGVlNjczMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmIyNzA3NDkwLTM3ZDMtNGMzNi1hMGFmLWE1OTY0MDU2ZWFiZCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjI3MDc0OTAtMzdkMy00YzM2LWEwYWYtYTU5NjQwNTZlYWJkIiBzdEV2dDp3aGVuPSIyMDE4LTEwLTAzVDE2OjAxKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWFmMzc4ODAtYmZjYy00MDIzLWE0ZDgtODYyOTMxZTc5YWNjIiBzdEV2dDp3aGVuPSIyMDE4LTEwLTAzVDE2OjAyOjM1KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz43fjT8AAAT7ElEQVR4nO2ce5Bl1XXef2vvfc59dPd00zM9A/NiYIBhZngowjIKEiiDhJiSLWMUJ0olUWSssvMgkZQHSSTFpT8SJFlVtspGTjmh5KgAySrbClCSLBkkR3IQihJwKjjG1gNBEDDMo2emu+/r3LP3Wvnj3Nt9e6bnRWOEXP1Vne7b5+57zt7fWY9vr71vi5mxhpcO96PuwI871ghcJdYIXCXWCFwl1ghcJdYIXCXWCFwl1ghcJdYIXCXWCFwl1ghcJdYIXCXWCFwl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" /></svg>';
        html += '<span class="mypa-pickup-location-details-street">' + currentLocation.street + '&nbsp;' + this.currentLocation.number + '</span>';
        html += '<span class="mypa-pickup-location-details-city">' + currentLocation.postal_code + '&nbsp;' + currentLocation.city + '</span>';

        if (currentLocation.phone_number) {
            html += '<span class="mypa-pickup-location-details-phone">' + currentLocation.phone_number + '</span>';
        }
        html += '<span class="mypa-pickup-location-details-time">' + MyParcel.data.config.pickUpFrom + ':&nbsp;' + startTime + '</span>';
        html += '<h3>' + MyParcel.data.config.openingHours + '</h3>';

        jQuery.each(
            currentLocation.opening_hours, function(weekday, value) {
                html += '<span class="mypa-pickup-location-details-day">' + MyParcel.data.translateENtoNL[weekday] + "</span>";

                if (value[0] === undefined) {
                    html += '<span class="mypa-time">' + MyParcel.data.config.closed + '</span>';
                }

                jQuery.each(value, function(key2, times) {
                    html += '<span class="mypa-time">' + times + "</span>";
                });
                html += "<br>";
            });
        jQuery('#mypa-delivery-option-form').hide();
        jQuery('#mypa-location-details').html(html).css('display', 'inline-block');
    },

    /*
     * getPickupByLocationId
     *
     * Find the location by id and return the object.
     *
     */
    getPickupByLocationId: function(obj, locationId) {
        var object;

        jQuery.each(obj, function(key, info) {
            if (info.location_code === locationId) {
                object = info;
                return false;
            }
        });

        return object;
    },

    /*
     * retryPostalCodeCity
     *
     * After detecting an unrecognised postal code / city combination the user can try again.
     * This function copies the newly entered data back into the webshop forms.
     *
     */
    retryPostalCodeCity: function() {
        var retryPostalCode = jQuery('#mypa-error-postcode').val();
        var retryCity = jQuery('#mypa-error-city').val();

        jQuery('#postalCode').val(retryPostalCode);
        jQuery('#city').val(retryCity);

        MyParcel.callDeliveryOptions();
        jQuery('#mypa-select-delivery').click();
    },

    /*
     * showFallBackDelivery
     *
     * If the API call fails and we have no data about delivery or pick up options
     * show the customer an "As soon as possible" option.
     */
    showFallBackDelivery: function() {
        MyParcel.hideSpinner();
        MyParcel.hideDelivery();
        jQuery('#mypa-select-date, #method-myparcel-normal-div, .mypa-is-pickup-element').hide();
        jQuery('#mypa-select-delivery-title').html('Zo snel mogelijk bezorgen');
    },

    /*
     * showRetry
     *
     * If a customer enters an unrecognised postal code & house number combination show a
     * pop-up so they can try again.
     */
    showRetry: function() {
        MyParcel.showMessage(
            '<h3>' + MyParcel.data.config.wrongPostalCodeCity + '</h3>' +
            '<div class="mypa-full-width mypa-error">' +
            '<label for="mypa-error-postcode">' + MyParcel.data.config.postcode + '</label>' +
            '<input type="text" name="mypa-error-postcode" id="mypa-error-postcode" value="' + MyParcel.data.address.postalCode + '">' +
            '</div><div class="mypa-full-width mypa-error">' +
            '<label for="mypa-error-city">' + MyParcel.data.config.city + '</label>' +
            '<input type="text" name="mypa-error-city" id="mypa-error-city" value="' + MyParcel.data.address.city + '">' +
            '<br><div id="mypa-error-try-again" class="btn btn-info">' + MyParcel.data.config.retry + '</div>' +
            '</div>'
        );

        /* remove trigger that closes message */
        jQuery('#mypa-message').off('click');

        /* bind trigger to new button */
        jQuery('#mypa-error-try-again').on('click', function() {
            MyParcel.retryPostalCodeCity();
        });
    },

    setAddressFromInputFields: function() {
        this.data.address.cc = $('#cc').val();
        this.data.address.city = $('#city').val().trim();
        this.data.address.postalCode = $('#postalCode').val().trim();
    },

    /*
     * callDeliveryOptions
     *
     * Calls the MyParcel API to retrieve the pickup and delivery options for given house number and
     * Postal Code.
     *
     */
    callDeliveryOptions: function() {
        MyParcel.showSpinner();
        MyParcel.clearPickUpLocations();
        MyParcel.hideDelivery();
        MyParcel.setAddressFromInputFields();

        // Hide PostNL field if there is no address entered
        if (!MyParcel.data.address.postalCode && !MyParcel.data.address.city) {
            MyParcel.hideSpinner();
            MyParcel.showMessage(
                '<h3>' + MyParcel.data.config.addressNotFound + '</h3>'
            );
            return;
        }

        /* Check if the deliverydaysWindow == 0 and hide the select input*/
        this.deliveryDaysWindow = this.data.config.deliverydaysWindow;

        if (this.deliveryDaysWindow === '0') {
            this.deliveryDaysWindow = 1;
        }

        deliveryDaysWindow = this.data.config.deliverydaysWindow;
        saturdayDeliveryActive = this.data.config.allowSaturdayDelivery ? 1 : 0;
        cutoffTime = this.data.config.cutoff_time;

        /* Check if the deliverydaysWindow is 0 and hide the select input*/
        if (deliveryDaysWindow === '0') {
            deliveryDaysWindow = 1;
        }

        if (new Date().getDay() === 6) {
            cutoffTime = this.data.config.saturdayCutoffTime;
        }

        /* Make the api request */
        jQuery.get(this.data.config.apiBaseUrl + "delivery_options",
            {
                cc:                  this.data.address.cc,
                postal_code:         this.data.address.postalCode,
                number:              this.data.address.number,
                city:                this.data.address.city,
                carrier:             this.data.config.carrier,
                dropoff_days:        this.data.config.dropOffDays,
                saturday_delivery:   saturdayDeliveryActive,
                deliverydays_window: deliveryDaysWindow,
                cutoff_time:         cutoffTime,
                dropoff_delay:       this.data.config.dropoffDelay
            })
            .done(function(response) {
                MyParcel.data.deliveryOptions = response;
                if (response.errors) {
                    jQuery.each(response.errors, function(key, value) {
                        /* Postal code & house number combination not found or not recognised. */
                        if (value.code === 3212 || value.code === 3505) {
                            MyParcel.showRetry();
                        }

                        /* Any other error */
                        else {
                            MyParcel.showFallBackDelivery();
                        }
                    });
                }

                /* No errors */
                else {
                    MyParcel.hideMessage();
                    MyParcel.showPickUpLocations();
                    MyParcel.showDeliveryDates();

                    if (MyParcel.data.deliveryOptions.data.delivery.length <= 0) {
                        MyParcel.hideDeliveryDates();
                    }
                    MyParcel.storeDeliveryOptions = response;
                }
                MyParcel.hideSpinner();
            })
            .fail(function() {
                MyParcel.showFallBackDelivery();
            })
            .always(function() {
                jQuery('#mypa-select-delivery').click();
            });
    }
};
