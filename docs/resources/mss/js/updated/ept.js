var Ept = function() {
	// Private	
	function createAndShowDialog(heading, body, buttonObject,size) {
		$('<div/>').html(body).dialog({
			title: heading,
			buttons:buttonObject,
			width:size
		});
	}
		
	// Public
	return {
		createDialog : function(div, options) {
			var divId = '';
			div = $j('<div/>').html(options.body);
			if ( div == null ) {
				div = $j(window);
				
				if ( options.width == null )
				{
					options.width = '375';
				}
			}
			options.dialogClass = "no-close";
			options.buttons = [
			    {
			      text: "Close",
			      click: function() {
			        $j( this ).dialog( "close" );
			      },
			      class : 'mycal-button'
			    }
			  ];
			$j(div).dialog(options);
		},
		
		createSimpleDialog : function(options) {
			this.createDialog(null, options);			
		},
		
		showAlert : function(body, heading) {
			buttonObject = [
							{
								'OK': {
									"alt":"OK",
									"title":"OK",								
									"click":function() {
										$j( this ).dialog( "close" );
									}
								}
							}
						];
			createAndShowDialog(heading,body,buttonObject,375);
		},
		
		confirmLink : function(link, body, heading) {
			if ( heading == null ) {
				heading = "Confirmation";
			}
			if ( body == null ) {
				body = "Are you sure wish to navigate to: " + link;				
			}
			
			buttonObject = [
							{
								'OK': {
									"alt":"OK",
									"title":"OK",	
									"class":"mainButton",
									"click":function() {
										window.location = link;
									}
								}
							},			                
							{
								'Cancel': {
									"alt":"Cancel",
									"title":"Cancel",								
									"click":function() {
										$j( this ).dialog( "close" );
										$j(options.returnFocus).focus();
									}
								}
							}
						];
			createAndShowDialog(heading,body,buttonObject,375);
		},
		
		/*
		 * Creates a modal dialog to Prompts the user to confirm that 
		 * they intend to transfer to the link
		 * parameters:
		 *  link - link to navigate to
		 *  body - html format of message to user
		 *  heading - text of dialog heading
		 *  options - contains the button options if you want to customize
		 *            the button labels.  In the form of:
		 *            {'submitName':'I\'m sure', 'cancelName':'Cancel'} 
		 */
		confirmLinkWithOptions : function(link, body, heading, options) {
			var options = $j.extend( {
	    		submitName	: 'OK',
	    		cancelName : 'Cancel'	    			
	    	}, options);
			
			if ( heading == null ) {
				heading = "Confirmation";
			}
			if ( body == null ) {
				body = "Are you sure wish to navigate to: " + link;				
			}
	
			buttonObject = [{},{}];

			buttonObject[0][options.submitName] = {
				"alt": options.submitName,
				"title": options.submitName,
				"class": "mainButton",
				"click":function() {
					window.location = link;
				}
			};

			buttonObject[1][options.cancelName] = {
					"alt": options.cancelName,
					"title": options.cancelName,
					"click": function() {
						$j( this ).dialog( "close" );
						$j(options.returnFocus).focus();
					}
				};
			
			createAndShowDialog(heading,body,buttonObject,375);
		},
		
		confirmSubmit : function(body, heading, form, pageActionExecute, options) {
	    	var options = $j.extend( {
	    		submitName	: 'OK',
	    		cancelName : 'Cancel'	    			
	    	}, options);
			
			var f;
			var _forms = $$('form.submitForm');
			if( form == null) {
				f = (_forms.length > 0) ? _forms[0] : document.forms[0];		
			}			
			else {
				f = document.forms[form];
			}
			
			if ( heading == null ) {
				heading = "Confirmation";
			}
			
			if ( body == null ) {
				body = "Are you sure you want to continue?";
			}
						
			buttonObject = [{},{}];

			buttonObject[0][options.submitName] = {
				"alt": options.submitName,
				"title": options.submitName,
				"class": "mainButton",
				"click": function() {
					if ( pageActionExecute != null ) {				
						hiddenFieldRegistry.removeAllFromDom();
						
						if(pageActionExecute != null && pageActionExecute != "" && f != null)
						{
							appendHiddenField(f, pageActionExecute, "execute", false);
						}
					}
				
					f.submit();
				}
			};

			buttonObject[1][options.cancelName] = {
					"alt": options.cancelName,
					"title": options.cancelName,
					"click": function() {
						$j( this ).dialog( "close" );
						$j(options.returnFocus).focus();
					}
				};
						
			createAndShowDialog(heading,body,buttonObject,375);
			return false;
		}
	};
}();
