var fullScript = [];
const CORECTION_OFFSET = {x:-1, y:22};
const SPC = ' ';

var currentCorrections = [];
var finalCorrections = [];

function grabScript() {
  s = $('#script-full').val();
  if(LOG_LEVEL >= 4) console.log(s);

  fullScript = cullWhiteSpace(s.split(' '));
  if(LOG_LEVEL >= 4) console.log(fullScript);
  setSelection(0);
}

//Reposition corrections after resize
var resizeCorrectionTimeout;
$(window).resize( function() {
  //Timeout is to avoid excessive recalculating during resizing
  clearTimeout( resizeCorrectionTimeout );
  resizeCorrectionTimeout = setTimeout (respositionCorrections, 500);
});
function respositionCorrections() {
  if (LOG_LEVEL >= 4) console.log('Respositioning Corrections');
  $('.correction').each( function() {
    offset = getOffsetByIndex($(this).data('index'));
    $(this).css('left', offset.left  + CORECTION_OFFSET.x);
    $(this).css('top', offset.top + CORECTION_OFFSET.y);
  });
}

function cullWhiteSpace(array) {
  var out = [];
  var currentBuffer = '';
  for (i=0; i<array.length; i++) {
    if (array[i] == '') currentBuffer += ' ';
    else {
      out.push(currentBuffer + array[i]);
      currentBuffer = '';
    }
  }
  return out;
}

function processTextForDisplay(text) {
  return text.replace(/\n/g, '<br>').replace(/  /g, '&nbsp; ');
}

function setSelection(index) {
  const fsl = fullScript.length;
  $('#transcript-script-spoken')   .html(
    processTextForDisplay(fullScript.slice(0, index).join(SPC)+SPC)
  );
  $('#transcript-script-unspoken') .html(
    processTextForDisplay(fullScript.slice(index, fsl) .join(SPC))
  );
}

function addCorrection (index, string, className, intrim) {
  if (!(intrim && simplifyIntrim)) errorCounter+= 2;
  checkLeniency();
  elem = $('<div class=correction>'+string+'</div>');
  offset = getOffsetByIndex(index);

  $('#transcript-outer').append(elem);

  $(elem).css('left', offset.left  + CORECTION_OFFSET.x);
  $(elem).css('top', offset.top + CORECTION_OFFSET.y);
  $(elem).data('index', index);
  $(elem).addClass(className);

  if (intrim) {
    $(elem).addClass('intrim');
    currentCorrections.push(elem);
  }
  else finalCorrections.push(elem);
}

function getOffsetByIndex (index) {
  tempString = processTextForDisplay(fullScript.slice(0, index).join(SPC));

  //Hack-y fix for whitespace
  spcs = fullScript[index].match(/ /g)
  if (spcs)
    for (i=0; i<spcs.length-1; i++)
      tempString+='&nbsp';

  $('#get-pos-text').html( tempString );
  return $('#get-pos').offset();
}

function clearCurrentCorrections() {
  for (i=0; i<currentCorrections.length; i++) {
    $(currentCorrections[i]).remove();
  }
}
