/*global app*/
app.config(['$routeProvider', '$locationProvider', '$authProvider', function($routeProvider, $locationProvider, $authProvider){
    
    $authProvider.google({
        clientId: '1017267665900-5017eflacprp5s75fqq5f37okgjf3kie.apps.googleusercontent.com',
        url: '/auth/google',
    });
    
    $routeProvider
    .when('/', {
        templateUrl: 'app/pages/landing.html',
        controller: 'landingController'
    })
    .when('/trips', {
        templateUrl: 'app/pages/trips.html',
        controller: 'tripsController'
    })
    .when('/wishlist/:user_id?', {
        templateUrl: 'app/pages/wishlist.html',
        controller: 'wishlistController'
    })
    .when('/profile', {
        templateUrl: 'app/pages/profile.html',
        controller: 'profileController'
    })
    
    $locationProvider.html5Mode(false);
}]);