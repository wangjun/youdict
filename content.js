
var pX, pY, c;

function showDict(event){
	pX = event.pageX, pY = event.pageY;
	var selection = window.getSelection(),
		word = selection.toString().replace(/^\s+|\s+$/g, '');
	if( word.length >= 1 )
		chrome.extension.sendRequest({action: 'query-dict', word: word}, onQuery)
}

function onQuery(data){
	var text;
	if( !data.customTranslation )
		text = 'no such words';
	else
		text = data.customTranslation.content.join('<br/>');
		if( text.length <= 0 )
			text = 'no such words';

	c = document.createElement('div')
	setStyle(c);
	c.innerHTML = text;
	document.body.insertBefore(c, document.body.firstChild);
}
function setStyle(d){
	d.style.display = 'block';
	d.style.position = 'absolute';
	d.style.top = pY + 'px';
	d.style.left = pX + 'px';
	d.style.backgroundColor = '#ffffbf';
	d.style.border = '9px solid transparent';
	d.style.setProperty("-webkit-border-radius","5px");
	d.style.zIndex="99997";
}
function hideDict(){
	if(c)
		document.body.removeChild(c);
}

document.addEventListener('dblclick', showDict, false);
document.addEventListener('click', hideDict, false);

