Sandbox = {
    formOptions: {
        'address': {},
        'txtWeekDays': [
            'Zondag',
            'Maandag',
            'Dinsdag',
            'Woensdag',
            'Donderdag',
            'Vrijdag',
            'Zaterdag'
        ],
        'translateENtoNL': {
            'monday': 'maandag',
            'tuesday': 'dinsdag',
            'wednesday': 'woensdag',
            'thursday': 'donderdag',
            'friday': 'vrijdag',
            'saturday': 'zaterdag',
            'sunday': 'zondag'
        },
        'config': {
            'carrier': 2,
            'apiBaseUrl': 'https://api.sendmyparcel.be/',
            'addressNotFound': 'Adresgegevens niet ingevuld',
            'pickUpFrom': 'Afhalen vanaf',
            'openingHours': 'Openingstijden',
            'closed': 'Gesloten',
            'postcode': 'Postcode',
            'houseNumber': 'Huisnummer',
            'city': 'Plaats',
            'retry': 'Opnieuw',
            'wrongPostalCodeCity': 'Combinatie postcode/plaats onbekend'
        }
    },

    showFullCode: false,

    init: function() {
        inputTimeout = null;

        $('#js-show_full_code').click(function () {
            Sandbox.showFullCode = true;
            Sandbox.showResultCode();
        });

        Sandbox.renderOptions();

        $("input[name^='config[price']").on('blur', function() {
          $(this).val(Sandbox.replaceCommas($(this).val()));
        });

        $("input[name^='config'], input[name^='address'],select[name^='address']").on('change', function() {
            clearTimeout(inputTimeout);
            inputTimeout = setTimeout(function(){
                Sandbox.renderOptions()
            }, 500);
        });
    },

    renderOptions: function () {
        Sandbox.setOptions();
        Sandbox.showResultCode();
        Sandbox.showResultCheckout();
    },

    setOptions: function () {
        $("input[name^='config'], input[name^='address'], select[name^='address']").each(function () {
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

    showResultCode: function () {
        visibleOptions = Sandbox.formOptions;
        delete visibleOptions.deliveryOptions;
        code = '<script>' +
            '\n' +
            'var data = ' +
            JSON.stringify(visibleOptions, null, '  ') +
            ';\n' +
            'MyParcel.init(data);' +
            '\n' +
            '</script>';

        $('#result_code').html(Sandbox.htmlEncode(code));
    },

    showResultCheckout: function () {
        MyParcel.init(Sandbox.formOptions);
        Prism.highlightAll();
    },

    htmlEncode: function(value){
        // create a in-memory div, set it's inner text(which jQuery automatically encodes)
        // then grab the encoded contents back out. The div never exists on the page.
        return $('<div/>').text(value).html();
    },

    replaceCommas: function(input) {
        return input.replace(/,/, '.');
    }
};
