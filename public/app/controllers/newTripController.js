/*global app*/
app.controller('newTripController', ['$scope','$http','distanceCalculator','travelAPI', 'userService', '$auth',function($scope, $http, distanceCalculator, travelAPI, userService, $auth){
    
    $scope.isAuthenticated = function(){
        return $auth.isAuthenticated();
    };
    
    $scope.trip = {
        trip_name: "",
        legs: [{
            date: null,
            start: null,
            end: null,
            mode: 'plane',
            stopover: false
        }]
    };
    
    $scope.addLeg = function(index){
        $scope.trip.legs.splice(index+1, 0, {
            date: null,
            start: $scope.trip.legs[index].end,
            end: null,
            mode: 'plane',
            stopover: false
        });
    }
    
    $scope.removeLeg = function(index){
        if (is_empty($scope.trip.legs[index]) || confirm("Are you sure you would like to remove this leg?")){
            if ($scope.trip.legs.length > 1){
                $scope.trip.legs.splice(index, 1)
            } else {
                $scope.trip.legs[0] = {
                    date: null,
                    start: null,
                    end: null,
                    mode: 'plane',
                    stopover: false
                };
            }
        }
    }
    
    $scope.submit = function(){
        console.log("hello");
        var newLegs = [];
        var counter = 0;
        $scope.trip.legs.forEach(function(i, index){
            var distance = "ff";
            distanceCalculator.calculate_distance(i.start, i.end, i.mode).then(function(data){
                distance = data;
                var leg = {
                    date: new Date(i.date).toISOString().slice(0, 19).replace('T', ' '),
                    start_name: i.start.formatted_address,
                    start_id: i.start.place_id,
                    end_name: i.end.formatted_address,
                    end_id: i.end.place_id,
                    mode: i.mode,
                    stopover: i.stopover,
                    distance: distance
                };
                newLegs.push(leg);
                counter++;
                if (counter == $scope.trip.legs.length){
                    var submission = {
                        trip_name: $scope.trip.trip_name,
                        legs: newLegs
                    }
                    travelAPI.newTrip(submission, userService.user()).then(function(data){
                        if (data != "error"){
                            $scope.trip.trip_id = data;
                            console.log("pushing")
                            console.log($scope.trip)
                            userService.trips.push(submission);
                            $scope.trip = {
                                trip_name: "",
                                legs: [{
                                    date: null,
                                    start: null,
                                    end: null,
                                    mode: 'plane',
                                    stopover: false
                                }]
                            };
                        }
                    })
                }
            });
            
        });
    }
}]);

var is_empty = function(i){
    if (i.start == null && i.end == null){
        return true;
    }
    return false;
}

var remove_functions = function(obj){
    for (var item in obj){
        if (obj[item] !== null && typeof obj[item] === 'object'){
            remove_functions(obj[item]);
        }
        if (obj[item] !== null && obj[item] instanceof Array){
            for (var i = 0; i < obj[item].length; i++){
                remove_functions(obj[item][i]);
            }
        }
        if (obj[item] !== null && typeof obj[item] === 'function'){
            obj[item] = null;
        }
    }
}
