angular
  .module('demoApp')
  .controller("DemoCtrl", DemoCtrl);

function DemoCtrl($scope,$rootScope) {
	
  $scope.start = function() {
      $scope.cameraRequested = true;
  }

  $scope.processURLfromQR = function (url) {
    $scope.url = url;
    $scope.cameraRequested = false;
  }
  
  
  
  $scope.$on('event:gotDevices', function(newVal) {
	  console.log("newVal");
	  console.log(newVal);
  });
  
  
  
  
  
}
