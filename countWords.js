//WPM metric
var wordTimes = [];
var numIntrimWords = 0;
var wpm = 0;
var prevWordTime;
const RECORD_LENGTH = 20;
const WPM_THS = {
  medTop: 260,
  goodTop: 200,
  goodBottom: 100,
  medBottom: 40
}

function countWordsIntrim(numWords) {
  if (numWords > numIntrimWords) {
    countWords(numWords - numIntrimWords);
    numIntrimWords = numWords;
  }
}
function countWordsFinal (numWords) {
  if (numWords > numIntrimWords) countWords(numWords - numIntrimWords);
  else if (numWords < numIntrimWords) numIntrimWords = numIntrimWords - numWords;
  else numIntrimWords = 0;
}

function countWords(numWords) {
  var curTime = new Date();
  if (prevWordTime != null) {
    var timeDiff = curTime - prevWordTime;
    for (i=0; i<numWords; i++) wordTimes.push(timeDiff/numWords);
    if(wordTimes.length > RECORD_LENGTH) wordTimes = wordTimes.slice(1, RECORD_LENGTH);
    calcWps();
  }
  prevWordTime = curTime;
}

function calcWps() {
  var avgTime = 0;
  for (i=0; i<wordTimes.length; i++) {
   avgTime += wordTimes[i];
  }
  avgTime /= wordTimes.length;

  wpm = 60/(avgTime/1000);
  $('#wpm-display').html(Math.round(wpm));

  //Display BG
  function sc(className) {
    $('#wpm-bg').prop('class','shaded-display');
    $('#wpm-bg').addClass(className);
  }
  if (wpm > WPM_THS.medTop) sc('bad');
  else if (wpm > WPM_THS.goodTop) sc('med');
  else if (wpm > WPM_THS.goodBottom) sc('good');
  else if (wpm > WPM_THS.medBottom) sc('med');
  renderStep();
}
