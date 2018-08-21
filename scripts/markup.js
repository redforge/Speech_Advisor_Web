var fullScript = [];
const CORECTION_OFFSET = {x:0, y:20};
const SPC = ' ';

var currentCorrections = [];
var finalCorrections = [];

$(document).ready( function() {
  s = $('#script-full').html();
  s = s.replace(/\r\n/g, SPC);
  fullScript = s.split(' ');
  if(LOG_LEVEL >= 4) console.log(fullScript);
  setSelection(1);
});

function setSelection(index) {
  const fsl = fullScript.length;
  $('#transcript-script-spoken')   .html(fullScript.slice(0, index)   .join(SPC)+SPC);
  $('#transcript-script-unspoken') .html(fullScript.slice(index, fsl) .join(SPC));
}

function addCorrection (index, string, className, intrim) {
  if (!(intrim && simplifyIntrim)) errorCounter+= 2;
  checkLeniency();
  elem = $('<div class=correction>'+string+'</div>');
  offset = getOffsetByIndex(index);

  $('#content-container').append(elem);

  $(elem).css('left', offset.left  + CORECTION_OFFSET.x);
  $(elem).css('top', offset.top + CORECTION_OFFSET.y);
  $(elem).addClass(className);

  if (intrim) {
    $(elem).addClass('intrim');
    currentCorrections.push(elem);
  }
  else finalCorrections.push(elem);
}

function getOffsetByIndex (index) {
  $('#get-pos-text').html(fullScript.slice(0, index).join(SPC));
  return $('#get-pos').offset();
}

function clearCurrentCorrections() {
  for (i=0; i<currentCorrections.length; i++) {
    $(currentCorrections[i]).remove();
  }
}
