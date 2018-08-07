var minMatchNextWord, matchOff, matchOffDiff, skipRangeForward, skipRangeBackward;
var simplifyIntrim = false;

//TODO: Reduce repeat errors by storing offsets
function restoreDefaultLeniency() {
  minMatchNextWord = 0.1;

  matchOff = 0.5;
  matchOffDiff = 0.1;

  skipRangeForward = 10;
  skipRangeBackward = 5;
}
restoreDefaultLeniency();

function processSingleWord(index, word, intrim) {
  //Check NEXT WORD for match
  f = FuzzySet();
  f.add( fullScript[index] );
  if (f.get(' '+word, minScore=minMatchNextWord).length > 0) {
    currentTranscript.push(fullScript[index]);
    errorCounter -= 1;
    checkLeniency();
    return fullScript[index];
  }

  //If expected next word wasn't found, continue to all this error correction...

  //fail() is called if (and only if) we fail to find anything. Must be called with 'return fail()' else the main function won't stop
  function fail() {
    addCorrection(index, word, 'bad', intrim);
    currentTranscript.push( word );
    return word;
  }
  //Skip everything if we're intrim and simplifyIntrim is true
  if(intrim && simplifyIntrim) return fail();

  //Make a set for fuzzy search
  f = FuzzySet();
  //Add items to the set
  for (i=index-skipRangeBackward; i<index+skipRangeForward; i++)
    if (i>=0 && i<fullScript.length)
      f.add(fullScript[i]);
  //Get values from fuzzy search
  matchArrayFull = f.get(word, minScore=matchOff);
  matches = getMatchText(matchArrayFull);

  //Check if there are actually any matches
  if (matches.length > 0) {

    //If the return didn't run, at least one match is a surrounding word
    //Setting variables, i's initial value is the earlies word index we checked for matches at
    var i = index-skipRangeBackward;
    var offsetCount = -skipRangeBackward;
    if (i < 0) {
      i=0; //Cap i so we don't look for a negative index
      offsetCount = 0;
    }
    iInitial = i;
    notFound = true; //True until a valid match is found
    altIndex = 0; //Index of the current match in all matches
    while (notFound) {
      if (offsetCount > skipRangeForward) return fail();
      //Iterate through all matches
      for (altIndex=0; altIndex<matches.length; altIndex++) {
        //Check if the match is at our current index & check if they meet a higher threshold
        thresh = matchOff + matchOffDiff*(Math.abs(offsetCount));
        if (fullScript[i] == matches[altIndex] && matchArrayFull[altIndex][0] >= thresh) {
          notFound=false;
          break;
        }
      }
      i++;
      offsetCount++;
    }

    wordOffset = offsetCount - 1;

    if (wordOffset > 0) {
      //if we skipped ahead
      if (wordOffset==1) addCorrection(index, '→', 'medium', intrim);
      else addCorrection(index, wordOffset+'→', 'medium', intrim);
      //Add spacers
      for (i=0; i<wordOffset; i++) {
        currentTranscript.push( '_' );
      }
    } else {
      //If we skipped back
      if (wordOffset == -1) addCorrection(index, '↻', 'medium', intrim);
      else addCorrection(index, '↻'+-wordOffset, 'medium', intrim);
      //Delete repeat words from transcript and word list
      for (i=0; i>wordOffset; i--) {
        currentTranscript.splice(currentTranscript.length-2, 1);
        words.splice(words.length-2, 1);
        wIndex++;
      }
    }
    currentTranscript.push(matches[altIndex]);
    return matches[0];
  }
  return fail();
}

function getMatchText(matchArray) {
  var filteredMatches = [];
  for (i=0; i<matchArray.length; i++)
    filteredMatches.push(matchArray[i][1]);
  return filteredMatches;
}

//For debug
function check(word, target) {
  a = FuzzySet();
  a.add(target);
  console.log(a.get(word));
}
