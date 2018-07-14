/**
 * Webcam Directive
 *
 * (c) Jonas Hartmann http://jonashartmann.github.io/webcam-directive
 * License: MIT
 *
 * @version: 3.1.0
 */
'use strict';

(function() {
  // GetUserMedia is not yet supported by all browsers
  // Until then, we need to handle the vendor prefixes
  navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

  // Checks if getUserMedia is available on the client browser
  window.hasUserMedia = function hasUserMedia() {
    return navigator.getMedia ? true : false;
  };

  window.hasModernUserMedia = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
})();

angular.module('webcam', [])
  .directive('webcam', function () {
    return {
      template: '<div class="webcam" ng-transclude></div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope:
      {
        onError: '&',
        onStream: '&',
        onStreaming: '&',
        placeholder: '=',
        config: '=channel'
      },
      link: function postLink($scope, element) {
        var videoElem = null,
            videoStream = null,
            placeholder = null;

        $scope.config = $scope.config || {};

        var _removeDOMElement = function _removeDOMElement(DOMel) {
          if (DOMel) {
            angular.element(DOMel).remove();
          }
        };

        var onDestroy = function onDestroy() {
          if (!!videoStream ) {
            var checker = typeof videoStream.getVideoTracks === 'function';
            if(videoStream.getVideoTracks && checker) {
              // get video track to call stop in it
              // videoStream.stop() is deprecated and may be removed in the
              // near future
              // ENSURE THIS IS CHECKED FIRST BEFORE THE FALLBACK
              // videoStream.stop()
              var tracks = videoStream.getVideoTracks();
              if (tracks && tracks[0] && tracks[0].stop) {
                tracks[0].stop();
              }
            } else if (videoStream.stop) {
              // deprecated, may be removed in the near future
              videoStream.stop();
            }
          }
          if (!!videoElem) {
            delete videoElem.src;
          }
        };

        // called when camera stream is loaded
        var onSuccess = function onSuccess(stream) {
          videoStream = stream;

          if (window.hasModernUserMedia) {
            videoElem.srcObject = stream;
            // Firefox supports a src object
          } else if (navigator.mozGetUserMedia) {
            videoElem.mozSrcObject = stream;
          } else {
            var vendorURL = window.URL || window.webkitURL;
            videoElem.src = vendorURL.createObjectURL(stream);
          }

          /* Start playing the video to show the stream from the webcam */
          videoElem.play();
          $scope.config.video = videoElem;

          /* Call custom callback */
          if ($scope.onStream) {
            $scope.onStream({stream: stream});
          }
        };

        // called when any error happens
        var onFailure = function onFailure(err) {
          _removeDOMElement(placeholder);
          if (console && console.log) {
            console.log('The following error occured: ', err);
          }

          /* Call custom callback */
          if ($scope.onError) {
            $scope.onError({err:err});
          }

          return;
        };
        
        var gotDevices = function gotDevices(deviceInfos) {
        	  for (var i = 0; i !== deviceInfos.length; ++i) {
        	    var deviceInfo = deviceInfos[i];
        	    var option = document.createElement('option');
        	    option.value = deviceInfo.deviceId;
        	    console.log("hii");
        	    console.log(deviceInfo.deviceId);
        	    console.log(deviceInfo);
        	    if (deviceInfo.kind === 'videoinput') {
        	      option.text = deviceInfo.label || 'camera ';
        	      
        	    } else {
        	      console.log('Found one other kind of source/device: ', deviceInfo);
        	    }
        	  }
        	}
        
        var getStream = function getStream() {
        	  if (window.stream) {
        	    window.stream.getTracks().forEach(function(track) {
        	      track.stop();
        	    });
        	  }

        	  var constraints = {
        	    video: {
        	      deviceId: {exact: '5bd499427109fe1af6d9cc327f6492fb645865f74d90076f2c9727b285d3c0e6'}
        	    }
        	  };

        	  navigator.mediaDevices.getUserMedia(constraints)
              .then(onSuccess) 
              .catch(onFailure);
        	  console.log("dfgdfg streem one");
        	}
        var handleError = function handleError(error) {
        	  console.log('Error: ', error);
        	}

        var startWebcam = function startWebcam() {
          videoElem = document.createElement('video');
          videoElem.setAttribute('class', 'webcam-live');
          videoElem.setAttribute('autoplay', '');
          element.append(videoElem);

          if ($scope.placeholder) {
            placeholder = document.createElement('img');
            placeholder.setAttribute('class', 'webcam-loader');
            placeholder.src = $scope.placeholder;
            element.append(placeholder);
          }

          // Default variables
          var isStreaming = false,
            width = element.width = $scope.config.videoWidth || 320,
            height = element.height = 0;

          // Check the availability of getUserMedia across supported browsers
          if (!window.hasUserMedia() && !window.hasModernUserMedia) {
            onFailure({ code: -1, msg: 'Browser does not support getUserMedia.' });
            return;
          }

          var mediaConstraint = { video: true, audio: false };

          if (window.hasModernUserMedia) {
        	  navigator.mediaDevices.enumerateDevices()
        	  .then(gotDevices).then(getStream).catch(handleError);
        	  
            
          } else {
            navigator.getMedia(mediaConstraint, onSuccess, onFailure);
          }

          /* Start streaming the webcam data when the video element can play
           * It will do it only once
           */
          videoElem.addEventListener('canplay', function() {
            if (!isStreaming) {
              var scale = width / videoElem.videoWidth;
              height = (videoElem.videoHeight * scale) ||
                        $scope.config.videoHeight;
              videoElem.setAttribute('width', width);
              videoElem.setAttribute('height', height);
              isStreaming = true;

              $scope.config.video = videoElem;

              _removeDOMElement(placeholder);

              /* Call custom callback */
              if ($scope.onStreaming) {
                $scope.onStreaming();
              }
            }
          }, false);
        };

        var stopWebcam = function stopWebcam() {
          onDestroy();
          videoElem.remove();
        };

        $scope.$on('$destroy', onDestroy);
        $scope.$on('START_WEBCAM', startWebcam);
        $scope.$on('STOP_WEBCAM', stopWebcam);

        startWebcam();

      }
    };
  });
