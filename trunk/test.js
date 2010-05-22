
var isAlpha = function(str){return /[a-zA-Z'-]+/.test(str)},
	tryTimes = 5;

function onMouseMove(event){
	var r = document.caretRangeFromPoint(event.clientX, event.clientY);
	if (!r) return true;
	cac = r.commonAncestorContainer;
	tryTimes = 5;
	while (tryTimes-- && cac !== event.target){
		cac = cac.parentNode;
	}
	if (cac !== event.target) return true;

	var tr = r.cloneRange();
	var so = r.startOffset, eo = r.endOffset;
	while (so >= 1){
		tr.setStart(r.startContainer, --so)
		text = tr.toString();
		//console.log('start', text, so, text.charAt(0), isAlpha(text.charAt(0)));
		if (!isAlpha(text.charAt(0))){
			tr.setStart(r.startContainer, so + 1)
			break;
		}
	}
	if (r.endContainer.data) while (eo < r.endContainer.data.length){
		tr.setEnd(r.endContainer, ++eo)
		text = tr.toString();
		//console.log('end', text, eo, text.charAt(text.length - 1), isAlpha(text.charAt(text.length - 1)));
		if (!isAlpha(text.charAt(text.length - 1))){
			tr.setEnd(r.endContainer, eo - 1)
			break;
		}
	}

	if (tr.toString().length >= 1){
		var s = window.getSelection();
		s.removeAllRanges();
		s.addRange(tr);
	}
}
window.onload = function(){
document.addEventListener('mousemove', onMouseMove, true);
}
