/*global app, $*/
app.factory('travelAPI',function($http, $q){
    var service = {};

    service.getName = function(user_id){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: "/api/name",
            params: {user_id: user_id}
        }).success(function(data) {
            deferred.resolve(data)
        })
        return deferred.promise
    }
    
    service.getShare = function(user_id){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: "/api/share",
            params: {user_id: user_id}
        }).success(function(data) {
            deferred.resolve(data)
        })
        return deferred.promise
    }
    
    service.getTrips = function(user_id){
        var deferred = $q.defer()
        $http({
            method: 'GET',
            url: "/api/trips/all",
            params: {userid: user_id}
        }).success(function(data){
            deferred.resolve(data)
        }).error(function(){
            deferred.reject("Error")
        })
        
        return deferred.promise
    }
    
    service.newTrip = function(trip, user_id){
        var deferred = $q.defer()
        $http({
            method: 'POST',
            url: "/api/trips/new",
            data: ({
                data: trip,
                user_id: user_id
            })
        }).success(function(data){
            deferred.resolve(data.tripId)
        }).error(function(){
            deferred.reject("error")
        })
        
        return deferred.promise
    }
    
    service.deleteTrip = function(trip_id){
        var deferred = $q.defer()
        $http({
            method: 'GET',
            url: "/api/trips/delete",
            params: {trip_id: trip_id}
        }).success(function(data) {
            deferred.resolve(data)
        }).error(function(){
            deferred.reject("error")
        })
        
        return deferred.promise
    }
    
    service.newWishlistItem = function(wishlist_item, user_id){
        var deferred = $q.defer()
        $http({
            method: 'POST',
            url: '/api/wishlist/new',
            data: ({
                data: wishlist_item,
                user_id: user_id
            })
        }).success(function(data) {
            deferred.resolve(data)
        })
        
        return deferred.promise
    }
    
    service.getWishlist = function(user_id){
        var deferred = $q.defer()
        $http({
            method: 'GET',
            url: '/api/wishlist/all',
            params: {user_id: user_id}
        }).success(function(data) {
            deferred.resolve(data)
        })
        
        return deferred.promise
    }
    
    service.check_wish = function(wishlist_id, date){
        var deferred = $q.defer()
        $http({
            method: 'POST',
            url: '/api/wishlist/check',
            data: ({
                wishlist_id: wishlist_id,
                date: date
            })
        }).success(function(data) {
            deferred.resolve(data)
        })
        
        return deferred.promise
    }
    
    service.delete_wish_item = function(wishlist_id){
        var deferred = $q.defer()
        $http({
            method: 'GET',
            url: '/api/wishlist/delete',
            params: {wishlist_id: wishlist_id}
        }).success(function(data) {
            deferred.resolve(data)
        })
        
        return deferred.promise
    }
    
    return service
})