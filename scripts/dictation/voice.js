var fullTranscript = [];

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
// recognition.continuous = true;

recognition.addEventListener('result', e => {
  processSpeech(results=e.results[0][0], e.results[0].isFinal);
});

recognition.addEventListener('end', e => {
  if (LOG_LEVEL >= 2) console.log('restarting SpeechRecognition');
  if (dictationActive) recognition.start();
});

var wordIndexOffset = 0; //Currently unused

function processSpeech(results, isFinal) {
  words = results.transcript.split(' ');
  currentTranscript = [];
  clearCurrentCorrections();
  if (isFinal) {
    if(LOG_LEVEL >= 4) console.log('Finalized: '+words);
    //If its final
    recognition.stop();
    countWordsFinal(words.length-wordIndexOffset);
    for (wIndex=wordIndexOffset; wIndex<words.length; wIndex++) {
      currentWord = words[wIndex];
      processSingleWord(fullTranscript.length+currentTranscript.length, currentWord, intrim=false);
    }
    fullTranscript = fullTranscript.concat(currentTranscript);
    currentTranscript = [];
  } else {
    //If its intrim
    if(LOG_LEVEL >= 5) console.log('Intrim: '+words);
    countWordsIntrim(words.length-wordIndexOffset);
    for (wIndex=wordIndexOffset; wIndex<words.length; wIndex++) {
      currentWord = words[wIndex];
      processSingleWord(fullTranscript.length+currentTranscript.length, currentWord, intrim=true);
    }
  }
  setSelection(fullTranscript.length+currentTranscript.length);
}
