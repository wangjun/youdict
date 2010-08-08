
(function(){
var pX, pY, c;

function showDict(event){
	chrome.extension.sendRequest({action: 'check-query-enabled'}, function(enabled){
	if (!enabled) return true;
	pX = event.pageX, pY = event.pageY;
	var selection = window.getSelection(),
		word = selection.toString().replace(/^\s+|\s+$/g, '');
	if( word.length >= 1 )
		chrome.extension.sendRequest({action: 'query-dict', word: word}, onQuery)
	});
}

function onQuery(data){
	if (!data){
		return true;
	}
	hideDict()
	var text;
	var d = document.createElement('div')
	c = d.cloneNode(true);

	c.appendChild(d);
	setStyle(d);
	setStyle2(c);
	var a = document.createElement('a')
	a.target = '_blank';

	if( data.returnPhrase == 'null' ){
		text = 'no such words';
		a.href = 'http://dict.youdao.com/search?q=' + encodeURIComponent(data.originalQuery);
		a.innerHTML = data.originalQuery;
	}else{
		var translate = '<p style="margin:1px; padding:0">' + data.customTranslation.content.join('<br/>') + '</p>';
		var pronouce = data.phoneticSymbol ? '<p style="margin:1px; padding:0">[' + data.phoneticSymbol + ']<embed width="17" height="17" name="plugin" src="http://dict.youdao.com/test.nobound.swf?audio=http://dict.youdao.com/speach?audio=' + data.returnPhrase + '" type="application/x-shockwave-flash" display="inline"></p>' : '';
		var word = '<strong>' + data.returnPhrase + '</strong>'
		text = word + pronouce + translate;

		a.href = data.yodaoLink;
		a.innerHTML = data.returnPhrase;
	}

	c.appendChild(a);
	d.innerHTML = text;

	var close = document.createElement('button')
	close.innerHTML = 'X'
	close.onClick = hideDict;
	close.style.position = 'absolute';
	close.style.display = 'block';
	close.style.right = '0px'
	close.style.top = '3px'
	close.style.width = '15px'
	close.style.padding = '0'
	close.style.margin = '1px'
	c.appendChild(close)

	document.body.insertBefore(c, document.body.firstChild);
}
function setStyle(d){
	var s = d.style;
	s.display = 'block';
	s.backgroundColor = '#ffffbf';
	s.border = '9px solid transparent';
	s.width = 'auto';
	s.zIndex="99998";
	s.color = 'black';
}
function setStyle2(d){
	var s = d.style;
	s.fontSize = '12px';
	s.textAlign = 'left';
	s.display = 'block';
	s.position = 'absolute';
	s.top = pY + 8 + 'px';
	s.left = pX + 'px';
	s.backgroundColor = '#ffffbf';
	s.margin = '6px';
	s.border = '5px solid #e1c642';
	s.setProperty('max-width', '350px');
	s.setProperty('min-width', '120px');
	s.setProperty("-webkit-border-radius","5px");
	s.zIndex="99997";
}
function hideDict(){
	if(c){
		document.body.removeChild(c);
		c = null;
	}
}

document.addEventListener('dblclick', showDict, true);
document.addEventListener('click', hideDict, true);

var timer, prevC, prevO, prevWord;
var isAlpha = function(str){return /[a-zA-Z']+/.test(str)};

document.addEventListener('mousemove', function(event){
	if (!event.ctrlKey){
		return true;
	}
	var r = document.caretRangeFromPoint(event.clientX, event.clientY);
	if (!r) return true;

	pX = event.pageX;
	pY = event.pageY;
	var so = r.startOffset, eo = r.endOffset;
	if (prevC === r.startContainer && prevO === so) return true

	prevC = r.startContainer;
	prevO = so;
	var tr = r.cloneRange(), text='';
	if (r.startContainer.data) while (so >= 1){
		tr.setStart(r.startContainer, --so);
		text = tr.toString();
		if (!isAlpha(text.charAt(0))){
			tr.setStart(r.startContainer, so + 1);
			break;
		}
	}
	if (r.endContainer.data) while (eo < r.endContainer.data.length){
		tr.setEnd(r.endContainer, ++eo);
		text = tr.toString();
		if (!isAlpha(text.charAt(text.length - 1))){
			tr.setEnd(r.endContainer, eo - 1);
			break;
		}
	}

	var word = tr.toString();
	if (prevWord == word && c) return true;
	else if (c){
		hideDict();
	}
	prevWord = word;

	if (timer){
		clearTimeout(timer);
		timer = null;
	}
	if (word.length >= 1){ timer = setTimeout(function(){
		chrome.extension.sendRequest({action: 'check-query-enabled'}, function(enabled){
				if (!enabled) return;
				var s = window.getSelection();
				s.removeAllRanges();
				s.addRange(tr);
				chrome.extension.sendRequest({action: 'query-dict', word: word}, onQuery)
			})
		}, 30);
	}
}, true);
})();
