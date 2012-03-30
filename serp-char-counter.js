(function() {

/*--------------------------------------------------------------------*\
  Initialize/declare variables
\*--------------------------------------------------------------------*/

	var r = 0;

	var linkURL;
	var linkText;
	var blueLink;

	var minChar = 100;
	var maxChar = 0;
	var minWidth = 512;
	var maxWidth = 0;

	var jumpLink;

	var minCharJumpLinkId = '';
	var maxCharJumpLinkId = '';
	var minWidthJumpLinkId = '';
	var maxWidthJumpLinkId = '';



/*--------------------------------------------------------------------*\
  Include external stylesheet
\*--------------------------------------------------------------------*/

	var mofoCSS = document.createElement('link');
	mofoCSS.setAttribute('rel', 'stylesheet');
	mofoCSS.setAttribute('type', 'text/css');
	mofoCSS.setAttribute('href', 'http://www.seomofo.com/nobots/css/serp.css');
	document.getElementsByTagName('head')[0].appendChild(mofoCSS);



/*--------------------------------------------------------------------*\
  function clean() - preps innerHTML string for char counting
\*--------------------------------------------------------------------*/

	var clean = function(innerHTMLString) {
		// remove HTML tags
		innerHTMLString = innerHTMLString.replace(/<\/?[^>]+(>|$)/g, "");
		// remove multiple consecutive spaces
		innerHTMLString = innerHTMLString.replace(/[ ]{2,}/g, " ");
		// remove leading and trailing spaces
		innerHTMLString = innerHTMLString.replace(/(^\s*)|(\s*$)/g, "");
		// change HTML entities to a single ampersand character (otherwise they throw off character counts)
		innerHTMLString = innerHTMLString.replace(/&[A-Za-z0-9#]{2,8};/g, "&");
		return innerHTMLString;
	};



/*--------------------------------------------------------------------*\
  Include jQuery and YUI libraries
\*--------------------------------------------------------------------*/

	// Append jQuery script
	var jQueryScript = document.createElement('script');
	jQueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
	document.getElementsByTagName('head')[0].appendChild(jQueryScript);

	// Append YUI script
	var yuiScript = document.createElement('script');
	yuiScript.src = 'http://yui.yahooapis.com/3.4.1/build/yui/yui-min.js';
	document.getElementsByTagName('head')[0].appendChild(yuiScript);

	// How many seconds should we wait for scripts to load?
	var timeout = 10;

	// Self-referencing poll() function runs once per second until YUI is loaded or timeout is reached
	var poll = function() {
		setTimeout(function() {
			timeout--;

			// jQuery and YUI are loaded
			if ((typeof YUI !== 'undefined') && (typeof jQuery !== 'undefined')) {



			/*--------------------------------------------------------*\
			  Get a collection of SERP items
			\*--------------------------------------------------------*/

				var serpItems = [];

				var listItems = $('#rso > li.g');
				listItems = listItems.not('#newsbox');
				listItems = listItems.has('cite');

				for (var i = 0, max = listItems.length; i < max; i++) {
					if (listItems[i].getElementsByTagName('h3')[0].getElementsByTagName('a')[0].href.indexOf('q=related') == -1) {
						serpItems.push(listItems[i]);
					}
				}



			/*--------------------------------------------------------*\
			  Add local anchors for jump links
			\*--------------------------------------------------------*/

				for (var m = 0, max = serpItems.length; m < max; m++) {
					serpItems[m].setAttribute('id', 'result_' + (m + 1));
				}



			/*--------------------------------------------------------*\
			  Define SERP item object model
			\*--------------------------------------------------------*/

				var serpItem = function(serpElement) {

					// Private

					this.titleNode = function() {
						var node = $(serpElement).find('h3')[0];
						return node;
					};
					this.citationNode = function() {
						var node = {};
						var nodes = serpElement.firstChild.getElementsByTagName('div');
						for (var k = 0, max = nodes.length; k < max; k++) {
							if (nodes[k].getAttribute('class') == 's') {
								node = nodes[k].getElementsByTagName('cite')[0];
							}
						}
						return node;
					};
					this.snippetNode = function() {
						var node = {};
						var nodes = serpElement.firstChild.getElementsByTagName('div');
						for (var k = 0, max = nodes.length; k < max; k++) {
							if (nodes[k].getAttribute('class') == 's') {
								var spansInS = nodes[k].getElementsByTagName('span');
								for (var l = 0, max = spansInS.length; l < max; l++) {
									if (spansInS[l].getAttribute('class') == 'st') {
										node = spansInS[l];
									}
								}
							}
						}
						return node;
					};
					this.linkNode = function() {
						var node = $(serpElement).find('h3')[0];
						var link = $(node).find('a')[0];
						$(link).removeAttr('onmousedown');
						return node;
					};

					// Public

					this.title = {
						html: '<h3 class="r">' + this.linkNode().innerHTML + '</h3>',
						text: clean(this.titleNode().innerHTML),
						chars: clean(this.titleNode().innerHTML).length,
						width: this.titleNode().getElementsByTagName('a')[0].offsetWidth
					};
					this.citation = {
						html: '<div class="s"><div class="f kv"><cite>' + this.citationNode().innerHTML + '</cite></div></div>',
						text: clean(this.citationNode().innerHTML),
						chars: clean(this.citationNode().innerHTML).length,
						width: this.citationNode().offsetWidth
					};
					this.snippet = {
						html: '<div class="s"><span class="st">' + this.snippetNode().innerHTML + '</span></div>',
						text: clean(this.snippetNode().innerHTML),
						chars: clean(this.snippetNode().innerHTML).length,
						width: this.snippetNode().offsetWidth
					};
				}



			/*--------------------------------------------------------*\
			  HTML output
			\*--------------------------------------------------------*/

				var mofoHtml = '';

				mofoHtml += '<div class="scroll-wrapper">';
				mofoHtml +=     '<div id="mofo-buttons">';
				mofoHtml +=         '<div class="mofo-button">';
				mofoHtml +=             '<a href="javascript:void($(\'.title-container\').fadeIn());void($(\'.citation-container\').fadeOut());void($(\'.snippet-container\').fadeOut());"><span>Titles</span></a>';
				mofoHtml +=         '</div>';
				mofoHtml +=         '<div class="mofo-button">';
				mofoHtml +=             '<a href="javascript:void($(\'.citation-container\').fadeIn());void($(\'.title-container\').fadeOut());void($(\'.snippet-container\').fadeOut());"><span>URLs</span></a>';
				mofoHtml +=         '</div>';
				mofoHtml +=         '<div class="mofo-button">';
				mofoHtml +=             '<a href="javascript:void($(\'.snippet-container\').fadeIn());void($(\'.title-container\').fadeOut());void($(\'.citation-container\').fadeOut());"><span>Snippets</span></a>';
				mofoHtml +=         '</div>';
				mofoHtml +=         '<div class="mofo-button">';
				mofoHtml +=             '<a href="javascript:void($(\'.title-container\').fadeIn());void($(\'.citation-container\').fadeIn());void($(\'.snippet-container\').fadeIn());"><span>All</span></a>';
				mofoHtml +=         '</div>';
				mofoHtml +=         '<div id="close-mofo-table" class="mofo-button">';
				mofoHtml +=             '<a href="javascript:void($(\'#mofo-serp-data\').remove());"><span>X</span></a>';
				mofoHtml +=         '</div>';
				mofoHtml +=         '<div style="clear:both"></div>';
				mofoHtml +=     '</div>';
				mofoHtml +=     '<div class="drag-area">';
				mofoHtml +=         '<div id="mofo-table">';
				mofoHtml +=             '<table cellspacing="0">';
				mofoHtml +=                 '<tr>';
				mofoHtml +=                     '<th class="col1">Jump</th>';
				mofoHtml +=                     '<th class="col2">#</th>';
				mofoHtml +=                     '<th class="col3">Content</th>';
				mofoHtml +=                     '<th class="col4">Chars</th>';
				mofoHtml +=                     '<th class="col5">Width</th>';
				mofoHtml +=                 '</tr>';

				for (var j = 0, max = serpItems.length; j < max; j++) {

					// Create new instance of the serpItem object
					var serp = new serpItem(serpItems[j]);

					mofoHtml +=             '<tr>';
					mofoHtml +=                 '<td class="col1" title="Jump to this SERP listing"><a href="#result_' + (j + 1) + '">&#x21d0;</a></td>';
					mofoHtml +=                 '<td class="col2" title="SERP position">' + (j + 1) + '</td>';
					mofoHtml +=                 '<td class="col3">';
					mofoHtml +=                     '<div class="title-container std">' + serp.title.html + '</div>';
					mofoHtml +=                     '<div class="citation-container std">' + serp.citation.html + '</div>';
					mofoHtml +=                     '<div class="snippet-container std">' + serp.snippet.html + '</div>';
					mofoHtml +=                 '</td>';
					mofoHtml +=                 '<td class="col4" title="number of characters">';
					mofoHtml +=                     '<div class="title-container">' + serp.title.chars + '</div>';
					mofoHtml +=                     '<div class="citation-container">' + serp.citation.chars + '</div>';
					mofoHtml +=                     '<div class="snippet-container">' + serp.snippet.chars + '</div>';
					mofoHtml +=                 '</td>';
					mofoHtml +=                 '<td class="col5" title="width in pixels">';
					mofoHtml +=                     '<div class="title-container">' + serp.title.width + '</div>';
					mofoHtml +=                     '<div class="citation-container">' + serp.citation.width + '</div>';
					mofoHtml +=                     '<div class="snippet-container">' + serp.snippet.width + '</div>';
					mofoHtml +=                 '</td>';
					mofoHtml +=             '</tr>';
				}

				mofoHtml +=             '</table>';
				mofoHtml +=         '</div>';
				mofoHtml +=     '</div>';
				mofoHtml += '</div>';

				var div = document.createElement('div');
				div.id='mofo-serp-data';
				div.innerHTML = mofoHtml;
				document.getElementById('res').appendChild(div);



			/*--------------------------------------------------------*\
			  Initiate YUI stuff (now that DOM is ready)
			\*--------------------------------------------------------*/

				// Drag and Drop
				YUI().use('dd', function (Y) {
					var dd = new Y.DD.Drag({
						// selector of the node that initiates drag
						node: '#mofo-buttons',
						// selector of the draggable node
						dragNode: '#mofo-serp-data',
						// reset cursor to node center on drag
						// startCentered: true
					});
				});
				// Resize
				YUI().use('resize', function(Y) {
					var resize = new Y.Resize({
						// selector of the node to resize
						node: '#mofo-serp-data'
					});   
				});



			}
			// jQuery and/or YUI are not loaded yet, but keep trying
			else if (timeout > 0) {
				poll();
			}
			// jQuery and/or YUI failed to load before timeout
			else {
				alert('jQuery and/or YUI failed to load');
			}
		}, 1000);
	};
	poll();
})();