/**
 * Code for Magento @Richard
 */
var MyParcel = new MyParcel({
    cc: 'NL',
    number: '55',
    postal_code: '2231je',
});

MyParcel.myparcelOptionChanged = function (data) {
    console.log('save shipping method in Magento');
    console.log(data);
};

MyParcel.load();
