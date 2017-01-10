/*global app,$*/
app.factory('distanceCalculator', function($http, $q){
    var service = {};

    service.calculate_distance = function(start, end, mode){
        console.log(mode);
        var deferred = $q.defer();
        if (mode=="plane"){
            var radius = 6371.01;

            var x1 = start.geometry.location.lat();
            var y1 = start.geometry.location.lng();
            var x2 = end.geometry.location.lat();
            var y2 = end.geometry.location.lng();
            
            var p = 0.017453292519943295;    // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((x2 - x1) * p)/2 + 
                      c(x1 * p) * c(x2 * p) * 
                      (1 - c((y2 - y1) * p))/2;
            
            var d = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
            deferred.resolve(d);
        } else if (mode == "road"){
            $http({
                method: 'GET',
                url: "/api/distance",
                params:{
                    start_id: start.place_id,
                    end_id: end.place_id
                }
            }).success(function(data) {
                console.log(data);
                deferred.resolve(data.rows[0].elements[0].distance.value/1000);
            }).error(function(data) {
                deferred.reject(data);
            });
        }
        
        return deferred.promise;
    }
    
    return service;
});

function deg2rad(deg) {
  return deg * (Math.PI/180)
}