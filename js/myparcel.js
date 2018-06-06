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
		$('#mypa-morning-delivery').html(MyParcel.getPriceHtml(this.data.config.priceMorningDelivery));
		$('#mypa-evening-delivery').html(MyParcel.getPriceHtml(this.data.config.priceEveningDelivery));
		$('#mypa-normal-delivery').html(MyParcel.getPriceHtml(this.data.config.priceNormalDelivery));
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

    getPriceHtml: function(priceOfDeliveryOption){

    	if (!priceOfDeliveryOption) {
            var price = "";
        }

        if (parseFloat(priceOfDeliveryOption) >= 0){
        	console.log(priceOfDeliveryOption);
            var price = '( + &euro; ' + priceOfDeliveryOption + ' )' ;
        }

        if (isNaN(parseFloat(priceOfDeliveryOption)) && priceOfDeliveryOption){
            var price = '( ' + priceOfDeliveryOption + ' )' ;
        }

    	return price;
	},

	setCurrentDeliveryOptions: function () {
    	if (typeof MyParcel.storeDeliveryOptions === 'undefined') {
            console.error('setCurrentDeliveryOptions() MyParcel.storeDeliveryOptions === undefined');
            return;
		}

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
        $('#mypa-select-delivery').on('click', function(){
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
            $('#mypa-only-recipient-price').html(' (Inclusief)');
		} else {
            $('#mypa-only-recipient-selector').prop('checked', false).removeAttr("disabled");
            $('#mypa-only-recipient-price').html(' ( + &euro;' + this.data.config.priceOnlyRecipient +')');
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
		$('.mypa-massage-model').hide().html(' ');
		$('#mypa-delivery-option-form').show();
	},

	/*
	 * hideMessage
	 *
	 * Hides pop-up essage.
	 *
	 */

	showMessage: function(message)
	{
		$('.mypa-massage-model').show();
		$('#mypa-message').html(message).show();
		$('#mypa-delivery-option-form').hide();

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
		$('#mypa-delivery').hide();
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
        $('#mypa-delivery').show();
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
	 * showSpinner
	 *
	 * Shows the MyParcel spinner.
	 *
	 */

	showSpinner: function()
	{
		$('.mypa-massage-model').hide();
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
        $('#method-myparcel-delivery-morning-div').show();
    },

    hideMorningDelivery: function()
    {
        $('#method-myparcel-delivery-morning-div').hide();
    },

    showEveningDelivery: function()
    {
        $('#method-myparcel-delivery-evening-div').show();
    },

    hideEveningDelivery: function()
    {
        $('#method-myparcel-delivery-evening-div').hide();
    },

    showSignature: function()
    {
        $('.mypa-extra-delivery-option-signature, #mypa-signature-price').show();
    },

	hideSignature: function()
    {
        $('.mypa-extra-delivery-option-signature, #mypa-signature-price').hide();
    },

    showOnlyRecipient: function()
    {
        $('#mypa-only-recipient, #mypa-only-recipient-price').show();
    },

    hideOnlyRecipient: function()
    {
        $('#mypa-only-recipient, #mypa-only-recipient-price').hide();
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
        if(!MyParcel.data.config.allowPickupPoints) {
            $('#mypa-pickup-location-selector').hide();
        }

		$('#mypa-pickup-options, #mypa-pickup, #mypa-pickup-express').hide();

	},


	/*
	 * showPickupLocations
	 *
	 * Shows possible pickup locations, from closest to furdest.
	 *
	 */

	showPickUpLocations: function()
	{
        if(MyParcel.data.config.allowPickupPoints) {

            var html = "";
            $.each(MyParcel.data.deliveryOptions.data.pickup, function (key, value) {
                var distance = parseFloat(Math.round(value.distance) / 1000).toFixed(2);
                html += '<option value="' + key + '">' + value.location + ', ' + value.street + ' ' + value.number + ", " + value.city + " (" + distance + " KM) </option>\n";
            });
            $('#mypa-pickup-location').html(html).prop("checked", true);
            $('#mypa-pickup-location-selector, #mypa-pickup-options, #mypa-pickup').show();
        }
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

        html += '<svg  class="svg-inline--fa mypa-fa-times fa-w-12" aria-hidden="true" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"></path></svg>'
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

		$('#mypa-location-details').html(html).show();
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
        this.data.address.postalCode = $('#mypa-error-postcode').val();
        this.data.address.number = $('#mypa-error-number').val();
		MyParcel.callDeliveryOptions();
		$('#mypa-select-delivery').click();
	},

	/*
	 * showFallBackDelivery
	 *
	 * If the API call fails and we have no data about delivery or pick up options 
	 * show the customer an "As soon as possible" option.
	 */

	showFallBackDelivery: function()
	{
		MyParcel.hideSpinner();
		MyParcel.hideDelivery();
		$('#mypa-select-date, #method-myparcel-normal').hide();
		$('.mypa-is-pickup-element').hide();
		$('#mypa-select-delivery-titel').html('Zo snel mogelijk bezorgen');
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
			'<div class="mypa-full-width mypa-error">'+
			'<label for="mypa-error-postcode">Postcode</label>' +
			'<input type="text" name="mypa-error-postcode" id="mypa-error-postcode" value="'+ MyParcel.data.address.postalCode +'">' +
			'</div><div class="mypa-full-width mypa-error">' +
			'<label for="mypa-error-number">Huisnummer</label>' +
			'<input type="text" name="mypa-error-number" id="mypa-error-number" value="'+ MyParcel.data.address.number +'">' +
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
        var city 			= this.data.address.city;

		if (postalCode == '' || number == ''){
			 MyParcel.showMessage(
				 '<h3>Adres gegevens zijn niet ingevuld</h3>'
			 );
		}
        if (cc === "BE") {
            var numberExtra 	= this.data.address.numberExtra;
            var street 			= this.data.address.street;
		}

		if(numberExtra){
			number = number + numberExtra;
		}

		/* Don't call API unless both Postcode and House Number are set */
		if(!number || !postalCode) {
			MyParcel.showFallBackDelivery();
			return;
		}

		/* Make the api request */
		$.get(this.data.config.apiBaseUrl + "delivery_options",
			{
				cc           			:this.data.address.cc,
				postal_code  			:postalCode,
				number       			:number,
				city					:city,
				carrier      			:this.data.config.carrier,
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
					MyParcel.hideMessage();
					MyParcel.showPickUpLocations();
					MyParcel.showDeliveryDates();
					if(MyParcel.data.deliveryOptions.data.delivery.length <= 0 ){
						MyParcel.hideDeliveryDates();
					}
					MyParcel.storeDeliveryOptions = response;
				}
				MyParcel.hideSpinner();
			})
			.fail(function(){
				MyParcel.showFallBackDelivery();
			})
			.always(function(){
				$('#mypa-select-delivery').click();
			});
	}
}
