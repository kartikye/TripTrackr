/*global app*/
app.controller('wishlistController', ['$scope', '$auth', '$location', 'userService', 'travelAPI', '$routeParams', '$window', function($scope, $auth, $location, userService, travelAPI, $routeParams, $window) {
    
    $scope.isAuthenticated = function(){
        if (!$auth.isAuthenticated() && !$routeParams.user_id) {
            console.log("not auth")
            $location.path((""))
        } else {
            return true
        }
    }
    
    $scope.editmode = false
    $scope.share = false
    
    $scope.toggleEdit = function(){
        $scope.editmode = !$scope.editmode
    }

    if($routeParams.user_id){
        travelAPI.getShare($routeParams.user_id).then(function(data){
            console.log(data)
            if (data.share) {
                $scope.share = true
            } else {
                $location.path((""))
            }
        })
        travelAPI.getName($routeParams.user_id).then(function(data){
            $scope.name = data
        })
        $scope.user_id = parseInt($routeParams.user_id)    
    } else {
        $scope.user_id = userService.user()
    }
    
    $scope.new_wishlist_item = {
        wishlist_name:"",
        location: {},
        completed: false,
        date: null
    }
    
    $scope.wishlist = []
    travelAPI.getWishlist($scope.user_id).then(function(data){
        userService.wishlist = data
        $scope.wishlist = userService.wishlist
    })
    
    $scope.$watch(function() {
        return userService.wishlist;
    }, function(newValue, oldValue) {
        $scope.wishlist = newValue;
    });
    
    $scope.wish_submit = function(){
        
        if ($scope.new_wishlist_item.completed){
            $scope.new_wishlist_item.completed = 1
        } else {
            $scope.new_wishlist_item.completed = 0
        }
        
        var submission = {
            wishlist_name: $scope.new_wishlist_item.wishlist_name,
            location_name: $scope.new_wishlist_item.location.formatted_address,
            location_id: $scope.new_wishlist_item.location.place_id,
            completed: $scope.new_wishlist_item.completed,
            date: new Date($scope.new_wishlist_item.date).toISOString().slice(0, 19).replace('T', ' ')
        }
        
        travelAPI.newWishlistItem(submission, $scope.user_id).then( function(data){
            submission.wishlist_id = data
            userService.wishlist.push(submission)
        })
        
        $scope.new_wishlist_item = {
            wishlist_name:"",
            location: {},
            completed: false,
            date: null
        }
    }
    
    $scope.delete_item = function(wishlist_id){
        if (confirm("Are you sure you would like to delete this item?")){
            travelAPI.delete_wish_item(wishlist_id)
        }
    }
    
    $scope.check_item = function(wishlist_id){
        
        var date = null
        
        for (var i = 0; i < userService.wishlist.length; i++) {
            if (userService.wishlist[i].wishlist_id == wishlist_id){
                userService.wishlist[i].completed = true
                userService.wishlist[i].checking = false
                date = userService.wishlist[i].date
            }
        }
        
        travelAPI.check_wish(wishlist_id, date)
    }
    
    $scope.num_done = function(){
        return $window.document.getElementsByClassName('done').length;
    }
    
}])