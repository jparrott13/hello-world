/*
 * Modal Dialog Widget
 *
 * Instructions of use:
 * The widget selector determines the element used as the widget content.
 * If the link property is specified with an element, the dialog will be hidden and the element will activate the dialog.
 * If no link property is specified, the dialog will show by default.
 * If a URL is specified for the ajax property, AJAX will be used to load in content.
 * http://webhipster.com/testing/accessibility/modal-dialog-latest/
 */
var currentDialog;
;(function($){
$.widget('ui.modalDialog', {
	options: {
		//Add custome class(es) to the dialog wrapper
		classNames:'',
		// allow the dialog to be focused (not tied to move)
		dialogFocus:true,
		// Identify an element that will activate the modal dialog 
		activator:'',
		// Identify an element that will have focus after modal dialog closes 
		returnFocus:'',
		// Display an underlay
		underlayer:true,
		//display elements for image shadows
		shadow:false,
		// Set the opacity of the underlay
		opacity:0.75,
		// Set the fadein time
		fadeIn:0,
		// Set the fadeout time
		fadeOut:0,		
		// Make the dialog movable via drag/arrow keys 
		movable:false,
		// Amount in pixels dialog can be moved with arrow keys
		move:20,
		// Specify an element to be focused 
		// by default if the dialog is movable, the entire dialog will be focused
		// if the dialog is not movable and contains any focusable element, that element will be focused, otherwise the close button will be focused
		focused:'',
		lockFocus: true,
		// sets aria role to application
		role:"document",
		// Offset height for shadow		
		offsetHeight:60,
		//offset width for shadow
		offsetWidth:60,
		// aria-labelledby value
		ariaLabel:'dialog-label',
		// heading ID
		headingID:'dialog-label',
		// heading level (could be any element, but we recommend a heading)
		headingLevel:'h2',
		// heading text. If empty, no header displays.
		headingText:'Modal Dialog',
		// element the dialog is attached to
		attach:'body',
		// How the dialog will be inserted in relation to the attach element (prepend or append)
		// By default, if no activator, it will be prepended.  If activator is present, will be appended.
		attachType:'',
		// close text
		closeText:'Close <span class="semantic">Modal Dialog</span>',
		// top placement of the dialog if not vertically centered
		top:'',
		// right placement of the dialog if not horizontally centered
		right:'',
		// bottom placement of the dialog if not vertically centered
		bottom:'',
		// left placement of the dialog if not horizontally centered
		left:'',
		// horizontally center the dialog
		horizontal:true,
		// vertically center the dialog
		vertical:true,
		// element the dialog will position to
		centerContent: false,
		dialogButtonBorder: true,
		container:window,
		// if dialog is moved, closed, and reopened dialog will center again
		reCenter:true,
		// keep dialog centered when window is resized
		keepCenter:true,
		// add two classes: browser-type and version-number 
		browserClass:true,
		// when hovered or focused hover class and/or focus class is added to element
		hoverFocus:'.dialog-close',
		// close button Title text
		closeTitle:'Close',
		// close button ALT text
		closeAlt:'Close',	
		// element added at beginning of dialog
		start:'Modal Dialog Start',
		// element added at end of dialog
		end:'Modal Dialog End',
		//Custome buttons object
		buttons: null,
		/*
		[
			{
				'One': {
					"alt":"One",
					"title":"One",
					"class":"dialog-action",
					"click":function() {
						alert("One");
					}
				}
			},
			{
				'Two': {
					"alt":"Two",
					"title":"Two",
					"class":"dialog-action",
					"click":function() {
						alert("Two");
					}	
				}
			},
			{
				'Three': {
					"alt":"Three",
					"title":"Three",
					"class":"dialog-action",
					"click":function() {
						alert("Three");
					}
				}
			}			
		],
		*/
		// element(s) png support is added to for background images in IE6
		png:'',
		// because the widget selector can not be empty, specify the window object when using ajax to load dialog content on page load
		// if using an activator link, use the activator link selector for the widget selector
		ajax: {
			url: '',
			contentType:'application/x-www-form-urlencoded',
			type:'GET',
			data:'',
			context:'',
			cache:false,
			async:true,
			dataType:'html',
			errorMessage:'Could not load content.',
			success:function(data, textStatus, jqXHR) {
				return jqXHR.responseText;
			}
		},
		bodyText:'',
		width:'',
		closable:true,
		noHeader:false,
		closeButton:false,
		showFunction:null,
		closeFunction:null,
		save:'',
		// have a loading image
		loader:true,
		// Text appearing before the loader image
		loaderText:'Loading...'
	},	
	_init: function() {		
		this.initialize();
	},
	_create: function() {		
		var _this = this;
		currentDialog = this;
		_this.opened = false,
		_this.dialogHeight = null;
		_this.dialogWidth = null;
		_this.containerHeight = null;
		_this.containerWidth = null;
		_this.fontHeight = null;			
		
		var innerClass = "dialog-wrapper-inner";
		
		if ( _this.options.centerContent )
		{
			innerClass += " dialog-wrapper-inner-center";			
		}
		
		_this.underlayWrapper = $('<div class="underlay-wrapper' + _this.options.classNames + '" />').attr("aria-hidden","true");
		_this.wrapperOuter = $('<div class="dialog-wrapper-outer roundedCorners" />');
		_this.wrapperInner = $('<div class="' + innerClass + '" />');
		if ( _this.options.width != '')
		{
			_this.wrapperOuter.attr("style","width: " + _this.options.width + "px");
		}		
		_this.underlay = $('<div class="underlay" />');
		_this.wrapper = $('<div class="dialog " />').attr("aria-labelledby",_this.options.ariaLabel);
		_this.options.shadow === true ? _this.shadow = $('<div class="shadow"><div class="side top-side"></div><div class="side bottom-side"></div><div class="side left-side"></div><div class="side right-side"></div><div class="corner t-l"></div><div class="corner t-r"></div><div class="corner b-l"></div><div class="corner b-r"></div></div>') : _this.shadow = '';
		_this.sizeChange = $('<i id="size-change" aria-hidden="true" />');
		_this.dialogStart = $('<span class="dialog-start semantic">'+_this.options.start+'</span>');
		_this.dialogEnd = $('<span class="dialog-end semantic">'+_this.options.end+'</span>');		
		// Start/End Tab suggestion - Hans Hillen (hhillen@paciellogroup.com)
		_this.startTab = $('<div class="start-tab semantic" tabindex="0" />');
		_this.endTab = $('<div class="end-tab semantic" tabindex="0" />');
		if(_this.options.headingText !== '' && _this.options.noHeader == false ) {
			_this.header = $('<'+_this.options.headingLevel+'/>').attr({
				'id':_this.options.headingID
			}).html(_this.options.headingText);
			_this.dialogTitle = $('<div class="dialog-title roundedCorners" />').append($('<div>').append(_this.header))
		}
		else {
			_this.dialogTitle = '';
			_this.header = '';
		}
		
		if ( _this.options.closable && (_this.options.noHeader == false || _this.options.closeButton ) ) {
			_this.closeButton = $('<button id="dialog-close"  class="dialog-close" />').attr({
				'title':_this.options.closeTitle,
				'alt':_this.options.closeAlt
			}).html('<span>'+_this.options.closeText+'</span>');
		}
		else {
			_this.closeButton = '';			
		}
		_this.closeFunction = _this.options.closeFunction;
		_this.showFunction = _this.options.showFunction;
		
		var dialogButtonClass = "dialog-buttons";
		
		if ( _this.options.dialogButtonBorder )
		{
			dialogButtonClass += " dialog-buttons-border";			
		}
		
		_this.buttons = $('<div class="' + dialogButtonClass + '" />');
		_this.loader = $('<div class="loader" role="alert" aria-live="assertive"><h3 tabindex="0">'+_this.options.loaderText+'</h3></div>');
		_this.options.role === "application" ? _this.status = $('<div class="dialog-status semantic" aria-live="assertive" role="status"><p></p></div>') : _this.status = "";
		_this.options.underlayer === true ? _this.underlayer = $('<div class="underlayer" />').css({
      height: $(_this.options.container).height() + "px",
      width: $(_this.options.container).width() + "px",
			opacity:_this.options.opacity
    }) : _this.underlayer = "";
		/*
		if(_this.options.buttons !== null && typeof _this.options.buttons === 'object') {
			$.each(_this.options.buttons,function(i,v) {
				_this.actionButton = $('<button />');
				$.each(v,function(text,attributes) {
					_this.actionButton.text(text);
					$.each(attributes,function(property,value) {
						if(property === 'click') {
							_this.actionButton.click(function() {
								value.apply();
								return false;
							});
							return false;
						}
						_this.actionButton.attr(property,value);
					});
				});
				_this.buttons.append(_this.actionButton);
			});
		}
		*/
    	
		if(_this.options.buttons !== null && typeof _this.options.buttons === 'object') {
			$.each(_this.options.buttons,function(i,v) {
				_this.actionButton = $('<input />');
				_this.actionButton.attr("type","button");
				$.each(v,function(text,attributes) {
					_this.actionButton.attr("value",text);
					$.each(attributes,function(property,value) {
						if(property === 'click') {
							_this.actionButton.click(function() {
								value.apply();
								return false;
							});
							return false;
						}						
						_this.actionButton.attr(property,value);
					});
				});
				_this.buttons.append(_this.actionButton);
			});
		}		
		else {
			_this.buttons = '';			
		}
		
		_this.underlayWrapper.append(_this.underlay.prepend(_this.underlayer).append(_this.wrapper.append(_this.shadow).append(_this.status).append(_this.wrapperOuter.append(_this.dialogTitle).append(_this.closeButton).append(_this.wrapperInner.append(_this.buttons))).prepend(_this.dialogStart).append(_this.dialogEnd)));
		
		if(_this.options.activator === '' && _this.options.attachType === '') {
			$(_this.options.attach).append(_this.underlayWrapper);
		}		
		else if (_this.options.activator !== '' && _this.options.attachType === ''){			
			$(_this.options.attach).append(_this.underlayWrapper);
		}		
		else if (_this.options.attachType === 'prepend'){
			$(_this.options.attach).prepend(_this.underlayWrapper);	
		}
		else {
			$(_this.options.attach).append(_this.underlayWrapper);
		}
	
		if (_this.options.browserClass === true) {
			$.each($.browser, function(key,val){
				if (val === true) {
					_this.underlayWrapper.addClass(key);
					_this.underlayWrapper.addClass(key+'-'+$.browser.version);
				}
			});	
		}
		
		if(_this.options.dialogFocus === true) {
			_this.wrapper.attr({
				tabIndex:0
			});
		}
	},
	dimensions: function() {
		var _this = this;
		_this.dialogHeight = _this.wrapper.outerHeight();
		_this.dialogWidth  = _this.wrapper.outerWidth();
		_this.containerHeight = $(_this.options.container).height()
		_this.containerWidth  = $(_this.options.container).width()	
		if(_this.isIE6() && _this.options.shadow === true) {
			_this.shadow.find('div.top-side,div.bottom-side').css({
					width:_this.dialogWidth - _this.options.offsetWidth - 1
				});	
				_this.shadow.find('div.right-side,div.left-side').css({
					height:_this.dialogHeight - _this.options.offsetHeight
			});		
		}
		else if( _this.options.shadow === true) {
			_this.shadow.find('div.top-side,div.bottom-side').css({
				width:_this.dialogWidth - _this.options.offsetWidth
			});	
			_this.shadow.find('div.right-side,div.left-side').css({
				height:_this.dialogHeight - _this.options.offsetHeight
			});
		}
	},
	position:function() {
		var _this = this;
		if(_this.options.horizontal === true && _this.options.right === '' && _this.options.left === '') {		
			_this.wrapper.css({
				left: _this.containerWidth/2 - _this.dialogWidth/2
			});			
		}
		else {
			if(_this.options.right !== '') {
				_this.wrapper.css({
					right: _this.options.right
				});			
			}
			if(_this.options.left !== '') {
				_this.wrapper.css({
					left: _this.options.left
				});			
			}				
		}
		if(_this.options.vertical === true && _this.options.top === '' && _this.options.bottom === '') {		
			_this.wrapper.css({
				top: _this.containerHeight/2 - _this.dialogHeight/2
			});			
		}	
		else {		
			if(_this.options.top !== '') {
				_this.wrapper.css({
					top: _this.options.top
				});			
			}			
			if(_this.options.bottom !== '') {
				_this.wrapper.css({
					bottom: _this.options.bottom
				});			
			}	
		}
	},
	drag: function() {
		var _this = this;
		if(_this.options.movable === false) {
			return false
		}
		
		_this.wrapper.attr({
			tabIndex:0,
			role: this.options.role
		}).css({
			cursor:"move"
		});	
		
    _this.wrapper.draggable({
      drag: function(event, ui) { 
				
        if(ui.position.top <= 0) {
          ui.position.top = 0;
        }
        if(ui.position.top >= _this.containerHeight - _this.dialogHeight) {         
					ui.position.top = _this.containerHeight - _this.dialogHeight;
        }
				
				if(ui.position.top !== _this.positionTop && _this.options.role === "application") {
					if(ui.position.top + _this.dialogHeight/2 < _this.containerHeight/2) {
						_this.status.find('p').html(ui.position.top + ' pixels from top.');	
					}
					else {
						_this.status.find('p').html(_this.containerHeight - _this.dialogHeight - ui.position.top + ' pixels from bottom.');
					}
				}	
				
				_this.positionTop = ui.position.top;
				
        if(ui.position.left <= 0) {
          ui.position.left = 0;
        }
				
        if(ui.position.left >= _this.containerWidth - _this.dialogWidth) {
          ui.position.left = _this.containerWidth - _this.dialogWidth;			
        }
				
				if(ui.position.left !== _this.positionLeft && _this.options.role === "application") {
					if((ui.position.left + _this.dialogWidth/2) < (_this.containerWidth/2)) {
						_this.status.find('p').html(ui.position.left + ' pixels from left.');
					}
					else {
						_this.status.find('p').html(_this.containerWidth - _this.dialogWidth - ui.position.left + ' pixels from right.');	
					}	
				}
				
				_this.positionLeft = ui.position.left;
				
      }
    });	
		_this.wrapper.keydown(function(e) {
			switch(e.keyCode) {
				case 37:
						e.preventDefault();
						if(_this.wrapper.css("left").match('-?[0-9]+') >= _this.options.move && !_this.wrapper.hasClass("animating")) {
							_this.wrapper.addClass("animating");
							_this.wrapper.animate({
								left:'-='+_this.options.move
							},function() {
								_this.wrapper.removeClass("animating");	
							});
						}
						if(_this.wrapper.css("left").match('-?[0-9]+') <= _this.options.move && !_this.wrapper.hasClass("animating")) {
							_this.wrapper.animate({
								left:0
							},function() {
								_this.wrapper.removeClass("animating");	
							});
						}
						if(_this.options.role === "application") {
							_this.status.find('p').html(_this.wrapper.css("left").match(/\d+/) + ' pixels from left.');
						}
						break;
				case 38:
					e.preventDefault();
					if(_this.wrapper.css("top").match('-?[0-9]+') >= _this.options.move && !_this.wrapper.hasClass("animating")) {
						_this.wrapper.addClass("animating");
						_this.wrapper.animate({
							top:'-='+_this.options.move
						},function() {
							_this.wrapper.removeClass("animating");	
						});		
					}
					if(_this.wrapper.css("top").match('-?[0-9]+') <= _this.options.move && !_this.wrapper.hasClass("animating")) {
						_this.wrapper.animate({
							top:0
						},function() {
							_this.wrapper.removeClass("animating");	
						});
					}
					if(_this.options.role === "application") {
						_this.status.find('p').html(_this.wrapper.css("top").match(/\d+/) + ' pixels from top.');					
					}
					break;		
				case 39:
					e.preventDefault();
					if(_this.wrapper.css("left").match('-?[0-9]+') <= _this.containerWidth - _this.dialogWidth - _this.options.move && !_this.wrapper.hasClass("animating")) {
						_this.wrapper.addClass("animating");
						_this.wrapper.animate({
							left:'+='+_this.options.move
						},function() {
							_this.wrapper.removeClass("animating");	
						});
					}
					if(_this.wrapper.css("left").match('-?[0-9]+') >= _this.containerWidth - _this.dialogWidth - _this.options.move && !_this.wrapper.hasClass("animating")) {
						_this.wrapper.animate({
							left:_this.containerWidth - _this.dialogWidth
						},function() {
							_this.wrapper.removeClass("animating");	
						});
					}
					if(_this.options.role === "application") {
						_this.status.find('p').html(_this.containerWidth - _this.dialogWidth - _this.wrapper.css("left").match(/\d+/) + ' pixels from right.');		
					}
					break;
				case 40: 
					e.preventDefault();
					if(_this.wrapper.css("top").match('-?[0-9]+') <= _this.containerHeight - _this.dialogHeight - _this.options.move && !_this.wrapper.hasClass("animating")) {
						_this.wrapper.addClass("animating");
						_this.wrapper.animate({
							top:'+='+_this.options.move
						},function() {
							_this.wrapper.removeClass("animating");	
						});
					}
					if(_this.wrapper.css("top").match('-?[0-9]+') >= _this.containerHeight - _this.dialogHeight - _this.options.move && !_this.wrapper.hasClass("animating")) {
						_this.wrapper.animate({
							top:_this.containerHeight - _this.dialogHeight
						},function() {
							_this.wrapper.removeClass("animating");	
						});
					}
					if(_this.options.role === "application") {
						_this.status.find('p').html(_this.containerHeight - _this.dialogHeight - _this.wrapper.css("top").match(/\d+/) + ' pixels from bottom.');							
					}
					break;				
			}
	  });
	},
	ajaxError:function(jqXHR, textStatus, errorThrown) {
		var _this = this;
		_this.wrapperInner.html(_this.options.ajax.errorMessage);
	},
	ajaxBeforeSend:function(jqXHR, settings) {
		var _this = this;
		if(_this.options.loader === true) {
			_this.wrapperInner.append(_this.loader);
		}
		_this.openDialog();
	},
	ajaxSuccess:function(data, textStatus, jqXHR) {
		var _this = this;
		_this.loader.remove();
		_this.wrapperInner.prepend(_this.options.ajax.success(data, textStatus, jqXHR));
		
		_this.dimensions();
		_this.position();
		//_this.tab();
	},
	ajaxComplete:function(jqXHR, textStatus) {
		var _this = this;
		// do something
	},
	initialize: function() {
		var _this = this;
		if (_this.options.ajax.url !== '') {
			$.ajax({
				url: _this.options.ajax.url,
				type:_this.options.ajax.type,
				data:_this.options.ajax.data,
				context:_this.options.ajax.content,
				cache:_this.options.ajax.cache,
				async:_this.options.ajax.async,
				dataType:_this.options.ajax.dataType,
				contentType:_this.options.ajax.contentType,
				error:function(jqXHR, textStatus, errorThrown) {
					_this.ajaxError(jqXHR, textStatus, errorThrown);
				},
				beforeSend: function(jqXHR, settings) {
					_this.ajaxBeforeSend(jqXHR, settings);
				},
				success:function(data, textStatus, jqXHR) {
					_this.ajaxSuccess(data, textStatus, jqXHR);
				},	
				complete:function(jqXHR, textStatus) {
					_this.ajaxComplete(jqXHR, textStatus);
				}
			});
		}
		else if (_this.options.bodyText != '') {
			_this.wrapperInner.prepend(_this.options.bodyText);
			_this.openDialog();	
						
			_this.dimensions();
			_this.position();
		}
		else {
			_this.wrapperInner.prepend(_this.element);
			_this.options.bodyText = $j(_this.element).clone().wrap('<p>').parent().html();
			_this.options.bodyText = _this.options.bodyText.replace(new RegExp("<:[^>]*>","gm"), "");
			_this.openDialog();
		}				
	},
	openDialog: function() {
		var _this = this;
		/*
		if(_this.options.activator !== "") {
			$(_this.options.activator).click(function() {
				_this.showDialog();
				return false;
			});	
		}
		else {
			_this.showDialog();
		}*/	
		if ($.isFunction(_this.showFunction))
		{
			_this.showFunction();
		}
		_this.showDialog();
	},	
	showDialog: function() {
		var _this = this;		
		var count = 0;
		_this.underlayWrapper.add(_this.underlay).add(_this.wrapper).fadeIn(_this.options.fadeIn,function() {
			count++;
			if(count === 3) {
				_this.tab();
				count++;
			}
		});
		_this.hoverFocus();
		_this.drag();	
		_this.resize();
		_this.dimensions();
		_this.closeEvent();
		if(_this.opened === false || _this.options.reCenter === true) _this.position();
		$('body').children().attr("aria-hidden","true");
		_this.underlayWrapper.attr("aria-hidden","false");
		_this.fontResize();
		if(_this.isIE6()) _this.ie();
		_this.opened = true;
		$('body').prepend(_this.startTab,_this.sizeChange).append(_this.endTab);
	},
	ie:function() {
		var _this = this;
		if(_this.options.png !== '') {
			_this.shadow.find(_this.options.png).each(function(){
				// IE PNG Fix - Andreas Eberhard, andreas.eberhard@gmail.com (http://jquery.andreaseberhard.de/) 
				var bgIMG = $(this).css('background-image');
				if(bgIMG.indexOf(".png")!=-1){
					var iebg = bgIMG.split('url("')[1].split('")')[0];
					$(this).css('background-image', 'none');
					$(this).get(0).runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + iebg + "',sizingMethod='scale')";
				}
			});		
		}
		if(_this.options.underlayer === true) {
			_this.iframe = $('<iframe frameBorder="0" scrolling="no" />').css({
				height:_this.containerHeight,
				width:_this.containerWidth,
				opacity:0 
			})
			_this.underlayWrapper.append(_this.iframe);
		}
		_this.contentiframe = $('<iframe frameBorder="0" scrolling="no" />').css({
			height:_this.dialogHeight,
			width:_this.dialogWidth,
			opacity:0 
		})
		_this.wrapper.append(_this.contentiframe);		
	},
	fontResize: function() {
		var _this = this;
		if ($("i#size-change").height() !== _this.fontHeight) {
			_this.dimensions();
			_this.position();
		}
		_this.fontHeight = $("i#size-change").height();
		setTimeout(function() {
			_this.fontResize();
		},100);
	},
	tab: function() {
		var _this = this;
		var focusable = [];
		_this.underlayWrapper.find('*').each(function(i,val) {
			if(val.nodeName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/gim) && parseInt(val.getAttribute("tabIndex")) !== -1) {
				focusable.push(val);
			}
			if((val.getAttribute("tabIndex") !== null) && (parseInt(val.getAttribute("tabIndex")) >= 0) && (val.getAttribute("tabIndex", 2) !== 32768)) {
				focusable.push(val);
			}
		});
				
		_this.startTab.focus(function() {
			focusable[0].focus();
		});
		
		_this.endTab.focus(function() {
			focusable[focusable.length - 1].focus();
		});
	
		if( _this.options.dialogFocus === true && _this.options.focused === '' && !_this.loader.is(":visible")) {
			_this.wrapper.focus();
		}
		else if(focusable.length > 1 && _this.options.focused === '' && !_this.loader.is(":visible")) {
			focusable[1].focus();
		} 
		else if(_this.options.focused !== '' && !_this.loader.is(":visible")) {
			if(typeof(_this.options.focused) === 'number') {
				focusable[_this.options.focused].focus();
			}
			else {
				$(_this.options.focused).focus();
			}
		}
		else if (_this.loader.is(":visible")) {
			_this.loader.find('h3').focus();
		}
		else {
			focusable[0].focus();
		}
		
		$(focusable).keydown(function(e) {
			e.stopPropagation();
			if(e.keyCode === 27 && _this.options.closable ) {
				e.preventDefault();
				_this.closeDialog();
			}		
			
			if ( _this.options.lockFocus )
			{
				if(this === focusable[focusable.length - 1]) {
					if(e.keyCode === 9 && !e.shiftKey) {
						e.preventDefault();
						focusable[0].focus();						
					}
				}
				if(this === focusable[0]) {
					if(e.shiftKey && e.keyCode === 9) {
						e.preventDefault();
						focusable[focusable.length - 1].focus();					
					}
					if(e.keyCode === 9 && !e.shiftKey && focusable.length > 1) {
						e.preventDefault();
						focusable[1].focus();					
					}
				}
			}
		 });
	},	
	hoverFocus:function() {
		var _this = this;
		$(_this.options.hoverFocus).focus(function(e) {
			$(_this.options.hoverFocus).addClass('focus-active');
		}).focusout(function(e) {
			$(_this.options.hoverFocus).removeClass('focus-active');
		});        
		$(_this.options.hoverFocus).hover(function(e) {
			$(_this.options.hoverFocus).addClass('hover-active');
		},function() {
			$(_this.options.hoverFocus).removeClass('hover-active');
		});		
	},
	closeEvent: function() {
		var _this = this;
		$(window).keydown(function(e) {
	    if(e.keyCode === 27 && _this.options.closable ) {
	      _this.closeDialog();
				return false;
	    }
	  });	
		if ( _this.options.closable && _this.closeButton !== '' ) {
	  	_this.closeButton.add(_this.cancelButton).bind('click keypress',function(e) {
	  		if(e.keyCode === 13 || e.keyCode === 32 || e.type === 'click') {
				e.preventDefault();
				_this.closeDialog();				
				return false;
			}
	  	});
		}
	},
	isIE6:function() {
		var _this = this;
		if(jQuery.browser.msie&&parseInt(jQuery.browser.version,10)<7&&parseInt(jQuery.browser.version,10)>4){
			return true;
		}
		return false;
	},
	dismissDialog: function() {
		var _this = this;
		currentDialog = null;
		
		_this.underlay.add(_this.wrapper).fadeOut(_this.options.fadeOut,function() {
			_this.underlayWrapper.hide();
			_this.dimensions();
			$(_this.options.hoverFocus).removeClass('hover-active focus-active');	
			_this.startTab.add(_this.endTab).add(_this.sizeChange).remove();
			_this.underlayWrapper.attr("aria-hidden","true");
			$('body').children(':not(.underlay-wrapper)').attr("aria-hidden","false");
			
			if ( _this.options.save != '') {
				$('#' + _this.options.save).appendTo('body');
				Psr.hide( _this.options.save );
			} 
			_this.underlayWrapper.remove();
			_this.destroy();

		});		
	},
	closeDialog: function() {
		var _this = this;
		currentDialog = null;
		
		if ($.isFunction(_this.closeFunction))
		{
			_this.closeFunction();
		}
		
			_this.underlay.add(_this.wrapper).fadeOut(_this.options.fadeOut,function() {
				_this.underlayWrapper.hide();
				_this.dimensions();
				$(_this.options.hoverFocus).removeClass('hover-active focus-active');	
				_this.startTab.add(_this.endTab).add(_this.sizeChange).remove();
				_this.underlayWrapper.attr("aria-hidden","true");
				$('body').children(':not(.underlay-wrapper)').attr("aria-hidden","false");	
								
				setTimeout(function() {
					if ( _this.options.returnFocus != '' )
					{
						$(_this.options.returnFocus).focus();
					}
					else
					{
						$(_this.options.activator).blur().focus();
					}
					if ( _this.options.save != '') {
						$('#' + _this.options.save).appendTo('body');
						Psr.hide( _this.options.save );
					} 
					_this.underlayWrapper.remove();
					_this.destroy();
				},100);
			
			});
		
	},
	resize: function() {	
		var _this = this;
		$(_this.options.container).resize(function(){
			_this.containerHeight = $(_this.options.container).height();
			_this.containerWidth  = $(_this.options.container).width();		
			if ( _this.options.keepCenter === true ) {
				_this.position();
			}	
			_this.underlayer.css({
				height: _this.containerHeight + "px",
				width: _this.containerWidth + "px"
			});
		});	
	}		
});

})(jQuery);
