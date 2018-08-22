$(document).ready( function() {
  autoHeight($('#script-full'));
});

function autoHeight(element) {
  $(element).css('height','5px');
  $(element).css('height', $(element).prop('scrollHeight')+50+'px');
}