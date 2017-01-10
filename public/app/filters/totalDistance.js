/*global app*/
app.filter('totalTripDistance',function(){
    return function(input){
        var total = 0;
        for (var i = 0; i < input.legs.length; i++){
            total += parseInt(input.legs[i].distance)
        }
        
        return total;
    }
});

app.filter('totalDistance', function(){
    return function(input){
        var total = 0;
        for (var i = 0; i < input.length; i++){
            for (var j = 0; j < input[i].legs.length; j++){
                total += parseInt(input[i].legs[j].distance)
            }
        }
        return total;
    }
})