	var isEpt = true;
	var surveyTriggeredElement; //used for storing the element/menu reference that triggered the survey.
	
	function elementSupportsAttribute(element, attribute) {
		  var test = document.createElement(element);
		  if (attribute in test) {
		    return true;
		  } else {
		    return false;
		  }
		};

	function setupTextareaPlaceholder()
	{
		if (!elementSupportsAttribute('textarea', 'placeholder')) {
			
			$j('[placeholder]').focus(function() {
				  var input = $j(this);
				  if (input.val() == input.attr('placeholder')) {
				    input.val('');
				    input.removeClass('placeholder');
				  }
				}).blur(function() {
				  var input = $j(this);
				  if (input.val() == '' || input.val() == input.attr('placeholder')) {
				    input.addClass('placeholder');
				    input.val(input.attr('placeholder'));
				  }
				}).blur().parents('form').submit(function() {
				  $j(this).find('[placeholder]').each(function() {
				    var input = $j(this);
				    if (input.val() == input.attr('placeholder')) {
				      input.val('');
				    }
				  })
				}); 
		}
	}

	Event.observe(window, "load", function(){ 
		addGAToDownloadLinks();

		if($j('#nav > li.active')){
			$j('#hidden-secondary-menu').html($j('#nav > li.active').find("ul").html());
		}
		
		if ($j('#nav > li.active').length == 0)
		{
			//$j('#topNav').css("min-height",'38px');
		}
		else //if ( $j('#topNav ul.active').height() > 38 )
		{
			//$j('#topNav').css("min-height",'72px');
			
		}

		if($j('.tabbedContainer > ul > li > a')){
			$j('.tabbedContainer > ul > li > a').attr('aria-expanded', 'false');
		}
		if ( $j('.tabbedContainer > ul > li > a.active').length == 0)
		{
			$j('.tabbedContainer > ul > li:first > a').addClass('active');
			$j('.tabbedContainer > ul > li:first > a').attr('aria-expanded', 'true');
			$j('.tabbedContainer > ul > li:first > a').parent().next().find('a').addClass('leftShadow');
			$j ( $j('.tabbedContainer > ul > li:first > a').attr('href') ).show();
		}
		else if ( $j('.tabbedContainer > ul > li > a.active').length == 1 )
		{
			$j ( $j('.tabbedContainer > ul > li> a.active').attr('href') ).show();
			$j('.tabbedContainer > ul > li> a.active').attr('aria-expanded', 'true');
		}
		
		$j('.tabbedContainer > ul').append('<div class="clear"></div>');
		
		$j('.tabbedContainer > ul > li > a').click(function() {
			var containerId = $j(this).parent().parent().parent().attr('id');
			var targetId = $j(this).attr("href");
			
			$j('#' + containerId + ' > ul > li > a').removeClass('active').removeClass('rightShadow').removeClass('leftShadow');
			$j('#' + containerId + ' > ul > li > a').attr('aria-expanded', 'false');
			$j(this).addClass('active');
			$j(this).attr('aria-expanded', 'true');
			$j(this).parent().prev().find('a').addClass('rightShadow');
			$j(this).parent().next().find('a').addClass('leftShadow');			
			$j('#' + containerId + ' > div.content').hide();
			$j('#' + containerId + ' > div' + targetId +  '.content').show();
		});

		setupTextareaPlaceholder();
		
		var restrictedContent = "<div class='notification'>"+
							"<p><strong>You are restricted to READ-ONLY access for this moduke.<br\>"+
							"Please contact us at <strong>888 CalPERS</strong> (or <strong>888</strong>-225-7377) for assistance.</p>"+
							"</div>";
		
		/** SSN input field format **/
		$j('input.ssn').on('keyup', function(){
		   var val = this.value.replace(/\D/g, '');
		   var newVal = '';
		    if(val.length > 4) {
		        this.value = val;
		    }
		    if((val.length > 3) && (val.length < 6)) {
		        newVal += val.substr(0, 3) + '-';
		        val = val.substr(3);
		    }
		    if (val.length > 5) {
		        newVal += val.substr(0, 3) + '-';
		        newVal += val.substr(3, 2) + '-';
		        val = val.substr(5);
		    }
		    newVal += val;
		    this.value = newVal;   
		});		
		
		$j( " .error" ).focus();
		
		$j('.error > div > ul > li > a').each(function() {
			search = $j(this).attr("href");
			if(search != null && search.indexOf("#") >= 0){
				search = search.replace("#","");
				$j(this).attr("href", "#" + $j("input[name*='" + search + "'], select[name*='" + search + "'], textarea[name*='" + search + "']  ").attr("id"));
			}
		});
	}); 		

	Psr.Request = Class.create({
		initialize : function(url, options){
			if( options.method && options.method.toUpperCase() == 'POST' ){
				options.parameters = options.parameters || {};
				options.parameters.psrFormToken='${SESSION_FORM_TOKEN_KEY}';
			}
			new Ajax.Request(url, options);
		}
	});

	function closeSurvey()
	{
		dismissSurvey();
		$j('#surveyPrompt').remove();
		if(surveyTriggeredElement != null){
			location.href=surveyTriggeredElement.attr("href");
		}
	}

	function dismissSurvey()
	{
		$j.post(
				"<f:url value='/ept/home/survey.html'/>",
				{ surveyName: "${surveyData.name}" } );
	}

	function takeSurvey()
	{
		dismissSurvey();
		$j('#surveyPrompt').remove();					
		$j.post(
			"${_survey_get_url}",
			{ formId: "<c:out value='${surveyData.surveyId}'/>"} )				
				.done(function(data) 							
					{						
						formContent = "<form id='surveyForm' action='${_survey_save_url}' method='post'>" + data + "<input type='hidden' name='param' value='${surveyData.param}'/><input type='hidden' name='calpersId' value='${nav_participantContext.calpersId}'/><input type='hidden' name='tealeafSessionId' value='<c:out value='${surveyData.tealeafSid}'/>'/></form>";

						Ept.createSimpleDialog(
								{
									noHeader: true,
									closeButton: true,	
									dialogButtonBorder: false,									
									bodyText: formContent,
									width:'1000',
									buttons: 						
									[
										{
											'Submit Survey': {
												"alt":"Submit Survey",
												"title":"Submit Survey",
												"class":"mainButton",								
												"click":function() {
													$j('.dialog-close').trigger('click');
													
													$j.post(
														"${_survey_save_url}",
														$j( "#surveyForm" ).serialize()
														).done(function(data) {
															window.setTimeout(function(){

																Ept.createSimpleDialog(
																		{
																			noHeader:true,	
																			closeButton: true,								
																			bodyText: data,
																			centerContent:true,
																			dialogButtonBorder: false,
																			width:'600',
																			buttons: 						
																				[
																					{
																						'Close Survey': {
																							"alt":"Click to close",
																							"title":"Click to close",
																							"class":"mainButton",								
																							"click":function() {
																								currentDialog.dismissDialog();
																								if(surveyTriggeredElement != null){
																									location.href=surveyTriggeredElement.attr("href");
																								}
																							}
																						}
																					}
																				]																			
																																										
																		});	
																},100);
															});
												}
											}
										},	
										{
											'Cancel Survey': {
												"alt":"Click to close",
												"title":"Click to close",								
												"click":function() {
													$j('.dialog-close').trigger('click');
													if(surveyTriggeredElement != null){
														location.href=surveyTriggeredElement.attr("href");
													}
												}
											}
										}
									]					
								});		
							
							$j('.underlay').css('position','absolute');		
							$j('.underlayer').css('height', $j( document ).height() );
																					
							$j(window).resize(function() {
								$j('.underlayer').css('height', $j( document ).height() );
								$j('.underlayer').css('width', $j( document ).width() );
							});
							$j(document).scrollTop(0);	
							setupTextareaPlaceholder();								
					});

	}
