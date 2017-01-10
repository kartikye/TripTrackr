/*global app*/
app.factory('userService', ['$window', function($window) {
    var service = {
        user: function() {try{return p($window.localStorage.satellizer_token).sub}catch(err){return 1}},
        trips: [],
        wishlist: [],
        profile: {}
    };
    
    return service;
}])

var p = function (token) {
    try{
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }catch(err){
        
    }
}