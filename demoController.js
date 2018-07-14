angular
  .module('demoApp')
  .controller("DemoCtrl", DemoCtrl);

function DemoCtrl($scope,$rootScope) {
	$scope.camdevises = [];
	scope.deviseid = false;
  $scope.start = function() {
      $scope.cameraRequested = true;
  }

  $scope.processURLfromQR = function (url) {
    $scope.url = url;
    $scope.cameraRequested = false;
  }
  
  $scope.changeCam = function(data){
	  $scope.deviseid = data;
  } 
  
  
  
  $scope.$on('event:gotDevices', function(events, args) {
	  console.log("newVal");
	  console.log(args);
	  if(args.length > 0){
		  $scope.camdevises = [];
		  args.forEach(function(ds){
			  $scope.camdevises.push(ds);
		  })
	  }
  });
  
  
  
  
  
}
