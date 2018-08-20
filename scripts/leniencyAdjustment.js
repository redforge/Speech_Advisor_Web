const ERROR_MULT = 1.5;
const THRESH_COUNT = 4;
const LOG_LEVEL = 0;
var errorCounter = 0;
var leniencyIncreaseTimes = 5;


function checkLeniency() {
  if (errorCounter <= THRESH_COUNT) {
    if (LOG_LEVEL >= 2) console.log('increasing leniency...');
    skipRangeForward = Math.ceil(skipRangeForward *ERROR_MULT);
    skipRangeBackward= Math.ceil(skipRangeBackward*ERROR_MULT);
    // matchOff /= ERROR_MULT;
    // matchOffDiff /= ERROR_MULT;
    // minMatchNextWord /= ERROR_MULT;
    errorCounter = 0;
    leniencyIncreaseTimes++;
  }
  if (errorCounter >= -THRESH_COUNT) {
    if (leniencyIncreaseTimes > 0) {
      if (LOG_LEVEL >= 2) console.log('decreasing leniency...');
      skipRangeForward = Math.ceil(skipRangeForward /ERROR_MULT);
      skipRangeBackward= Math.ceil(skipRangeBackward/ERROR_MULT);
      // matchOff *= ERROR_MULT;
      // matchOffDiff *= ERROR_MULT;
      // minMatchNextWord *= ERROR_MULT;
      leniencyIncreaseTimes--;
      errorCounter = 0;
    } else if (leniencyIncreaseTimes == 0) {
      if (LOG_LEVEL >= 2) console.log('resetting leniency...');
      restoreDefaultLeniency();
      leniencyIncreaseTimes = -1;
    }
  }
}
