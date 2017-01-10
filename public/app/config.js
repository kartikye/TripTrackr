/*global app*/

app

// Datepicker

.config(['momentPickerProvider', function (momentPickerProvider) {
    momentPickerProvider.options({
        maxView: 'month'
    });
}])

// CORS

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);