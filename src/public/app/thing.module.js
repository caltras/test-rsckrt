(function(){
	var module = angular.module('IoT.thing',[]);

	module.factory("thingService",["$http",function($http){
		var path = "api/v1/thing";
		function Things(){
			this.list = function(filter){
				return $http.get(path);
			}
			this.getOne = function(id){
				return $http.get(path+"/"+id); 
			}
			this.save = function(obj){
				return $http.post(path,obj);
			}
			this.update = function(id,obj){
				return $http.put(path+"/"+id,obj);
			}
			this.delete = function(id){
				return $http.delete(path+"/"+id);
			}
		}
		return Things;
	}]);
	
	module.controller("ThingController",["$scope","thingService",function($scope,ThingService){
		$scope.text = "Things";
		$scope.things = [];
		
		$scope.per_page = 10;
		$scope.page = 1;

		var thingService = new ThingService();

		$scope.loadTable = function(){
			thingService.list({per_page:$scope.per_page,page:$scope.page}).then(function(response){
				$scope.totalPage = response.data.metadata.total_page;
				$scope.things = response.data.data;
			});
		}

		$scope.edit = function(t){
			$scope.model = JSON.parse(JSON.stringify(t));
		}
		$scope.remove = function(t){
			thingService.delete(t._id).then(function(response){
				alert("Deleted");
				$scope.cleanModel();
				$scope.loadTable();
			}).catch(function(e){
				alert(e.message);
			});
		}
		$scope.cleanModel = function(){
			$scope.model=null;
		}
		$scope.backward = function(){
			$scope.page--;
			$scope.page = $scope.page <=0 ? 1 : $scope.page;

			$scope.loadData();
		}
		$scope.forward = function(){
			$scope.page++;
			$scope.page = $scope.page >= $scope.totalPage ? $scope.totalPage : $scope.page;

			$scope.loadTable();
		}

		$scope.loadTable();

	}]);

	module.controller("CrudThingController",["$scope","thingService",function($scope,ThingService){
		var thingService = new ThingService();
		$scope.text = "Things";
		
		$scope.save = function(){
			if($scope.model){
				var promise;
				
				if($scope.model._id){
					promise = thingService.update($scope.model._id, $scope.model);
				}else{
					promise = thingService.save($scope.model);
				}

				promise.then(function(response){
					alert("Success");
					$scope.cleanModel();
					$scope.loadTable();
				}).catch(function(e){
					alert(e.message);
				});
			}else{
				alert("Invalid values");
			}
		}

		$scope.cancel = function(){
			$scope.cleanModel();
		}
	}]);

})();