/**
 * Code for Magento @Richard
 */
var MyParcel = new MyParcel({
    cc: 'BE',
    number: '16',
    postal_code: '2000',
});

MyParcel.myparcelOptionChanged = function (data) {
    console.log('save shipping method in Magento');
    console.log(data);
};

MyParcel.load();
