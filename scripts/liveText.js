//AS
const THRESH = {
  medTop: 85,
  goodTop: 66,
  goodBottom: 33,
  medBottom: 15
}

function updateTicker(tickerName, percent, num) {
  $('#'+tickerName+'-ticker-number').html(Math.round(num));
  //Display BG
  function sc(className) {
    $('#'+tickerName+'-ticker-bg').prop('class','shaded-display');
    $('#'+tickerName+'-ticker-bg').addClass(className);
  }
  if (percent > THRESH.medTop) sc('bad');
  else if (percent > THRESH.goodTop) sc('med');
  else if (percent > THRESH.goodBottom) sc('good');
  else if (percent > THRESH.medBottom) sc('med');
  else sc('bad');
}