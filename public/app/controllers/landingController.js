/*global app*/
app.controller('landingController', ['$scope', '$window', '$rootScope', '$auth', '$location', 'userService', function($scope, $window, $rootScope, $auth, $location, userService){
    
    $scope.isAuthenticated = function(){
        if ($auth.isAuthenticated()){
            $location.path("trips")   
        } else {
            console.log("not auth")
            return false;
        }
    };
    
    $scope.isAuthenticated()
    
    $scope.googleLogin = function(){
        $auth.authenticate('google').then(function(response){
            $location.path('trips');
        }).catch(function(response){
            console.log(response);
        })
    };
    
    $scope.logout = function() {
        $auth.logout();
        delete $window.localStorage.currentUser;
    }
}]);