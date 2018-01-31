/**
 * Code for Checkout @Dennis
 */
MyParcel = (function(pluginData) {
    var test1, test2, load;

    this.pluginData = pluginData;

    DISABLED = 'disabled';

    DAYS_OF_THE_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    DAYS_OF_THE_WEEK_TRANSLATED = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

    this.load = function () {
        this.sampleAction()
    };

    this.sampleAction = function () {
        console.log(pluginData);
        alert('jahooeeee');
        if (typeof MyParcel.myparcelOptionChanged !== "undefined") {
            MyParcel.myparcelOptionChanged({'value': 123});
        }
    };

    return this;
});