//Clear formatting on pasted text
document.querySelector('div[contenteditable="true"]').addEventListener("paste", function(e) {
  e.preventDefault();
  var text = e.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, text);
});