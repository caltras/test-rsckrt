(function(){

	var module = angular.module('IoT', ["ngRoute","IoT.thing","IoT.data"]);
	
	module.controller("MainController",["$scope",function($scope,$route){
		$scope.text = "Welcome!";
		$scope.user = GLOBAL.user;

	}]);
	module.config(['$routeProvider', function ($routeProvider) {
	    $routeProvider
	        .when('/', {
	            templateUrl: 'views/welcome.html'
	        })
	        .when("/dashboard",{
	        	templateUrl:"views/dashboard.html"
	        })
	        .when("/thing",{
	        	templateUrl: 'views/thing.html'
	        });
	}]);

    angular.element(function() {
      angular.bootstrap(document, ['IoT']);
    });

})();