angular
  .module('demoApp')
  .controller("DemoCtrl", DemoCtrl);

function DemoCtrl($scope,$rootScope) {
	$rootScope.gotDevices = [];
  $scope.start = function() {
      $scope.cameraRequested = true;
  }

  $scope.processURLfromQR = function (url) {
    $scope.url = url;
    $scope.cameraRequested = false;
  }
  
  
  $rootScope.$watch('gotDevices',function(newval) {
	  if(newval){
		  console.log(newval);
	  } 
  });
  
  
  
  
}
