var dictationActive;
//0 - No logging
//1 - User initiated major events only
//2 - Major events only
//4 - Most events
//5 - Verbose
const LOG_LEVEL = 4;

function startDictation() {
  resetDictation();
  resumeDictation();
}

function resetDictation() {
  resetGraphs();
  grabScript();
}

function endDictation() {
  showButtonSet (0);
  $('#edit-mode-script').removeClass('hidden');
  $('#dictation-transcript-script').addClass('hidden');
}

function resumeDictation() {
  //This state should always be true except on initial run, this is here mainly for safety
  $('#edit-mode-script').addClass('hidden');
  $('#dictation-transcript-script').removeClass('hidden');

  showButtonSet (2);
  if(LOG_LEVEL >= 1) console.log('Starting dictation...')
  dictationActive = true;
  restoreDefaultLeniency();
  resetWpmValues();
  startVolumeMonitor();
  startGraphing();
  recognition.start();
}
function pauseDictation() {
  showButtonSet (1);
  if(LOG_LEVEL >= 1) console.log('Stopping dictation...')
  dictationActive = false;
  stopVolumeMonitor();
  recognition.stop();
}

function showButtonSet(set) {
  $('#start-dictation-button').addClass('hidden');
  $('#paused-dictation-buttons').addClass('hidden');
  $('#stop-dictation-button').addClass('hidden');

  switch (set) {
    case 0:
      $('#start-dictation-button').removeClass('hidden');
      break;
    case 1:
      $('#paused-dictation-buttons').removeClass('hidden');
      break;
    case 2:
      $('#stop-dictation-button').removeClass('hidden');
      break;
  }
}