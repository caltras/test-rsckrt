(function(){
	var module = angular.module('IoT.data',['IoT.thing']);

	module.factory("dataService",["$http",function($http){
		var path = "api/v1/data";	
		function Data(){
			this.list = function(gateway,start,end,filter){
				return $http.get(path+"/"+gateway+"/"+start+"/"+end+"?per_page="+filter.per_page+"&page="+filter.page);
			}
			this.getOne = function(id){
				return $http.get(path+"/"+id); 
			}
		}
		return Data;
	}]);

	module.controller("DataController",["$scope","thingService","dataService",function($scope,ThingService,DataService){
		$scope.text = "Data";
		$scope.things = [];
		$scope.data = [];
		$scope.thingSelected = null;
		$scope.per_page = 10;
		$scope.page = 1;

		var thingService = new ThingService();
		var dataService = new DataService();

		$scope.loadTable = function(){
			thingService.list().then(function(response){
				$scope.things = response.data.data;
				$scope.thingSelected = $scope.things[0];
			});
		}

		$scope.changeThing = function(){
			$scope.page = 1;
			$scope.loadData();
		}
		$scope.loadData = function(){
			var start = new Date((new Date()).setDate(new Date().getDate()-1)).toISOString();
			var end = new Date().toISOString();
			var filter = {
				per_page: $scope.per_page,
				page : $scope.page
			};
			dataService.list(
				$scope.thingSelected, 
				start, 
				end,
				filter
			)
			.then(function(response){
				$scope.totalPage = response.data.metadata.total_page;
				$scope.data = response.data.data;
			}).catch(function(e){
				alert(e.message);
			});
		}
		$scope.backward = function(){
			$scope.page--;
			$scope.page = $scope.page <=0 ? 1 : $scope.page;

			$scope.loadData();
		}
		$scope.forward = function(){
			$scope.page++;
			$scope.page = $scope.page >= $scope.totalPage ? $scope.totalPage : $scope.page;

			$scope.loadData();
		}

		$scope.loadTable();
	}]);

})();