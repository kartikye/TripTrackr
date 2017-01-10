/*global app*/
app.filter('distance', function(){
    return function(input){
        return Math.round(input)+" km";
    }
})