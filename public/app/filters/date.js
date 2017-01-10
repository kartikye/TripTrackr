/*global app*/
app.filter('toDate',function(){
    return function(input){
        var d = new Date(input);
        return d
    }
})