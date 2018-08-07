const ERROR_MULT = 1.1;
const THRESH_COUNT = 10;

var errorCounter = 0;
var leniencyIncreaseTimes = 2;


function checkLeniency() {
  if (errorCounter > THRESH_COUNT) {
    console.log('increasing leniency...');
    skipRangeForward = Math.ceil(skipRangeForward *ERROR_MULT);
    skipRangeBackward= Math.ceil(skipRangeBackward*ERROR_MULT);
    matchOff /= ERROR_MULT;
    matchOffDiff /= ERROR_MULT;
    minMatchNextWord /= ERROR_MULT;
    errorCounter = 0;
    leniencyIncreaseTimes++;
  }
  if (errorCounter < -THRESH_COUNT) {
    if (leniencyIncreaseTimes > 0) {
      console.log('decreasing leniency...');
      skipRangeForward = Math.ceil(skipRangeForward /ERROR_MULT);
      skipRangeBackward= Math.ceil(skipRangeBackward/ERROR_MULT);
      matchOff *= ERROR_MULT;
      matchOffDiff *= ERROR_MULT;
      minMatchNextWord *= ERROR_MULT;
      leniencyIncreaseTimes--;
      errorCounter = 0;
    } else if (leniencyIncreaseTimes == 0) {
      console.log('resetting leniency...');
      restoreDefaultLeniency();
      leniencyIncreaseTimes = -1;
    }
  }
}
