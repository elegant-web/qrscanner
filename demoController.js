angular
  .module('demoApp')
  .controller("DemoCtrl", DemoCtrl);

function DemoCtrl($scope) {
	$scope.devises = [];
  $scope.start = function() {
      $scope.cameraRequested = true;
  }

  $scope.processURLfromQR = function (url) {
    $scope.url = url;
    $scope.cameraRequested = false;
  }
  
  
  
  $scope.$on('event:gotDevices', function(events, args) {
	  console.log("newVal");
	  console.log(args);
	  console.log(args.length);
	  
	  if(args.length > 0){
		  args.forEach(function(ds){
			  $scope.devises.push(ds);
		  })
	  }
	  console.log("$scope.devises");
	  console.log($scope.devises);
	  /*
	  if(args && args.length > 0){
		  args.forEach(ds){
			  $scope.devises.push(ds);
		  }
	  }
	  console.log("$scope.devises");
	  console.log($scope.devises);*/
  });
  
  
  
  
  
}
