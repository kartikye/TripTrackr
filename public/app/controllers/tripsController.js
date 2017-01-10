/*global app*/
app.controller('tripsController', ['$scope', '$window', '$rootScope', '$auth', '$location', function($scope, $window, $rootScope, $auth, $location){
    
    $scope.isfAuthenticated = function(){
        if (!$auth.isAuthenticated()) {
            $location.path((""))
        } else {
            return true
        }
    };

    $scope.googleLogin = function(){
        $auth.authenticate('google').then(function(response){
            console.log("authenticated")
            $location.path("trips");
        }).catch(function(response){
            console.log(response);
        })
    };
    
    $scope.logout = function() {
        $auth.logout();
        delete $window.localStorage.currentUser;
    }
}]);