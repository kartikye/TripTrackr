/*global app*/
app.controller('tripViewController',['$scope','travelAPI', 'userService', '$auth', '$window', '$location', '$routeParams', function($scope, travelAPI, userService, $auth, $window, $location, $routeParams){
    
    $scope.isAuthenticated = function(){
        return $auth.isAuthenticated();
    };
    
    $scope.name = "";
    console.log(userService.user());
    
    if ($routeParams.user_id){
        travelAPI.getName($routeParams.user_id).then(function(data){
            $scope.name = data.split(" ")[0]
        })
    } else {
        travelAPI.getName(userService.user()).then(function(data){
            $scope.name = data.split(" ")[0];
        })
    }
    
    $scope.logout = function(){
        $auth.logout();
        $location.path('');
    }
    
    $scope.trips = [];
    travelAPI.getTrips(userService.user()).then(function(data){
        userService.trips = data;
        console.log(data)
        $scope.trips = userService.trips;
    });
    
    $scope.$watch(function() {
        return userService.trips;
    }, function(newValue, oldValue) {
        $scope.trips = newValue;
    });
    
    $scope.deleteTrip = function(trip_id){
        if (confirm("Are you sure you would like to delete this trip?")){
            travelAPI.deleteTrip(trip_id).then(function(data){
                if (data != "error") {
                    for (var i = 0; i < $scope.trips.length; i++) {
                        var obj = $scope.trips[i];

                        if (obj.trip_id == trip_id) {
                            $scope.trips.splice(i, 1);
                            i--;
                        }
                    }
                }
            });
        }
    }
}]);