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
  
  $scope.$on("gotDevices", function(evt,data){ 
	  console.log(data);
  });
  
  $scope.$on("gotDevicesemit", function(evt,data){ 
	  console.log(data);
  });
}
