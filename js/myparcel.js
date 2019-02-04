MyParcel = {
    /*
     * Init
     *
     * Initialize the MyParcel checkout.
     *
     */
    data: {},
    result: {},
    currentLocation: {},

    DELIVERY_MORNING: 'morning',
    DELIVERY_NORMAL: 'standard',
    DELIVERY_NIGHT: 'avond',
    DELIVERY_SIGNED: 0,
    DELIVERY_ONLY_RECIPIENT: 0,

    init: function (externalData) {
        this.data = externalData;

        isMobile = true;
        if ($(window).width() > 980) {
            isMobile = false;
        }

        /* Titles of the options*/
        if (MyParcel.data.config.headerDeliveryTitle) {
            $('#mypa-header-delivery-title').text(MyParcel.data.config.headerDeliveryTitle);
        }
        if (MyParcel.data.config.deliveryTitle) {
            $('#mypa-delivery-title').text(MyParcel.data.config.deliveryTitle);
        }
        if (MyParcel.data.config.onlyRecipientTitle) {
            $('#mypa-only-recipient-title').text(MyParcel.data.config.onlyRecipientTitle);
        }
        if (MyParcel.data.config.signatureTitle) {
            $('#mypa-signature-title').text(MyParcel.data.config.signatureTitle);
        }
        if (MyParcel.data.config.pickupTitle) {
            $('#mypa-pickup-title').text(MyParcel.data.config.pickupTitle);
        }

        /* Prices */
        $('#mypa-morning-delivery').html(MyParcel.getPriceHtml(this.data.config.priceMorningDelivery));
        $('#mypa-evening-delivery').html(MyParcel.getPriceHtml(this.data.config.priceEveningDelivery));
        $('#mypa-normal-delivery').html(MyParcel.getPriceHtml(this.data.config.priceStandardDelivery));
        $('#mypa-signature-price').html(MyParcel.getPriceHtml(this.data.config.priceSignature));
        $('#mypa-only-recipient-price').html(MyParcel.getPriceHtml(this.data.config.priceOnlyRecipient));
        $('#mypa-pickup-price').html(MyParcel.getPriceHtml(this.data.config.pricePickup));

        /* Call delivery options */
        MyParcel.callDeliveryOptions();

        /* Engage defaults */
        MyParcel.hideDelivery();
        $('#method-myparcel-normal').click();

        MyParcel.bind();
    },

    getPriceHtml: function (priceOfDeliveryOptionOrig) {
        if (!priceOfDeliveryOption || (typeof priceOfDeliveryOption !== 'string' && typeof priceOfDeliveryOption !== 'number')) {
            return "";
        }

        var escapeElem = document.createElement('P');
        escapeElem.innerText = priceOfDeliveryOptionOrig;
        var priceOfDeliveryOption = escapeElem.innerText;

        if (parseFloat(priceOfDeliveryOption) >= 0) {
            var price = '&euro; ' + priceOfDeliveryOption;
        }

        if (priceOfDeliveryOption && isNaN(parseFloat(priceOfDeliveryOption))) {
            var price = priceOfDeliveryOption;
        }

        return price;
    },

    setCurrentDeliveryOptions: function () {
        if (typeof MyParcel.storeDeliveryOptions === 'undefined') {
            console.error('setCurrentDeliveryOptions() MyParcel.storeDeliveryOptions === undefined');
            return;
        }

        var selectedDate = $('#mypa-select-date').val();
        var selectDateKey = MyParcel.storeDeliveryOptions.data.delivery[selectedDate]['time'];

        MyParcel.hideMorningDelivery();
        MyParcel.hideEveningDelivery();

        $.each(selectDateKey, function (key, value) {

            if (value['price_comment'] == 'morning' && MyParcel.data.config.allowMorningDelivery) {
                var morningTitle = MyParcel.data.config.deliveryMorningTitle;
                MyParcel.getDeliveryTime(morningTitle, 'morning', value['start'], value['end']);
                MyParcel.showMorningDelivery();
            }
            if (value['price_comment'] == 'standard') {
                var standardTitle = MyParcel.data.config.BEdeliveryTitle;
                if(MyParcel.data.address.cc === 'NL'){
                    standardTitle = MyParcel.data.config.deliveryStandardTitle;
                }
                MyParcel.getDeliveryTime(standardTitle, 'standard', value['start'], value['end']);

            }
            if (value['price_comment'] == 'avond' && MyParcel.data.config.allowEveningDelivery) {
                var eveningTitle = MyParcel.data.config.deliveryEveningTitle;
                MyParcel.getDeliveryTime(eveningTitle, 'evening', value['start'], value['end']);
                MyParcel.showEveningDelivery();
            }

        });
    },
    getDeliveryTime: function (configDeliveryTitle, deliveryMoment, startTime, endTime) {
        startTime = startTime.replace(/(.*)\D\d+/, '$1');
        endTime = endTime.replace(/(.*)\D\d+/, '$1');

        $('#mypa-' + deliveryMoment + '-title').text(configDeliveryTitle);

        if (!configDeliveryTitle) {
            $('#mypa-' + deliveryMoment + '-title').text(startTime + ' - ' + endTime);
        }

    },

    setCurrentLocation: function () {
        var locationId = $('#mypa-pickup-location').val();
        this.currentLocation = this.getPickupByLocationId(MyParcel.storeDeliveryOptions.data.pickup, locationId);

    },
    /*
     * Bind
     *
     * Bind actions to selectors.
     *
     */

    bind: function () {
        $('#mypa-submit').on('click', function (e) {
            e.preventDefault();
            MyParcel.exportDeliveryOptionToWebshop();
        });

        /* show default delivery options and hide PostNL options */
        $('#mypa-select-delivery').on('click', function () {
            MyParcel.setCurrentDeliveryOptions();
            MyParcel.showDelivery();
            MyParcel.hidePickUpLocations();
        });

        /* hide default delivery options and show PostNL options */
        $('#mypa-pickup-delivery').on('click', function () {
            MyParcel.hideDelivery();
            MyParcel.showPickUpLocations();
        });

        $('#method-myparcel-delivery-morning, #method-myparcel-delivery-evening').on('click', function () {
            MyParcel.defaultCheckCheckbox('mypa-only-recipient');
        });

        /* Mobile specific triggers */
        if (isMobile) {
            $('#mypa-show-location-details').on('click', function () {
                MyParcel.setCurrentLocation();
                MyParcel.showLocationDetails();
                MyParcel.hideDelivery();
            });
        }

        /* Desktop specific triggers */
        else {
            $('#mypa-show-location-details').on('mouseenter', function () {
                MyParcel.setCurrentLocation();
                MyParcel.showLocationDetails();
            });
        }

        $('#mypa-location-details').on('click', function () {
            MyParcel.hideLocationDetails();
        });

        $('#method-myparcel-normal').on('click', function () {
            MyParcel.defaultCheckCheckbox('method-myparcel-normal');
        });

        $('#mypa-pickup-express').hide();
        /* todo: move */


        $('#mypa-pickup-delivery, #mypa-pickup-location').on('change', function (e) {
            MyParcel.setCurrentLocation();
            MyParcel.toggleDeliveryOptions();
            MyParcel.mapExternalWebshopTriggers();
        });

        $('#mypa-select-date').on('change', function (e) {
            MyParcel.setCurrentDeliveryOptions();
            MyParcel.mapExternalWebshopTriggers();
        });

        /* External webshop triggers */
        $('#mypa-load').on('click', function () {

            MyParcel.mapExternalWebshopTriggers()
        });
    },

    mapExternalWebshopTriggers: function () {
        MyParcel.DELIVERY_SIGNED = 0;
        MyParcel.DELIVERY_ONLY_RECIPIENT = 0;
        MyParcel.removeStyleFromPrice();

        /**
         * Morning delivery
         *
         */
        if ($('#method-myparcel-delivery-morning').prop('checked')) {
            $('#s_method_myparcel_morning').click();
            MyParcel.DELIVERY_ONLY_RECIPIENT = 1;
            MyParcel.addStyleToPrice('#mypa-morning-delivery, #mypa-only-recipient-price');

            /**
             * Signature
             */
            if ($('#mypa-signature-selector').prop('checked')) {
                $('#s_method_myparcel_morning_signature').click();
                MyParcel.DELIVERY_SIGNED = 1;
                MyParcel.addStyleToPrice('#mypa-signature-price');
            }

            MyParcel.addDeliveryToExternalInput(MyParcel.DELIVERY_MORNING);
            return;
        }

        /**
         * Normal delivery
         *
         */
        if ($('#mypa-pickup-delivery').prop('checked') === false && $('#method-myparcel-normal').prop('checked')) {
            /**
             * Signature and only recipient
             */
            if ($('#mypa-signature-selector').prop('checked') && $('#mypa-only-recipient-selector').prop('checked')) {
                $('#s_method_myparcel_delivery_signature_and_only_recipient_fee').click();
                MyParcel.DELIVERY_SIGNED = 1;
                MyParcel.DELIVERY_ONLY_RECIPIENT = 1;
                MyParcel.addStyleToPrice('#mypa-signature-price, #mypa-only-recipient-price');
            } else

            /**
             * Signature
             */
            if ($('#mypa-signature-selector').prop('checked')) {
                $('#s_method_myparcel_delivery_signature').click();
                MyParcel.DELIVERY_SIGNED = 1;
                MyParcel.addStyleToPrice('#mypa-signature-price');
            } else

            /**
             * Only recipient
             */
            if ($('#mypa-only-recipient-selector').prop('checked')) {
                $('#s_method_myparcel_delivery_only_recipient').click();
                MyParcel.DELIVERY_ONLY_RECIPIENT = 1;
                MyParcel.addStyleToPrice('#mypa-only-recipient-price');
            } else {
                $('#s_method_myparcel_flatrate, #s_method_myparcel_tablerate').click();
            }

            MyParcel.addDeliveryToExternalInput(MyParcel.DELIVERY_NORMAL);
            return;
        }

        /**
         * Evening delivery
         *
         */
        if ($('#method-myparcel-delivery-evening').prop('checked')) {
            $('#s_method_myparcel_evening').click();
            MyParcel.DELIVERY_ONLY_RECIPIENT = 1;
            MyParcel.addStyleToPrice('#mypa-evening-delivery, #mypa-only-recipient-price');

            /**
             * Signature
             */
            if ($('#mypa-signature-selector').prop('checked')) {
                $('#s_method_myparcel_evening_signature').click();
                MyParcel.DELIVERY_SIGNED = 1;
                MyParcel.addStyleToPrice('#mypa-signature-price');
            }

            MyParcel.addDeliveryToExternalInput(MyParcel.DELIVERY_NIGHT);
            return;
        }

        /**
         * Pickup
         *
         */
        if ($('#mypa-pickup-delivery').prop('checked') || $('#mypa-pickup-selector').prop('checked')) {
            /**
             * Early morning pickup
             */
            if ($('#mypa-pickup-express-selector').prop('checked')) {
                $('#s_method_myparcel_pickup_express').click();
                MyParcel.addPickupToExternalInput('retailexpress');
                MyParcel.addStyleToPrice('#mypa-pickup-express-price');
                return;
            } else {
                MyParcel.addStyleToPrice('#mypa-pickup-price');
            }


            $('#s_method_myparcel_pickup').click();
            MyParcel.addPickupToExternalInput('retail');
        }
    },

    addPickupToExternalInput: function (selectedPriceComment) {
        var locationId = $('#mypa-pickup-location').val();
        var currentLocation = MyParcel.getPickupByLocationId(MyParcel.storeDeliveryOptions.data.pickup, locationId);

        var result = jQuery.extend({}, currentLocation);

        /* If retail; convert retailexpress to retail */
        if (selectedPriceComment === "retail") {
            MyParcel.result.price_comment = "retail";
        }

        $('#mypa-input').val(JSON.stringify(result));
    },

    addDeliveryToExternalInput: function (deliveryMomentOfDay) {

        var deliveryDateId = $('#mypa-select-date').val();

        var currentDeliveryData = MyParcel.triggerDefaultOptionDelivery(deliveryDateId, deliveryMomentOfDay);

        if (currentDeliveryData !== null) {
            currentDeliveryData.signed = MyParcel.DELIVERY_SIGNED;
            currentDeliveryData.only_recipient = MyParcel.DELIVERY_ONLY_RECIPIENT
            $('#mypa-input').val(JSON.stringify(currentDeliveryData));
        }
    },

    addStyleToPrice: function (chosenDelivery) {
        $(chosenDelivery).addClass('mypa-bold-price');
    },

    removeStyleFromPrice: function () {
        $('.mypa-delivery-option-table').find("span").removeClass('mypa-bold-price');
    },


    triggerDefaultOptionDelivery: function (deliveryDateId, deliveryMomentOfDay) {

        var dateArray = MyParcel.result.deliveryOptions.data.delivery[deliveryDateId];
        var currentDeliveryData = null;

        $.each(dateArray['time'], function (key, value) {
            if (value.price_comment === deliveryMomentOfDay) {
                currentDeliveryData = jQuery.extend({}, dateArray);
                currentDeliveryData['time'] = [value];
            }
        });

        if (currentDeliveryData === null) {
            $('#mypa-only-recipient-selector').prop('disabled', false).prop('checked', false);
            $('#method-myparcel-normal').prop('checked', true);
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
    defaultCheckCheckbox: function (selectedOption) {
        if (selectedOption === 'mypa-only-recipient') {
            $('#mypa-only-recipient-selector').prop('checked', true).prop({disabled: true});
            $('#mypa-only-recipient-price').text('Inclusief');
        } else {
            $('#mypa-only-recipient-selector').prop('checked', false).removeAttr("disabled");
            $('#mypa-only-recipient-price').html(MyParcel.getPriceHtml(this.data.config.priceOnlyRecipient));
        }
    },

    /*
     * toggleDeliveryOptions
     *
     * Shows and hides the display options that are valid for the recipient only and signature required pre-selectors
     *
     */

    toggleDeliveryOptions: function () {
        var isPickup = $('#mypa-pickup-delivery').is(':checked');
        $('#mypa-pickup-selector').prop('checked', true);

        if (isPickup && this.currentLocation.price_comment === "retailexpress") {
            $('#mypa-pickup-express-price').html(MyParcel.getPriceHtml(this.data.config.pricePickupExpress));
            $('#mypa-pickup-express').show();

        } else {
            $('#mypa-pickup-express-selector').attr("checked", false);
            $('#mypa-pickup-express').hide();

        }
    },


    /*
     * exportDeliverOptionToWebshop
     *
     * Exports the selected deliveryoption to the webshop.
     *
     */

    exportDeliveryOptionToWebshop: function () {
        var deliveryOption = "";
        var selected = $("#mypa-delivery-option-form").find("input[type='radio']:checked");
        if (selected.length > 0) {
            deliveryOption = selected.val();
        }

        /* XXX Send to appropriate webshop field */
    },


    /*
     * hideMessage
     *
     * Hides pop-up message.
     *
     */

    hideMessage: function () {
        $('.mypa-message-model').hide().html(' ');
        $('#mypa-delivery-option-form').show();
    },

    /*
     * hideMessage
     *
     * Hides pop-up essage.
     *
     */

    showMessage: function (message) {
        $('.mypa-message-model').text(message).show();
        $('#mypa-delivery-option-form').hide();

    },

    /*
     * hideDelivery
     *
     * Hides interface part for delivery.
     *
     */

    hideDelivery: function () {
        $('#mypa-delivery-date-select, #mypa-pre-selectors-nl, #mypa-delivery-date-text,.mypa-extra-delivery-options').hide();
        $('#mypa-delivery').parent().parent().hide();
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
        $('#mypa-delivery').parent().parent().show();

        if (MyParcel.data.address.cc === "NL") {
            $('#mypa-pre-selectors-' + this.data.address.cc.toLowerCase()).show();
            $('#mypa-delivery-selectors-' + this.data.address.cc.toLowerCase()).show();
            $('#mypa-delivery-date-select, .mypa-extra-delivery-options').show();

            MyParcel.hideSignature();
            if (this.data.config.allowSignature) {
                MyParcel.showSignature();
            }

            MyParcel.hideOnlyRecipient();
            if (this.data.config.allowOnlyRecipient) {
                MyParcel.showOnlyRecipient();
            }
        }
    },

    /*
     * showSpinner
     *
     * Shows the MyParcel spinner.
     *
     */

    showSpinner: function () {
        $('#mypa-delivery-option-form').hide();
        $('.mypa-message-model').hide();
        $('#mypa-spinner-model').show();
    },


    /*
     * hideSpinner
     *
     * Hides the MyParcel spinner.
     *
     */

    hideSpinner: function () {
        $('#mypa-spinner-model').hide();
    },

    showMorningDelivery: function () {
        $('#method-myparcel-delivery-morning-div').show();
    },

    hideMorningDelivery: function () {
        $('#method-myparcel-delivery-morning-div').hide();
    },

    showEveningDelivery: function () {
        $('#method-myparcel-delivery-evening-div').show();
    },

    hideEveningDelivery: function () {
        $('#method-myparcel-delivery-evening-div').hide();
    },

    showSignature: function () {
        $('.mypa-extra-delivery-option-signature, #mypa-signature-price').show();
    },

    hideSignature: function () {
        $('.mypa-extra-delivery-option-signature, #mypa-signature-price').hide();
    },

    showOnlyRecipient: function () {
        $('#mypa-only-recipient, #mypa-only-recipient-price').show();
    },

    hideOnlyRecipient: function () {
        $('#mypa-only-recipient, #mypa-only-recipient-price').hide();
    },

    /*
     * dateToString
     *
     * Convert api date string format to human readable string format
     *
     */

    dateToString: function (apiDate) {
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

    showDeliveryDates: function () {
        var html = "";
        var deliveryWindow = parseInt(MyParcel.data.config.deliverydaysWindow);

        $.each(MyParcel.result.deliveryOptions.data.delivery, function (key, value) {
            html += '<option value="' + key + '">' + MyParcel.dateToString(value.date) + ' </option>\n';
        });


        /* Hide the day selector when the value of the deliverydaysWindow is 0 or is NaN*/
        if (deliveryWindow === 0 || isNaN(deliveryWindow)) {
            $('#mypa-select-date').hide();
        }

        /* When deliverydaysWindow is 1, hide the day selector and show a div to show the date */
        if (deliveryWindow === 1) {
            $('#mypa-select-date').hide();
            $('#mypa-delivery-date-text').show();
        }

        /* When deliverydaysWindow > 1, show the day selector */
        if (deliveryWindow > 1) {
            $('#mypa-select-date').show();
            $('#mypa-delivery-date-text').hide();
        }

        $('#mypa-select-date, #mypa-date').html(html);
    },

    hideDeliveryDates: function () {
        $('#mypa-delivery-date-text').hide();
    },

    /*
     * clearPickupLocations
     *
     * Clear pickup locations and show a non-value option.
     *
     */

    clearPickUpLocations: function () {
        var html = '<option value="">---</option>';
        $('#mypa-pickup-location').html(html);
    },


    /*
     * hidePickupLocations
     *
     * Hide the pickup location option.
     *
     */

    hidePickUpLocations: function () {
        if (!MyParcel.data.config.allowPickupPoints) {
            $('#mypa-pickup-location-selector').hide();
        }

        $('#mypa-pickup-options, #mypa-pickup, #mypa-pickup-express, #mypa-pickup-google-maps').hide();

    },


    /*
     * showPickupLocations
     *
     * Shows possible pickup locations, from closest to furdest.
     *
     */

    showPickUpLocations: function () {
        if (MyParcel.data.config.allowPickupPoints) {

            var html = "";
            $.each(MyParcel.result.deliveryOptions.data.pickup, function (key, value) {
                var distance = parseFloat(Math.round(value.distance) / 1000).toFixed(1);
                html += '<option value="' + value.location_code + '">' + value.location + ', ' + value.street + ' ' + value.number + ", " + value.city + " (" + distance + " km) </option>\n";
            });
            $('#mypa-pickup-location').html(html).prop("checked", true);
            $('#mypa-pickup-location-selector, #mypa-pickup-options, #mypa-pickup').show();
        }

        if (MyParcel.data.config.allowGoogleMaps) {
            MyParcel.showBpostPickupOnGoogleMaps();
        }
    },

    /*
     * hideLocationDetails
     *
     * Hide the detailed information pop-up for selected location.
     *
     */

    hideLocationDetails: function () {
        $('#mypa-delivery-option-form').show();
        $('#mypa-location-details').hide();
    },

    /*
     * showLocationDetails
     *
     * Shows the detailed information pop-up for the selected pick-up location.
     */

    showLocationDetails: function () {
        var html = "";
        var locationId = $('#mypa-pickup-location').val();

        var currentLocation = MyParcel.getPickupByLocationId(MyParcel.storeDeliveryOptions.data.pickup, locationId);
        var startTime = currentLocation.start_time;

        /* Strip seconds if present */
        if (startTime.length > 5) {
            startTime = startTime.slice(0, -3);
        }

        html += '<svg  class="svg-inline--fa mypa-fa-times fa-w-12" aria-hidden="true" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"></path></svg>';
        html += '<span class="mypa-pickup-location-details-location"><h3>' + currentLocation.location + '</h3></span>';
        html += '<svg  class="mypa-bpost-logo" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 99" enable-background="new 0 0 100 99" xml:space="preserve"><image id="image0" width="80" height="80" x="0" y="0"xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAYzAAAGMwH7vU8fAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTgtMTAtMDNUMTY6MDErMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE4LTEwLTAzVDE2OjAyOjM1KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE4LTEwLTAzVDE2OjAyOjM1KzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZjM3ODgwLWJmY2MtNDAyMy1hNGQ4LTg2MjkzMWU3OWFjYyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmM3OGFlMDc0LTRjZjQtM2Y0Yi05ZTFkLTNjMDM5ZGVlNjczMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmIyNzA3NDkwLTM3ZDMtNGMzNi1hMGFmLWE1OTY0MDU2ZWFiZCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjI3MDc0OTAtMzdkMy00YzM2LWEwYWYtYTU5NjQwNTZlYWJkIiBzdEV2dDp3aGVuPSIyMDE4LTEwLTAzVDE2OjAxKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWFmMzc4ODAtYmZjYy00MDIzLWE0ZDgtODYyOTMxZTc5YWNjIiBzdEV2dDp3aGVuPSIyMDE4LTEwLTAzVDE2OjAyOjM1KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz43fjT8AAAT7ElEQVR4nO2ce5Bl1XXef2vvfc59dPd00zM9A/NiYIBhZngowjIKEiiDhJiSLWMUJ0olUWSssvMgkZQHSSTFpT8SJFlVtspGTjmh5KgAySrbClCSLBkkR3IQihJwKjjG1gNBEDDMo2emu+/r3LP3Wvnj3Nt9e6bnRWOEXP1Vne7b5+57zt7fWY9vr71vi5mxhpcO96PuwI871ghcJdYIXCXWCFwl1ghcJdYIXCXWCFwl1ghcJdYIXCXWCFwl1ghcJdYIXCXWCFwl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" /></svg>';
        html += '<span class="mypa-pickup-location-details-street">' + currentLocation.street + '&nbsp;' + this.currentLocation.number + '</span>';
        html += '<span class="mypa-pickup-location-details-city">' + currentLocation.postal_code + '&nbsp;' + currentLocation.city + '</span>';

        if (currentLocation.phone_number) {
            html += '<span class="mypa-pickup-location-details-phone">' + currentLocation.phone_number + '</span>';
        }
        html += '<span class="mypa-pickup-location-details-time">Ophalen vanaf:&nbsp;' + startTime + '</span>';
        html += '<h3 class="mypa-openings-titel">Openingstijden</h3>';

        $.each(
            currentLocation.opening_hours, function (weekday, value) {
                html += '<span class="mypa-pickup-location-details-day">' + MyParcel.data.translateENtoNL[weekday] + "</span> ";

                if (value[0] === undefined) {
                    html += '<span class="mypa-time">Gesloten</span>';
                }

                $.each(value, function (key2, times) {
                    html += '<span class="mypa-time">' + times + "</span>";
                });
                html += "<br>";
            });

        $('#mypa-delivery-option-form').hide();
        $('#mypa-location-details').html(html).show();
    },

    showBpostPickupOnGoogleMaps: function () {

        $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAyBuzlPSNhmRIEhIl-3ZUidj3fwXfsDSw&amp;sensor=false", function () {
            $('#mypa-pickup-google-maps').show();

            var bounds = new google.maps.LatLngBounds();
            var infowindow = new google.maps.InfoWindow();
            var marker, i;

            var locations = [
                $.each(MyParcel.result.deliveryOptions.data.pickup, function (key, value) {
                    [value.location, value.latitude, value.longitude, key]
                }),
            ];

            var map = new google.maps.Map(document.getElementById('mypa-map'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            for (i = 0; i < locations[0].length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[0][i]['latitude'], locations[0][i]['longitude']),
                    map: map
                });
                bounds.extend(marker.position);

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(locations[0][i]['location']);
                        infowindow.open(map, marker);
                        map.setZoom(18);
                        map.setCenter(marker.getPosition());
                    }
                })(marker, i));
            }
            map.fitBounds(bounds);

            /* zoom in the middel to 12 */
            var listener = google.maps.event.addListener(map, "idle", function () {
                map.setZoom(12);
                google.maps.event.removeListener(listener);
            });
        });
    },

    /*
     * getPickupByLocationId
     *
     * Find the location by id and return the object.
     *
     */
    getPickupByLocationId: function (obj, locationId) {
        var object;

        $.each(obj, function (key, info) {
            if (info.location_code === locationId) {
                object = info;
                return false;
            };
        });

        return object;
    },

    /*
     * retryPostalcodeHouseNumber
     *
     * After detecting an unrecognised postcal code / house number combination the user can try again.
     * This function copies the newly entered data back into the webshop forms.
     *
    */
    retryPostalcodeHouseNumber: function () {
        this.data.address.postalCode = $('#mypa-error-postcode').val();
        this.data.address.number = $('#mypa-error-number').val();

        $('#postalCode').val(this.data.address.postalCode);
        $('#number').val(this.data.address.number);

        MyParcel.callDeliveryOptions();
        $('#mypa-select-delivery').click();
    },

    /*
     * showFallBackDelivery
     *
     * If the API call fails and we have no data about delivery or pick up options
     * show the customer an "As soon as possible" option.
     */

    showFallBackDelivery: function () {
        MyParcel.hideSpinner();
        MyParcel.hideDelivery();
        $('#mypa-select-date, #method-myparcel-normal').hide();
        $('.mypa-is-pickup-element').hide();
        $('#mypa-select-delivery-title').text('Zo snel mogelijk bezorgen');
    },


    /*
     * showRetru
     *
     * If a customer enters an unrecognised postal code housenumber combination show a
     * pop-up so they can try again.
     */

    showRetry: function () {
        MyParcel.showMessage(
            '<h3>Huisnummer/postcode combinatie onbekend</h3>' +
            '<div class="mypa-full-width mypa-error">' +
            '<label for="mypa-error-postcode">Postcode</label>' +
            '<input type="text" name="mypa-error-postcode" id="mypa-error-postcode" value="' + MyParcel.data.address.postalCode + '">' +
            '</div><div class="mypa-full-width mypa-error">' +
            '<label for="mypa-error-number">Huisnummer</label>' +
            '<input type="text" name="mypa-error-number" id="mypa-error-number" value="' + MyParcel.data.address.number + '">' +
            '<br><button id="mypa-error-try-again">Opnieuw</button>' +
            '</div>'
        );

        $('.mypa-message-model').off('click');

        /* bind trigger to new button */
        $('#mypa-error-try-again').on('click', function () {
            MyParcel.retryPostalcodeHouseNumber();
        });
    },


    /*
     * callDeliveryOptions
     *
     * Calls the MyParcel API to retrieve the pickup and delivery options for given house number and
     * Postal Code.
     *
     */

    callDeliveryOptions: function () {
        MyParcel.showSpinner();
        MyParcel.clearPickUpLocations();

        var cc = this.data.address.cc;
        var postalCode = this.data.address.postalCode;
        var number = this.data.address.number;
        var city = this.data.address.city;
        var cutoffTime = this.data.config.cutoffTime;
        var mondayDeliveryActive = 0;

        if (postalCode == '' || number == '') {
            MyParcel.showMessage(
                '<h3>Adresgegevens zijn niet ingevuld</h3>'
            );
        }
        if (cc === "BE") {
            var numberExtra = this.data.address.numberExtra;
            var street = this.data.address.street;
        }

        if (numberExtra) {
            number = number + numberExtra;
        }

        /* Don't call API unless both Postcode and House Number are set */
        if (!number || !postalCode) {
            MyParcel.showFallBackDelivery();
            return;
        }

        /* Check if the deliverydaysWindow == 0 and hide the select input*/
        this.deliveryDaysWindow = this.data.config.deliverydaysWindow;

        if (this.deliveryDaysWindow <= 0) {
            this.deliveryDaysWindow = 1;
        }

        if (this.data.config.allowMondayDelivery === true) {
            mondayDeliveryActive = 1;
        }

        if (new Date().getDay() === 6){
            cutoffTime = this.data.config.saturdayCutoffTime;
        }

        var url = this.data.config.apiBaseUrl + "delivery_options";
        var params = {
            cc: this.data.address.cc,
            postal_code: postalCode,
            number: number,
            city: city,
            carrier: this.data.config.carrier,
            dropoff_days: this.data.config.dropOffDays,
            monday_delivery: mondayDeliveryActive,
            deliverydays_window: this.deliveryDaysWindow,
            cutoff_time: cutoffTime,
            dropoff_delay: this.data.config.dropoffDelay
        };

        $.get(url, params)
            .done(MyParcel.responseSuccess)
            .fail(MyParcel.responseError)
            .always(MyParcel.responseComplete);
    },

    responseSuccess: function (response) {
        MyParcel.result.deliveryOptions = response;
        if (response.errors) {
            $.each(response.errors, function (key, value) {
                /* Postalcode housenumber combination not found or not recognised. */
                if (value.code != '') {
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
            MyParcel.showDeliveryDates();
            if (MyParcel.result.deliveryOptions.data.delivery.length <= 0) {
                MyParcel.hideDeliveryDates();
            }
            MyParcel.storeDeliveryOptions = response;
        }
        MyParcel.hideSpinner();
    },

    responseError: function () {
        MyParcel.showFallBackDelivery();
    },

    responseComplete: function () {
        $('#mypa-select-delivery').click();
    }
};
