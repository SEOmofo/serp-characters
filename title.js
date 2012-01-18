javascript:void(function(){
	if(document.getElementById('mofoSerpData')){document.getElementById('mofoSerpData').parentNode.removeChild(document.getElementById('mofoSerpData'));}
	var clean=function(innerHTMLString){return innerHTMLString.replace(/<\/?[^>]+(>|$)/g,"").replace(/[ ]{2,}/g," ").replace(/(^\s*)|(\s*$)/g,"").replace(/&[A-Za-z0-9#]{2,8};/g,"&")};
	var winW=1000,winH=600;

	/* Determine window dimensions */
	if(document.body && document.body.offsetWidth){
		winW=document.body.offsetWidth;
		winH=document.body.offsetHeight;
	}
	if(document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth){
		winW=document.documentElement.offsetWidth;
		winH=document.documentElement.offsetHeight;
	}
	if(window.innerWidth && window.innerHeight){
		winW=window.innerWidth;
		winH=window.innerHeight;
	}

	var div=document.createElement('div');
	var mofoListItems=document.getElementById('rso').getElementsByTagName('li');
	var message='<div id="mofoSerpData" style="border:1px solid #9eaeb0;height:' + (winH-383) + 'px;overflow-y:auto;"><table cellpadding="6" cellspacing="1" border="0" bgcolor="#9eaeb0" style="position:relative;top:-1px;left:-1px"><tr><th bgcolor="#f0f7f8">Jump</th><th bgcolor="#f0f7f8">#</th><th bgcolor="#f0f7f8" width="512">Title</th><th bgcolor="#f0f7f8">Chars</th><th bgcolor="#f0f7f8">Width</th></tr>';
	var r=0,i,max1,linkURL,linkText,blueLink,minChar=999,maxChar=0,minWidth=512,maxWidth=0,bgColor;
	var jumpLink,minCharJumpLinkId='',maxCharJumpLinkId='',minWidthJumpLinkId='',maxWidthJumpLinkId='';

	for(i=0,max1=mofoListItems.length;i<max1;i++){  
		if(mofoListItems[i].getAttribute('class')=='g'){
		if(mofoListItems[i].id!='newsbox'){
		if(mofoListItems[i].getElementsByTagName('cite').length!=0){
		if(mofoListItems[i].getElementsByTagName('h3')[0].getElementsByTagName('a')[0].href.indexOf('q=related')==-1){
			r += 1;
			blueLink = mofoListItems[i].getElementsByTagName('h3')[0].getElementsByTagName('a')[0];
			linkURL = blueLink.href;
			linkText = clean(blueLink.innerHTML);

			if(linkText.length < minChar){
				minChar = linkText.length;
				minCharJumpLinkId = 'result_' + r;
			}
			else if(linkText.length > maxChar){
				maxChar = linkText.length;
				maxCharJumpLinkId = 'result_' + r;
			}
			if(blueLink.offsetWidth < minWidth){
				minWidth = blueLink.offsetWidth;
				minWidthJumpLinkId = 'result_' + r;
			}
			else if(blueLink.offsetWidth > maxWidth){
				maxWidth = blueLink.offsetWidth;
				maxWidthJumpLinkId = 'result_' + r;
			}

			if(blueLink.offsetWidth <= 512){
				bgColor = '#fff';
			}
			else {
				bgColor = '#f8f0f0';
			}

			message += '<tr><td align="center" bgcolor="' + bgColor + '" title="Jump to this SERP listing"><a href="#result_' + r + '" style="text-decoration:none;font-size:medium;font-weight:bold;display:block;width:33px;height:33px;line-height:33px">&#x21d0;</a></td><td align="right" bgcolor="' + bgColor + '" title="SERP position">' + r + '</td><td bgcolor="' + bgColor + '" title="' + linkURL + '"><div style="color:#12c;font-size:medium;text-decoration:underline;white-space:nowrap;width:512px;overflow:hidden;text-overflow:ellipsis">' + blueLink.innerHTML + '</div></td><td align="right" bgcolor="' + bgColor + '" title="number of characters">' + linkText.length + '</td><td align="right" bgcolor="' + bgColor + '" title="width in pixels">' + blueLink.offsetWidth + '</td></tr>';

			jumpLink = document.createElement('div');
			jumpLink.id = 'result_' + r;
			mofoListItems[i].insertBefore(jumpLink,mofoListItems[i].firstChild);
		}
		}
		}
		}
	}
	message += '</table>';
	message += '</div>';
	message += '<div style="float:right;margin-top:45px">';
	message += '<table cellpadding="6" cellspacing="1" border="0" bgcolor="#9eaeb0"><tr><th bgcolor="#f0f7f8"></th><th bgcolor="#f0f7f8">Chars</th><th bgcolor="#f0f7f8">Width</th></tr>';
	message += '<tr><th align="right" bgcolor="#fff">Max</th><td align="right" bgcolor="#fff"><a href="#' + maxCharJumpLinkId + '" style="text-decoration:none;font-size:medium;font-weight:bold" title="Click to jump to the SERP listing on this page that has the most characters in its title.">' + maxChar + '</a></td><td align="right" bgcolor="#fff"><a href="#' + maxWidthJumpLinkId + '" style="text-decoration:none;font-size:medium;font-weight:bold" title="Click to jump to the SERP listing on this page that has the widest title.">' + maxWidth + '</a></td></tr>';
	message += '<tr><th align="right" bgcolor="#fff">Min</th><td align="right" bgcolor="#fff"><a href="#' + minCharJumpLinkId + '" style="text-decoration:none;font-size:medium;font-weight:bold" title="Click to jump to the SERP listing on this page that has the fewest characters in its title.">' + minChar + '</a></td><td align="right" bgcolor="#fff"><a href="#' + minWidthJumpLinkId + '" style="text-decoration:none;font-size:medium;font-weight:bold" title="Click to jump to the SERP listing on this page that has the narrowest title.">' + minWidth + '</a></td></tr>';
	message += '</table>';
	message += '</div>';


	div.innerHTML=message;
	div.style.position='fixed';
	div.style.top='151px';
	div.style.left='792px';
	div.style.width='720px';
	div.style.height=(winH-243) + 'px';
	div.style.backgroundColor='#fff';
	div.style.zIndex='999999999';

	body=document.getElementsByTagName('body')[0];
	body.appendChild(div);
	body.style.marginBottom='1200px';

	return false;
})();