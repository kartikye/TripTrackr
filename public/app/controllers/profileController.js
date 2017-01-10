/*global app*/
app.controller('profileController', ['$scope', '$auth', '$location', 'userService', 'travelAPI', '$routeParams', '$window', function($scope, $auth, $location, userService, travelAPI, $routeParams, $window) {
    
    $scope.isAuthenticated = function(){
        return $auth.isAuthenticated()
    }

    $scope.user_id = userService.user()
    $scope.test = {te: 223}
    $scope.profile = {a:1}
    
    var generateProfile = function(data){

        var profile = {}
        var getCities = function(data){
            var cities = []
            var count = []

            for(var t = 0; t < data.length; t++){
                for(var l = 0; l < data[t].legs.length; l++){
                    if (data[t].legs[l].stopover == 0){
                        cities.push({
                            name: data[t].legs[l].end_name,
                            id: data[t].legs[l].end_id
                        })
                    }else{
                    }
                }
            }
            
            var seen = []
            var count = []
            var result = []
            
            for (var c = 0; c < cities.length; c++){
                if (seen.indexOf(JSON.stringify(cities[c])) == -1){
                    seen.push(JSON.stringify(cities[c]))
                    count.push(1)
                    result.push(cities[c])
                } else {
                    count[seen.indexOf(JSON.stringify(cities[c]))] += 1
                } 
            }

            return [result, count]
            
        }
        
        var citiesData = getCities(data)
        console.log(citiesData)
        
        profile.stats = {
            trip_count: data.length,
            cities_visited: citiesData[0],
            cities_count: citiesData[1],
            contries_visited: [],
            distance_travelled: 0,
            distance_travelled_after_18: 0
        }
        
        return profile
    }
    
    if(userService.trips.length == 0){
        travelAPI.getTrips(userService.user()).then(function(data){
            userService.trips = data;
            userService.profile = generateProfile(data)
        });
    }else{
        userService.profile = generateProfile(userService.trips)
    }
    
    $scope.$watch(function() {
        return userService.profile;
    }, function(newValue, oldValue) {
        console.log(userService.profile)
        $scope.profile = newValue;
    }, true);
    
    
    $scope.arrMaxIndex = function(arr){
        if (arr){
            return arr.indexOf(Math.max(...arr))
        }
        return -1
    }
}])