// Courtesy www.0AV.com, LGPL license or as set by forked host, Travis Holliday, https://codepen.io/travisholliday/pen/gyaJk (modified by fixing for browser security change)
$(document).ready(function() {
  //startVolumeMonitor();
});

var currentVolume = 0;
var volumeMetric = 0;
var volumeHistory = [];
var backgroundClip = 0;
const VOLUME_HISTORY_LENGTH = 10;
var streamVar;

function startVolumeMonitor(){
  if (LOG_LEVEL>=3) console.log ("Starting Volume Monitor");
  navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
  if (navigator.getUserMedia) {
  navigator.getUserMedia({
   audio: true
  },
  function(stream) {
    streamVar = stream;
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    javascriptNode.onaudioprocess = function() {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var values = 0;

      var length = array.length;
      for (var i = 0; i < length; i++) {
        values += (array[i]);
      }

      var average = values / length;

      currentVolume = average;
      if (currentVolume > backgroundClip) {
        backgroundClip = currentVolume;
        volumeHistory.push(currentVolume);
        if (volumeHistory.length > VOLUME_HISTORY_LENGTH) volumeHistory = volumeHistory.slice(1, VOLUME_HISTORY_LENGTH);
        var recentAverage = 0;
        for (i=0; i<volumeHistory.length; i++) recentAverage += volumeHistory[i];
        recentAverage /= volumeHistory.length;
        volumeMetric = recentAverage;
      } else backgroundClip *= 0.8;
    } // end fn stream
  },
  function(err) {
    console.log("The following error occured: " + err.name)
  });
  } else {
    console.log("getUserMedia not supported! Try chrome...");
  }
}

function stopVolumeMonitor() {
  //Close all audio streams, should only be one but doesn't hurt to be extra.
  streamVar.getAudioTracks().forEach(track => track.stop());
}