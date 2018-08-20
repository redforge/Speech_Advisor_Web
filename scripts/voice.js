var fullTranscript = [];

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
// recognition.continuous = true;

recognition.addEventListener('result', e => {
  processSpeech(results=e.results[0][0], e.results[0].isFinal);
});

recognition.addEventListener('end', e => {
  if (LOG_LEVEL >= 1) console.log('restarting');
  recognition.start();
});

var wordIndexOffset = 0; //Currently unused

recognition.start();
function processSpeech(results, isFinal) {
  words = results.transcript.split(' ');
  currentTranscript = [];
  clearCurrentCorrections();
  if (isFinal) {
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
    countWordsIntrim(words.length-wordIndexOffset);
    for (wIndex=wordIndexOffset; wIndex<words.length; wIndex++) {
      currentWord = words[wIndex];
      processSingleWord(fullTranscript.length+currentTranscript.length, currentWord, intrim=true);
    }
  }
  setSelection(fullTranscript.length+currentTranscript.length);
}
