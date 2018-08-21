var dictationActive;
//0 - No logging
//1 - User initiated major events only
//2 - Major events only
//4 - Most events
//5 - Verbose
const LOG_LEVEL = 2;

function startDictation() {
  if(LOG_LEVEL >= 1) console.log('Starting dictation...')
  $('#start-dication-button').addClass('hidden');
  $('#stop-dication-button').removeClass('hidden');
  dictationActive = true;
  restoreDefaultLeniency();
  resetWpmValues();
  startVolumeMonitor();
  startGraphing();
  recognition.start();
}
function stopDictation() {
  if(LOG_LEVEL >= 1) console.log('Stopping dictation...')
  $('#start-dication-button').removeClass('hidden');
  $('#stop-dication-button').addClass('hidden');
  dictationActive = false;
  stopVolumeMonitor();
  recognition.stop();
}