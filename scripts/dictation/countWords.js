//WPM metric
var wordTimes, numIntrimWords, wpm, prevWordTime;
const RECORD_LENGTH = 20;

function resetWpmValues() {
  wordTimes = [];
  numIntrimWords = 0;
  wpm = 0;
  prevWordTime;
}

function countWordsIntrim(numWords) {
  //if (numWords+2 > numIntrimWords) numIntrimWords = numWords+2;
  if (numWords > numIntrimWords) {
    countWords(1);
    numIntrimWords++;
  }
  /*if (numWords > numIntrimWords) {
    countWords(numWords - numIntrimWords);
    numIntrimWords = numWords;
  }*/
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
    for (i=0; i<numWords; i++) {
      wordTimes.push(timeDiff/numWords);
      if (wordTimes.length > RECORD_LENGTH) wordTimes = wordTimes.slice(1, wordTimes.length);
    }
    if (LOG_LEVEL >= 5) console.log(wordTimes);
    calcWpm();
  }
  prevWordTime = curTime;
}

function calcWpm() {
  var avgTime = 0;
  var totalDivisor = 0;
  for (i=Math.ceil(wordTimes.length/4); i<wordTimes.length; i++) {
   avgTime += wordTimes[i];
   totalDivisor++;
  }
  for (i=0; i<wordTimes.length; i++) {
   avgTime += wordTimes[i];
   totalDivisor++;
  }
  avgTime /= totalDivisor;

  wpm = 60/(avgTime/1000);

  updateTicker('wpm', wpm/3, wpm);
}
