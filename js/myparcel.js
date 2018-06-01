MyParcel = {
	/*
	 * Init
	 *
	 * Initialize the MyParcel checkout.
	 *
	 */
    data: {},
    currentLocation: {},

	init: function(externalData)
	{
        this.data = externalData;

		isMobile     = true;
		if($( window ).width() > 980 ) {
			isMobile = false;
		}

		/* Prices */
        $('#mypa-morning-delivery').html(' ( + &euro;' + this.data.config.priceMorningDelivery +')');
        $('#mypa-evening-delivery').html(' ( + &euro;' + this.data.config.priceEveningDelivery +')');
		$('#mypa-signature-price').html(' ( + &euro;' + this.data.config.priceSignature +')');
        $('#mypa-only-recipient').html(' ( + &euro;' + this.data.config.priceOnlyRecipient +')');
		$('#mypa-delivery-monday-price').html(' ( + &euro;' + this.data.config.priceMondayDelivery +')');


		if(parseFloat(this.data.config.pricePickup) > 0){
			$('#mypa-price-pickup').html(' ( + &euro;' + this.data.config.pricePickup +')');
		}
		/* Call delivery options */
		MyParcel.callDeliveryOptions();	

		/* Engage defaults */
		MyParcel.hideDelivery();
		$('#method-myparcel-normal').click();

        MyParcel.bind();
	},

	setCurrentDeliveryOptions: function () {
    	var selectedDate 	= $('#mypa-select-date').val();
		var selectDateKey 	=	MyParcel.storeDeliveryOptions.data.delivery[selectedDate]['time'];

        MyParcel.hideMorningDelivery();
        MyParcel.hideEveningDelivery();

		$.each(selectDateKey, function(key, value){

            if(value['price_comment'] == 'morning' && MyParcel.data.config.allowMorningDelivery){
                var morningTitel = MyParcel.data.config.deliveryMorningTitel;
                MyParcel.getDeliveryTime(morningTitel,'morning', MyParcel.data.config.deliveryMorningTitel, value['start'], value['end']);
            	MyParcel.showMorningDelivery();
			}
            if(value['price_comment'] == 'standard'){
                var standardTitel = MyParcel.data.config.deliveryStandardTitel;
                MyParcel.getDeliveryTime(standardTitel,'standard', MyParcel.data.config.deliveryStandardTitel, value['start'], value['end']);

            }
            if(value['price_comment'] == 'avond' && MyParcel.data.config.allowEveningDelivery){
                var eveningTitel = MyParcel.data.config.deliveryEveningTitel;
                MyParcel.getDeliveryTime(eveningTitel, 'evening', MyParcel.data.config.deliveryEveningTitel, value['start'], value['end'] );
                MyParcel.showEveningDelivery();
            }

        });

    },
    getDeliveryTime: function (configDeliveryTitel, deliveryMoment, deliveryTitel, startTime, endTime) {
		startTime = startTime.replace(/(.*)\D\d+/, '$1');
        endTime = endTime.replace(/(.*)\D\d+/, '$1');

        $('#mypa-'+deliveryMoment+'-titel').html(deliveryTitel);

        if (!configDeliveryTitel){
            $('#mypa-'+deliveryMoment+'-titel').html(startTime + ' - ' + endTime);
        }

    },

    setCurrentLocation: function () {
        var locationId 			= $('#mypa-pickup-location').val();
        this.currentLocation 	= MyParcel.storeDeliveryOptions.data.pickup[locationId];
    },

    /*
     * Bind
     *
     * Bind actions to selectors.
     *
     */

	bind: function ()
 	{
		$('#mypa-submit').on('click', function(e)
		{
			e.preventDefault();
			MyParcel.exportDeliveryOptionToWebshop();
		});

        /* show default delivery options and hide PostNL options */
        $('#mypa-deliver-pickup-deliver').on('click', function(){
            MyParcel.setCurrentDeliveryOptions();
            MyParcel.showDelivery();
            MyParcel.hidePickUpLocations();
        });

        /* hide default delivery options and show PostNL options */
        $('#mypa-deliver-pickup-pickup').on('click', function(){
            MyParcel.hideDelivery();
            MyParcel.showPickUpLocations();
        });

        $('#method-myparcel-delivery-morning, #method-myparcel-delivery-evening').on('click', function(){
            MyParcel.defaultCheckCheckbox('mypa-only-recipient');
        });

        /* Mobile specific triggers */
		if(isMobile){
			$('#mypa-show-location-details').on('click', function(){
				MyParcel.setCurrentLocation();
				MyParcel.showLocationDetails();
			});
		}

		/* Desktop specific triggers */
		else {
			$('#mypa-show-location-details').on('mouseenter', function(){
                MyParcel.setCurrentLocation();
				MyParcel.showLocationDetails();
			});
		}

		$('#mypa-location-details').on('click', function(){
			MyParcel.hideLocationDetails();
		});

        $('#method-myparcel-normal').on('click', function(){
            MyParcel.defaultCheckCheckbox('method-myparcel-normal');
        });

        $('#mypa-pickup-express').hide();  /* todo: move */


        $('#mypa-deliver-pickup-pickup, #mypa-pickup-location').on('change', function(e){
        	MyParcel.setCurrentLocation();
        	MyParcel.toggleDeliveryOptions();
        });

        $('#mypa-select-date').on('change', function(e){
           MyParcel.setCurrentDeliveryOptions();
        });
	},

    /*
     * defaultCheckCheckbox
     *
     * Check the additional options that are required for certain delivery options
     *
     */
    defaultCheckCheckbox: function(selectedOption){
		if(selectedOption == 'mypa-only-recipient'){
            $('#mypa-only-recipient-selector').prop('checked', true).prop({disabled: true});
            $('#mypa-only-recipient').html(' (Inclusief)');
		} else {
            $('#mypa-only-recipient-selector').prop('checked', false).removeAttr("disabled");
            $('#mypa-only-recipient').html(' ( + &euro;' + this.data.config.priceOnlyRecipient +')');
        }
	},

	/*
	 * toggleDeliveryOptions
	 *
	 * Shows and hides the display options that are valid for the recipient only and signature required pre-selectors
	 *
	 */

	toggleDeliveryOptions: function()
	{
		var isPickup	= $('#mypa-deliver-pickup-pickup').is(':checked');

		if(isPickup && this.currentLocation.price_comment === "retailexpress"){
			$('#mypa-pickup-express-price').html(' ( + &euro;' + this.data.config.pricePickupExpress +')');
			$('#mypa-pickup-express').show();

		} else{
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

	exportDeliveryOptionToWebshop: function()
	{
		var deliveryOption = "";
		var selected       = $("#mypa-delivery-option-form").find("input[type='radio']:checked");
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

	hideMessage: function()
	{
		$('#mypa-message').hide();
		$('#mypa-message').html(' ');
	},

	/*
	 * hideMessage
	 *
	 * Hides pop-up essage.
	 *
	 */

	showMessage: function(message)
	{
		$('#mypa-message').html(message);
		$('#mypa-message').show();
	},

	/*
	 * hideDelivery
	 *
	 * Hides interface part for delivery.
	 *
	 */

	hideDelivery: function()
	{
		$('#mypa-delivery-date').hide();
		$('#mypa-pre-selectors-nl').hide();
		$('#mypa-delivery-selectors-nl').hide();
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

	showDelivery: function()
	{
		$('#mypa-pre-selectors-' +      this.data.address.cc.toLowerCase()).show();
		$('#mypa-delivery-selectors-' + this.data.address.cc.toLowerCase()).show();
		$('#mypa-delivery-date').show();

		MyParcel.hideSignature();
		if(this.data.config.allowSignature){
			MyParcel.showSignature();
		}

        MyParcel.hideOnlyRecipient();
        if(this.data.config.allowOnlyRecipient){
            MyParcel.showOnlyRecipient();
        }
	},

	/*
	 * hideAllDeliveryOptions
	 *
	 * Hides all available MyParcel delivery options.
	 *
	 */

	hideAllDeliveryOptions: function()
	{
		$('.mypa-delivery-option').hide();
		$('#mypa-delivery-selectors-be').hide();
	},

	/*
	 * showAllDeliveryOptions
	 *
	 * Shows all available MyParcel delivery options.
	 *
	 */

	showAllDeliveryOptions: function()
	{
		$('.mypa-delivery-option').show();
	},

	/*
	 * showSpinner
	 *
	 * Shows the MyParcel spinner.
	 *
	 */

	showSpinner: function()
	{
		$('#mypa-spinner').show();
	},


    /*
     * hideSpinner
     *
     * Hides the MyParcel spinner.
     *
     */

    hideSpinner: function()
    {
        $('#mypa-spinner').hide();
    },

    showMorningDelivery: function()
    {
        $('.method-myparcel-delivery-morning-div').show();
    },

    hideMorningDelivery: function()
    {
        $('.method-myparcel-delivery-morning-div').hide();
    },

    showEveningDelivery: function()
    {
        $('.method-myparcel-delivery-evening-div').show();
    },

    hideEveningDelivery: function()
    {
        $('.method-myparcel-delivery-evening-div').hide();
    },

    showSignature: function()
    {
        $('#mypa-postnl-signature').show();
    },

	hideSignature: function()
    {
        $('#mypa-postnl-signature').hide();
    },

    showOnlyRecipient: function()
    {
        $('#mypa-postnl-only-recipient').show();
    },

    hideOnlyRecipient: function()
    {
        $('#mypa-postnl-only-recipient').hide();
    },

	/*
	 * dateToString
	 * 
	 * Convert api date string format to human readable string format
	 *
	 */

	dateToString: function(apiDate)
	{
		var deliveryDate 	= apiDate;
		var dateArr      	= deliveryDate.split('-');
		var dateObj      	= new Date(dateArr[0],dateArr[1]-1,dateArr[2]);
		var day				= ("0" + (dateObj.getDate())).slice(-2);
		var month        	= ("0" + (dateObj.getMonth() + 1)).slice(-2);

		return this.data.txtWeekDays[dateObj.getDay()] + " " + day + "-" + month + "-" + dateObj.getFullYear();
	},

	/*
	 * showDeliveryDates
	 *
	 * Show possible delivery dates.
	 * 
	 */

	showDeliveryDates: function()
	{
        var html = "";

        $.each(MyParcel.data.deliveryOptions.data.delivery, function(key, value){
            html += '<option value="' + key + '">' + MyParcel.dateToString(value.date) + ' </option>\n';
        });
        $('#mypa-select-date').html(html);
	},

    hideDeliveryDates: function()
    {
        $('#mypa-delivery-date').parent().hide();
    },

	/*
	 * clearPickupLocations
	 *
	 * Clear pickup locations and show a non-value option.
	 *
	 */

	clearPickUpLocations: function()
	{
		var html = '<option value="">---</option>';
		$('#mypa-pickup-location').html(html);
	},


	/*
	 * hidePickupLocations
	 *
	 * Hide the pickup location option.
	 *
	 */

	hidePickUpLocations: function()
	{
		$('#mypa-pickup-options').hide();
		$('#mypa-pickup').hide();
		$('#mypa-pickup-express').hide();
	},


	/*
	 * showPickupLocations
	 *
	 * Shows possible pickup locations, from closest to furdest.
	 *
	 */

	showPickUpLocations: function()
	{
		var html = "";
		$.each(MyParcel.data.deliveryOptions.data.pickup, function(key, value){
			html += '<option value="' + key + '">' + value.location + ', ' + value.street + ' ' + value.number + ", " + value.city + " (" + value.distance  + " M) </option>\n";
		});
		$('#mypa-pickup-location').html(html);
        $("#mypa-pickup-selector").prop("checked", true);
        $('#mypa-pickup-options').show();
        $('#mypa-pickup').show();
	},

	/*
	 * hideLocationDetails
	 *
	 * Hide the detailed information pop-up for selected location.
	 *
	 */

	hideLocationDetails: function()
	{
		 $('#mypa-location-details').hide();
	},

	/*
	 * showLocationDetails
	 *
	 * Shows the detailed information pop-up for the selected pick-up location.
	 */

	showLocationDetails: function()
	{
		var html       		= "";
		var startTime		= this.currentLocation.start_time;

		/* Strip seconds if present */
		if(startTime.length > 5){
			startTime = startTime.slice(0,-3);
		}

        html += '<svg  class="svg-inline--fa fa-times fa-w-12" aria-hidden="true" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"></path></svg>'
		html += '<span class="mypa-pickup-location-details-location"><h3>' + this.currentLocation.location  + '</h3></span>'
		html += '<span class="mypa-pickup-location-details-street">' + this.currentLocation.street + '&nbsp;' + this.currentLocation.number + '</span>';
		html += '<span class="mypa-pickup-location-details-city">' + this.currentLocation.postal_code + '&nbsp;' + this.currentLocation.city + '</span>';
		if(this.currentLocation.phone_number){
			html += '<span class="mypa-pickup-location-details-phone">' + this.currentLocation.phone_number  + '</span>'
		}
		html += '<span class="mypa-pickup-location-details-time">Ophalen vanaf:&nbsp;' + startTime + '</span>'
		html += '<h3>Openingstijden</h3>';

		$.each(
            this.currentLocation.opening_hours, function(weekday, value){
			html += '<span class="mypa-pickup-location-details-day">' + MyParcel.data.translateENtoNL[weekday] + "</span> ";

			if(value[0] === undefined ){
				html +=  '<span class="mypa-time">Gesloten</span>';
			}

			$.each(value, function(key2, times){
				html +=  '<span class="mypa-time">' + times + "</span>";
			});
			html += "<br>";
		});

		$('#mypa-location-details').html(html);
		$('#mypa-location-details').show();
	},

	/*
	 * retryPostalcodeHouseNumber
	 *
	 * After detecting an unrecognised postcal code / house number combination the user can try again.
	 * This function copies the newly entered data back into the webshop forms.
	 *
	 */

	retryPostalcodeHouseNumber: function()
	{
		$(triggerPostalCode).val( $('#mypa-error-postcode').val() );
		$(triggerHouseNumber).val( $('#mypa-error-number').val() );
		MyParcel.hideMessage();
		MyParcel.callDeliveryOptions();
		$('#mypa-deliver-pickup-deliver').click();
	},

	/*
	 * showFallBackDelivery
	 *
	 * If the API call fails and we have no data about delivery or pick up options 
	 * show the customer an "As soon as possible" option.
	 */

	showFallBackDelivery: function()
	{
		MyParcel.hidePickUpLocations();
		$('#mypa-delivery-date').val('Zo snel mogelijk.');
		$('#mypa-deliver-pickup-deliver').click();
	},


	/*
	 * showRetru
	 *
	 * If a customer enters an unrecognised postal code housenumber combination show a 
	 * pop-up so they can try again.
	 */

	showRetry: function()
	{
		MyParcel.showMessage(
			'<h3>Huisnummer/postcode combinatie onbekend</h3>' +
			'<div class="full-width mypa-error">'+
			'<label for="mypa-error-postcode">Postcode</label>' +
			'<input type="text" name="mypa-error-postcode" id="mypa-error-postcode" value="'+$(triggerPostalCode).val() + '">' +
			'</div><div class="full-width mypa-error">' + 
			'<label for="mypa-error-number">Huisnummer</label>' +
			'<input type="text" name="mypa-error-number" id="mypa-error-number" value="'+$(triggerHouseNumber).val() + '">' +
			'<br><button id="mypa-error-try-again">Opnieuw</button>' +
			'</div>'
		);

		/* remove trigger that closes message */
		$('#mypa-message').off('click');

		/* bind trigger to new button */
		$('#mypa-error-try-again').on('click', function(){
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

	callDeliveryOptions: function()
	{
		MyParcel.showSpinner();
		MyParcel.clearPickUpLocations();

        var cc 				= this.data.address.cc;
        var postalCode 		= this.data.address.postalCode;
        var number 			= this.data.address.number;
        if (cc === "BE") {
            var numberExtra 	= this.data.address.numberExtra;
            var street 			= this.data.address.street;
		}

		if(numberExtra){
			number = number + numberExtra;
		}

		/* Don't call API unless both PC and House Number are set */
		if(!number || !postalCode) {
			MyParcel.hideSpinner();
			MyParcel.showFallBackDelivery();
			return;
		}

		/* add street for Belgium */
		$.get(this.data.config.apiBaseUrl + "delivery_options",
			{
                cc           			:this.data.address.cc,
                postal_code  			:postalCode,
                number       			:number,
                carrier      			:this.data.config.carrierCode,
				dropoff_days			:this.data.config.dropOffDays,
                monday_delivery			:this.data.config.allowMondayDelivery,
                deliverydays_window		:this.data.config.deliverydaysWindow,
				cutoff_time 			:this.data.config.cutoffTime
			})
			.done(function(response){

				MyParcel.data.deliveryOptions = response;

				if(response.errors){
					$.each(response.errors, function(key, value){
						/* Postalcode housenumber combination not found or not recognised. */
						if(value.code == '3212' || value.code == '3505'){
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
					MyParcel.showPickUpLocations();
                    MyParcel.showDeliveryDates();

					if(MyParcel.data.deliveryOptions.data.delivery.length <= 0 ){
                        MyParcel.hideDeliveryDates();
					}

					MyParcel.storeDeliveryOptions = response;
					$('#mypa-deliver-pickup-deliver').click();
				}
			})
			.fail(function(){
				MyParcel.showFallBackDelivery();
			})
			.always(function(){
				MyParcel.hideSpinner();
			});
	}
}
