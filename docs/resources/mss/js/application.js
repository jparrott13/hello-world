/**
 * psrJsLibrary
 *
 * This file contains common javascript used by the PSR application.
 */
	
/**
 * dropdownChange
 *
 * This function handles dependency dropdown change event
 */
function dropdownChange(parentElementName, childElementName, childSelectedValue)
{			
	var parentElement = $(document.getElementsByName(parentElementName)[0]);
	var childElement = $(document.getElementsByName(childElementName)[0]);

	if(!parentElement || !childElement)
		return;	

	try
	{
		var parentValue = $F(parentElement);
		var optionName = parentElementName.replace(/\[/gi, "_").replace(/\]/gi, "_").replace(/\./gi, "_") + "_" + parentValue;
		var childOptions = window[optionName];

		if( childOptions && childOptions.length > 0 )
		{
			childElement.options.length = childOptions.length + 1;
			childElement.options[0] = new Option("", "");
			
			for( var i = 1; i <= childOptions.length ; i++)
			{
				var optionToDisplay = childOptions[i -1];
				childElement.options[i] = new Option(optionToDisplay.text, optionToDisplay.value);
				
				var isOptionSelected = ( childSelectedValue ==  optionToDisplay.value );
				childElement.options[i].selected = isOptionSelected;
			}
		}
		else
		{
			childElement.options.length = 1;
			childElement.options[0] = new Option("", "");
		}
	}
	catch( error )
	{
		childElement.options.length = 1;
		childElement.options[0] = new Option("", "");
	}
	
}

/**
 * dropdownChange by JQuery.
 * This method supports array element names and the above prototype query doesn't work.
 * All this method replaces the array char ([) by (_) to get the DDL option elements.
 *
 * This function handles dependency dropdown change event
 */
function dropdownChangeByJQuery(parentElementName, childElementName, childSelectedValue)
{			
	var parentElement = $j('select[name="' + parentElementName + '"]').first();
	var childElement = $j('select[name="' + childElementName + '"]').first();
	if(!parentElement || !childElement)
		return;	

	try
	{
		var parentValue = $j(parentElement).val();
		var optionName = parentElementName.replace(/\[/gi, "_").replace(/\]/gi, "_").replace(/\./gi, "_") + "_" + parentValue;
		var childOptions = window[optionName];

		if( childOptions && childOptions.length > 0 )
		{
		    $j(childElement).find('option').remove().end().append( new Option("","") );
			for( var i = 1; i <= childOptions.length ; i++)
			{
				var optionToDisplay = childOptions[i -1];
				$j(childElement).append(new Option(optionToDisplay.text, optionToDisplay.value));
				
				var isOptionSelected = ( childSelectedValue ==  optionToDisplay.value );
				$j(childElement).val(childSelectedValue);
			}
		}
		else
		{
			$j(childElement).find('option').remove().end().append( new Option("","") );
		}
	}
	catch( error )
	{
		$j(childElement).find('option').remove().end().append( new Option("","") );
	}
	
}

/**
 * The following variables are used by the calendar popup.
 */
var cal = new CalendarPopup();
var cal1xx = new CalendarPopup();
cal1xx.showYearNavigation();
cal1xx.showYearNavigationInput();
var dtCh= "/";
var minYear=1900;
var maxYear=2100;

/**
 * Field registries to keep fields.
 * ===============
 *
 */
var FieldRegistry = Class.create({
	initialize: function() {
		this.fields = new Array();
 	 },
 	 add :function(e)
 	 {
 	 	this.fields[this.fields.length] = e;
 	 },
	 removeAllFromDom: function() {	 	
	 	this.fields.each(function (e)
	 	{
	 		Try.these
	 		(
	 			function(){e.remove();}
	 		);
	 	});
	 }
});

//instance to remove hidden fields
var hiddenFieldRegistry = new FieldRegistry();

/**
 * selectAllCheckboxes
 * ===============
 * Selects all checkboxes in a list panel.  This function is to be used when multiple list panels
 * exist on one page.  Use the default function selectAllCheckboxesDefault when there is only one 
 * list panel with checkboxes.
 *
 * Parameters
 * ----------
 * in     String fieldName - Field name of the checkboxes to be selected
 * in     Boolean isChecked - Current value of checkboxes (true if checked, false if unchecked) 
 *
 * Returns: None.
 */
function selectAllCheckboxes(fieldName, isChecked) {
	$$('input[type="checkbox"]').each(function(e){ if(!e.disabled && e.name == fieldName) e.checked = isChecked });
}

/**
 * Registering a select all behavior to a list of controls("Select All" links).
 * This method is preferred over "selectAllCheckboxesDefault" and "SetAllCheckBoxes" as
 * the method contains private selection control variable and can be used multiple times
 * in a page.
 * 
 * ===============
 * Register onclick event for the passed in list of control IDs to set all checkboxes
 * with the field name equals to the passed in fieldName.
 * 
 * Example for a page with a check box called "month", controlled by two "Select All" link with ID "selectAll1",
 * and "selectAll2":
 * 
 * attachSelectAllBehavior('month','selectAll1','selectAll2');
 * 
 * Parameters
 * ----------
 * in     String fieldName - Field name of the checkboxes to be selected
 * in     var arg list of controls IDs ("Select All" links)
 *
 * Returns: None.
 */
function attachSelectAllBehavior(fieldName) {
	var selectAllCheckboxesFlag = false;
	var ctrlArgs = $A(arguments);
	ctrlArgs.shift();
	ctrlArgs.flatten().each(function(ctrl){
		Event.observe($(ctrl),'click', function(){
			selectAllCheckboxesFlag = !selectAllCheckboxesFlag;
			selectAllCheckboxes(fieldName, selectAllCheckboxesFlag);
		});
	});
}

/**
 * selectAllCheckboxes
 * ===============
 * Selects all checkboxes in a list panel.  This function is to be used when there is only one 
 * list panel with checkboxes.  Use the default function selectAllCheckboxes when multiple 
 * list panels exist on one page.  
 *
 * Parameters
 * ----------
 * in     String fieldName - Field name of the checkboxes to be selected
 * in     Boolean isChecked - Current value of checkboxes (true if checked, false if unchecked) 
 *
 * Returns: None.
 */
var _selectAllCheckboxesFlag_ = false;
function selectAllCheckboxesDefault(fieldName) {
	_selectAllCheckboxesFlag_ = !_selectAllCheckboxesFlag_;
	selectAllCheckboxes(fieldName,_selectAllCheckboxesFlag_);
}

/**
 * SetAllCheckBoxes
 *
 * This script selects all checkboxes on a list.
 */
function SetAllCheckBoxes(FormName, FieldName, CheckValue)
{
	if(!document.forms[FormName])
		return;
	var objCheckBoxes = document.forms[FormName].elements[FieldName];
	if(!objCheckBoxes)
		return;
	var countCheckBoxes = objCheckBoxes.length;
	if(!countCheckBoxes)
		objCheckBoxes.checked = CheckValue;
	else
		// set the check value for all check boxes
		for(var i = 0; i < countCheckBoxes; i++)
			objCheckBoxes[i].checked = CheckValue;
}

/**
 * submitToExecute
 * ===============
 * Append pageAction execution token and submit the passed in form. Optionally,
 * additional paremters can be passed in to valuePairs as hash or associated arrays.
 *
 * Parameters
 * ----------
 * in     formChild - form to submit to or a child element of a form. If a child element is passed in, the first form parent 
 *					  will be used to append fields
 * in     pageActionExecute - page action execution token
 * in     valuePairs - key value pairs of hidden field to be append. this can be an associated array or hash object.
 *
 * Returns: None
 */
function submitToExecute(formChild, pageActionExecute, valuePairs)
{

	var f = $(formChild);
	if(pageActionExecute != null && pageActionExecute != "" && f != null)
	{
		if(valuePairs != null)
		{
			appendHiddenFields(f, valuePairs);
		}	
		appendHiddenField(f, pageActionExecute, "execute", true);
	}
}

/**
 * submitToExecuteByField
 * ===============
 * Another name for submitToExecute. This is leave for backward compatibility.
 * This method is exactly the same as invoking submitToExecute.
 *
 * Parameters
 * ----------
 * in     formChild - form to submit to or a child element of a form. If a child element is passed in, the first form parent 
 *					  will be used to append fields
 * in     pageActionExecute - page action execution token
 * in     valuePairs - key value pairs of hidden field to be append. this can be an associated array or hash object.
 *
 * Returns: None
 *
 */
function submitToExecuteByField(field, pageActionExecute, valuePairs)
{
	submitToExecute(field, pageActionExecute, valuePairs);
}

/**
 * appendHiddenFields
 * ===============
 * Append an hidden field to a form,  and optionally submitting the form. The method also take 
 * child element of a form. In case if a child element is passed in, the function will
 * then look up the parent form and operate on the it.
 *
 * Parameters
 * ----------
 * in     formChild - form to submit to or a child element of a form. If a child element is passed in, the first form parent 
 *					  will be used to append fields
 * in     valuePairs - key value pairs of hidden field to be append. this can be an associated array or hash object.
 * in     isSubmitForm - decide if form should be submitted after appending hidden fields.
 *
 * Returns: None
 */
function appendHiddenFields(formChild, valuePairs, isSubmitForm)
{
	if(valuePairs == null)
		return;
	
	function appendHiddenFieldInternal(f, args)
	{
		var name = args.name;
		var value = args.value;
		if(f != null && name != null && name != "")
		{
			var hiddenField = createHiddenField(name,value) 
			f.appendChild(hiddenField);
			hiddenFieldRegistry.add(hiddenField);
		}
	};
	$H(valuePairs).each(function (entry){		
		doWithForm(formChild, 
			{
				'execute': appendHiddenFieldInternal,
				'args' : {'name': entry.key, 'value': entry.value},
				'isSubmitForm' :isSubmitForm
			}
		);	
	});
}

/**
 * Craetes a hidden field by given name and value.
 */
function createHiddenField(name, value)
{
	var hiddenField = document.createElement('input'); 
	hiddenField.setAttribute('type', 'hidden');
	hiddenField.setAttribute('name', name);
	hiddenField.setAttribute('value', value);
	return hiddenField;
}

/**
 * appendHiddenField
 * ===============
 * Convenience method for appendHiddenFields.
 *
 * Parameters
 * ----------
 * in     formChild - form to submit to or a child element of a form. If a child element is passed in, the first form parent 
 *					  will be used to append fields
 * in     name - name of hidden field
 * in     value - value of hidden field
 * in     isSubmitForm - decide if form should be submitted after appending hidden fields.
 *
 * Returns: None
 */
function appendHiddenField(formChild, name, value, isSubmitForm)
{
	var newHash = {};
	newHash[name] = value;
	appendHiddenFields(formChild, newHash, isSubmitForm);
}

/**
 * callCalendarPopup
 * ===============
 * This is an internal architecture method used by the Date calendar popup.
 * If the associated text field is disabled or read-only, the calendar will not
 * pop up. 
 *
 * Parameters
 * ----------
 * in     String FieldName - Field ID of the associated text field
 * in     String AnchorName - ID of the calendar link  
 *
 * Returns: None.
 */
function callCalendarPopup(FieldName, AnchorName) {
   if (document.getElementById(FieldName).disabled == false && 
       document.getElementById(FieldName).readOnly == false) {
      var cal_0=new CalendarPopup();
      cal_0.showYearNavigation();
      cal_0.showYearNavigationInput();
      cal_0.select(document.getElementById(FieldName),AnchorName,"MM/dd/yyyy"); 
   } else { 
      return false; 
   } 
}

/**
 * callCalendarPopup
 * ===============
 * This is an internal architecture method used by the Date calendar popup.
 * If the associated text field is disabled or read-only, the calendar will not
 * pop up. 
 *
 * Parameters
 * ----------
 * in     String FieldName - Field ID of the associated text field
 * in     String AnchorName - ID of the calendar link  
 * in 	  String StartDateRange - All dates before this date (including this date) are disabled
 * in 	  String EndDateRange - All dates after this date (including this date) are disabled
 * Returns: None.
 */
function callCalendarPopup(FieldName, AnchorName, StartDateRange, EndDateRange) {
   if (document.getElementById(FieldName).disabled == false && 
       document.getElementById(FieldName).readOnly == false) {
	  var cal_0=new CalendarPopup();
      cal_0.showYearNavigation();
      cal_0.showYearNavigationInput();
      
      if (StartDateRange != "")
      {
    	  cal_0.addDisabledDates(null, StartDateRange);  
      }

      if (EndDateRange != "")
      {
    	  cal_0.addDisabledDates(EndDateRange, null);  
      }
      cal_0.select(document.getElementById(FieldName),AnchorName,"MM/dd/yyyy"); 
   } else { 
      return false; 
   } 
}

/**
 * imposeMaxLength
 * ===============
 * This method is used to impose the max length property for a text area.
 * user will not be able to enter more than maxLen number of characters in text area.
 *
 * Parameters
 * ----------
 * in     event - event for which the method is called.
 * in     maxLen - max number of chars user can enter.
 * in     object - object on which the restriction is imposed.
 * Returns: None.
 */
function imposeMaxLength(event,maxLen,object)
{
	if(object.value.length > maxLen)
	{	
		var newText=object.value.substring(0,maxLen);	
		object.value=newText;			
		return object.value;
		
	}
	else	
	{		
		return(object.value.length < maxLen);
	}
}
/**
 * submitForm
 * ===============
 * If passed in field is a form, submit the form. Otherwise look up the parent form and submit it.
 *
 * Returns : None
 */
function submitForm(field)
{
	doWithForm(field, {isSubmitForm : true});
}

/**
 * doWithForm
 * ===============
 * If passed in field is a form, command object is applied to the form. Otherwise callback will
 * be applied to the parent form of the passed in field will be look up. 
 *
 * Parameters:
 * in     field - string or dom object to find parent form for.
 * in	  command - object contains execute method, args, and optionally isSubmitForm attribute. 
 *
 * Returns : None
 */
function doWithForm(field, command)
{
	if(!command)
		return;
		
	var f = findForm(field);
	
	if(command.execute)
	{
		command.execute(f, command.args);
	}
	if(command.isSubmitForm)
	{
		f.submit();
	}
}

/**
 * findForm
 * ===============
 * If passed in field is a form, return the form. Otherwise look up the parent form and return it.
 * If nothing is found, return null.
 */
function findForm(field)
{
	var f = $(field);
	var form = null;
	if(f.tagName === 'FORM')
	{
		form = f;
	}
	else
	{
		f.ancestors().each(function(e){
			if(!form && e.tagName ==='FORM') {
				form = e;
			}
		});
	}
	
	return form;
}


/**
 * fixIeSelects
 * ===============
 * Fixes selects for Internet Explorer to emulate Firefox
 *
 * Parameters: None.
 *
 * Returns: None.
 */
function fixIeSelects() {
$$('select').invoke('observe', 'mouseover', function(e) {
	e.stop();
	var dmr;
	var smallWidth=this.clientWidth;
	this.style.visibility="hidden";
	this.style.width="auto";
	var bigWidth=this.clientWidth;
	this.style.width=smallWidth;
	this.style.visibility='visible';
	if(this.style.display==null){this.style.display='static';}
	var defaultpos=this.style.position;
	if(this.style.marginRight==null){
		dmr=0;
	}
	else{
		dmr=this.style.marginRight;
	}

	if(bigWidth>smallWidth){
		this.style.width=bigWidth;
	   	this.style.marginRight="-"+(bigWidth-smallWidth);
		if(this.style.position!="absolute") {
			this.style.position="relative";
		}
	}

}
).invoke('observe', 'mouseout', function(e) {
	if (window.event.toElement != null) {
		this.style.width=200;
		this.style.marginRight=0;
		this.style.position="relative";
	}
	else return;
}
).invoke('observe', 'change', function(e) {
	this.style.width=200;
			this.style.position="relative";
			this.style.marginRight=0;
			this.onmouseout=function(){
				this.style.width=200;
				this.style.position="relative";
				this.style.marginRight=0;
			}
}
).invoke('observe', 'click', function(e) {
	this.onmouseout=function(){}
}
).invoke('observe', 'blur', function(e) {
	this.style.width=200;
	this.style.position="relative";
	this.style.marginRight=0;
	this.onmouseout=function(){
		this.style.width=200;
		this.style.position="relative";
		this.style.marginRight=0;
	}
});
}

/**
 * HtmlControlTransformer
 * ===============
 * javascript object that will transform HTML element to readonly/disable fashion. Note 
 * this script only make client side control appear to be readonly. Server side should be 
 * properly protected.
 * Example usage
 *			<script>
 *   			Event.observe(window,'load',function(a){
 *   				var t = new HtmlControlTransformer();
 *   				t.apply();
 *   			});
 *   		</script>
 *
 * Internal variable like includeInput, includeSelect, includeTextArea, includeButton can be 
 * altered to provide custom behavior.
 * In addition, the apply() method takes an optional element ID parameter that will restrict 
 * the read only effect to be within a parent element. 
 */
var HtmlControlTransformer = Class.create({
	initialize: function() {
	    this.includeInput = true;
	    this.includeSelect = true;
	    this.includeTextArea = true;
	    this.includeButton = true;
	    this.hide = "";
 	 },
	 apply: function(restrictParentId) {	 	
	 	var selector = "";
	 	if(restrictParentId != null)
	 		selector = '#' + restrictParentId + ' ';
	 	
	 	function createSelector(type){
	 		//skips any element with css class skipReadonlyTransform
	 		return selector + type + ':not(.skipReadonlyTransform)';
	 	}
	 	
	 	function inputToLabel(e){
	 		var labelField = document.createElement('label'); 
			$(labelField).insert(e.getValue());
			e.replace($(labelField));
	 	}
	 	
	 	function selectToLabel(e){
			if(e.options){
				var labelField = document.createElement('label'); 
				var index = e.selectedIndex;
				var toWrite = e.options[index].text;
				$(labelField).insert(toWrite);
				e.replace($(labelField));
			}
		}
	 	
	 	if(this.includeInput){
		 	//hide date input image
		 	$$(createSelector('a')).each(function(e){
				if(e.id != null && e.id.match('anchor_[\\d]+'))
					e.hide();
			});
		 	var includeButton = this.includeButton;
		 	$$(createSelector('input')).each(function(e){			
				if (e.type === 'text')
					inputToLabel(e);
				else if(e.type === 'button' || e.type ==='submit' || e.type === 'reset')
				{
					if(includeButton) e.hide();
				}
				else if( e.type !== 'hidden' )
					e.disable();
			});
		}
		if(this.includeSelect){
			$$(createSelector('select')).each(function(e){
					selectToLabel(e);
			});
		}
		if(this.includeTextArea){
			$$(createSelector('textarea')).each(function(e){
					inputToLabel(e);
			});
		}
		
		if(this.hide != null) {
			$A(this.hide.split(',')).each(function(e){
				var e1 = $(e.strip());
				if(e1)
					e1.hide();
			});
		}
	 }
});

/**
 * SessionTimer
 * ===============
 * JavaScript timer for a user session.
 *
 */
var SessionTimer = Class.create({
	initialize: function(args)
	{		
		this.refreshTime 	=(args.refreshTime > 0)? args.refreshTime : 5*60;
		this.delta 			=(args.delta > 0) ? args.delta : 3;
		this.logoutWaitTime =(args.logoutWaitTime > 0) ? args.logoutWaitTime : 60;
		//reduce time by logout time
		args.time -= this.logoutWaitTime ;
		this.time 			=(args.time > 0)? args.time : 15*60;
		this.sessionUrl 	= args.sessionUrl;
		this.logoutUrl 		= args.logoutUrl;
		this.ept			= (args.ept == null) ? false : args.ept;
		if ( this.ept )
		{
			this.time -= 30;
		}
	},
	start : function()
	{		
		var _that = this;
		var count = 0;
		var refreshCount = 0;
		var confirmBox;
		var logoutWaitExecuter = null;
		var savedDialogOptions;
		new PeriodicalExecuter(
			function(pe)
			{
				count += _that.delta;
				refreshCount += _that.delta;					
				if(count >= _that.time && confirmBox == null)
				{	
					if ( _that.ept )
					{					
						if ( currentDialog != null )
						{
							savedDialogOptions = currentDialog.options;
							currentDialog.dismissDialog();
						}
						
						Ept.createSimpleDialog(
							{
								headingText:'my|CalPERS Session Time-out',
								bodyText:'<p>For your security, your session will time-out if there is no additional activity.\n\nIf you would like to continue your session, select OK.</p>',
								width:'500',
								closable:false,
								closeFunction:function() {
									_actioned();
								},
								showFunction:function() {
									var logoutWaitCount = 0;
									confirmBox = this;
									logoutWaitExecuter = new PeriodicalExecuter(											
											function(_pe)
											{												
												logoutWaitCount += _that.delta;
												if(logoutWaitCount >= _that.logoutWaitTime)
												{													
													pe.stop();
													_pe.stop();													
													_that.logoutUrl();
												}	
											}
											,_that.delta);
								},
								buttons:
									[
										{
											'OK': {
												"alt":"Click here to continue your session",
												"title":"Click here to continue your session",
												"class":"mainButton",
												"click":function() {
													confirmBox = null;
													if(logoutWaitExecuter)
													{
														logoutWaitExecuter.stop();
													}
													_actioned();
													currentDialog.dismissDialog();
													if ( savedDialogOptions != null )
													{
														savedDialogOptions.activator = null;														
														Ept.createSimpleDialog(savedDialogOptions);														
														savedDialogOptions = null;
													}
												}
											}
										}/*,		
										{
											'Cancel': {
												"alt":"Click to close",
												"title":"Click to close",								
												"click":function() {
													$j('.dialog-close').trigger('click');
												}
											}
										}*/
									]
							});	
						
					}
					else
					{
						confirmBox = new ConfirmationDialog(
						{						
							message : 'For your security, your session will time-out if there is no additional activity.\n\nIf you would like to continue your session, select OK.',
							messageTitle : 'my|CalPERS Session Time-out',
							showCancel:false,
							okTitle :'OK',
							onOk: function(_onOk)
							{
								if(_onOk) _onOk();
								confirmBox = null;
								if(logoutWaitExecuter)
								{
									logoutWaitExecuter.stop();
								}
								_actioned();
							},
							onShow : function()
							{
								var logoutWaitCount = 0;
								logoutWaitExecuter = new PeriodicalExecuter(
									function(_pe)
									{
										logoutWaitCount += _that.delta;
										if(logoutWaitCount >= _that.logoutWaitTime)
										{
											confirmBox = null;
											pe.stop();
											_that.logoutUrl();
										}	
									}
									,_that.delta);
							}
						});
						confirmBox.show();
					}
				}
			}
			, _that.delta);		
		
		function _actioned(e){
			count = 0;
			if(refreshCount  >=  _that.refreshTime)
			{
				new Ajax.Request(_that.sessionUrl, {method: 'get'});
				refreshCount = 0;
			}	
		}
		
		Event.observe(window,'click', _actioned);
		Event.observe(window,'keyup',_actioned);
	}
});




/**
 * calcDateDiff
 * ===============
 *
 * Parameters: 
 * in varFromDate = starting date of date range (i.e. date of birth used in calculation)
 * in varToDate = ending date of date range (i.e. effective date, current date, etc.)
 * in numberOfDecimalPlaces = number of decimal places to round the returned calculated value
 *
 * Returns: dYears = years spanned between dates precision based on parameter defaulting to a tenth of a year.
 */
function calcDateDiff(varFromDate, varToDate, numberOfDecimalPlaces)
{
   var dtTo;
   var dtFrom;
   var dYears;
   var DAYS_PER_YEAR = 365.25;
   var MILLS_PER_DAY = 86400000;

   dtFrom = new Date(varFromDate);
   dtTo = new Date(varToDate);
   

   // if as of date is on or after born date
   if ( dtTo >= dtFrom )
      {
         dYears = (dtTo.getTime() - dtFrom.getTime())/MILLS_PER_DAY/DAYS_PER_YEAR;
      }
   else
      return false;
   
   if (numberOfDecimalPlaces == null) {
   		numberOfDecimalPlaces = 0;
   }
   return round(dYears, numberOfDecimalPlaces);
}


/**
 * getValueFromRadio
 * ===============
 * This method extracts value from a selected radio button of the same name. If nothing is selected
 * the method returns null.
 * Parameters:
 * in     radioName - name of radio button
 *
 */
 function getValueFromRadio(radioName)
 {
 	var returnValue = null;
 	$$('input').each(function(e)
 	{
 		if(returnValue == null && e.type === 'radio')
 		{
 			if(e.name === radioName && e.checked)
 			{
 				returnValue = e.value; 					
 			}
 		}
 	});
 	return returnValue;
 }
 
 /**
 * getValueFromSelect
 * ===============
 * This method extracts value from a selected drop down of the same id. 
 * Parameters:
 * in     selectWidgetId - id of the select widget
 */
function getValueFromSelect(selectWidgetId)
{
	var s = $(selectWidgetId);
	return s.options[s.selectedIndex].value;
}

/**
 * showHideDiv
 * ===========
 * This method displays or hides a div depending on the state of a checkbox. 
 * Parameters:
 * in	box - checkbox id
 * in	id - div id
 */ 
 function showHideDiv(box, id) 
 { 
	//document.getElementById(id).style.display = document.getElementById(box).checked ? 'block' : 'none';
	if(document.getElementById(box).checked)
	{
		Psr.show(id);
	}
	else
	{
		Psr.hide(id);
	}
 }
 
/**
 * showHideDiv
 * ===========
 * This method displays or hides a divs depending on the state of a radio button. 
 * Parameters:
 * in	radio - radio button id
 * in	div1 - id of first div
 * in	div2 - id of second div
 */ 
 function showHideDiv(radio, div1, div2)
 {
 	//document.getElementById(div1).style.display = document.getElementById(radio).checked ? 'block' : 'none';
 	//document.getElementById(div2).style.display = document.getElementById(radio).checked ? 'none' : 'block';
 	if(document.getElementById(radio).checked)
 	{
 		Psr.show(div1);
 		Psr.hide(div2);
 	}
 	else
 	{
 		Psr.hide(div1);
 		Psr.show(div2);
 	}
 	
 }
 
/**
 * round
 * ===============
 * This method formats decimal numbers to the number of decimal places supplied.
 * Defaults to 3 if number of decimal is not specified. 
 *
 * Parameters:
 * in     number - number
 * in     numberOfDecimal - number of decimal places
 *
 */
function round(number, numberOfDecimal)
{
 	if(numberOfDecimal == null)
 		numberOfDecimal = 3;
 	
 	var n = number;
 	n = Math.round(n * Math.pow(10,numberOfDecimal))/Math.pow(10,numberOfDecimal);
    n = n + "";
    var indexOfDecimal = n.indexOf('.');
    
    function fillZeros(_someNumber, _numberOfDecimal)
    {
    	var result = _someNumber;
    	for(var index = result.length; index < _numberOfDecimal; ++index )
        	result += '0';
        return result;
    }
    
    if(numberOfDecimal > 0)
    {
	    if(indexOfDecimal == -1)
	    {
	       	n = n + '.' + fillZeros('', numberOfDecimal);
	    }
	    else
	    {
	       	var results = n.split('.');
	       	var integralPart = results[0];
	       	var decimalPart = results[1];
	       	decimalPart = fillZeros(decimalPart,numberOfDecimal);
	       	n = integralPart + "." + decimalPart;	
	   }
   }
   
   return n;
}

/**
 * onPageEnterPressed
 * ===============
 * This method setups listeners to subscribe on the enter key up event to fire
 * a call back.
 *
 */
function onPageEnterPressed(args)
{
	var _args  = args;  
    var handler = function(e)
    {
    	//if the 
    	//passed in action closure does a submit, target check is necessary because in IE when focus is on 
    	//submit or button(that submits), two form submission will be generated. 
        if(e.keyCode === 13 && e.target.type !== 'submit' && e.target.type !== 'button')
	    {
	    	if(_args.action)
	    	{
	    		_args.action(e);
	    	}
	    	else if(_args.pageActionExecute)
	    	{
	    		submitToExecute(_args.form, _args.pageActionExecute);
	    	}
	    	else if(typeof _args == 'function')
	    	{
	    		_args(e);
	    	}
	    }
	}; 
	if(Prototype.Browser.IE)
	{
		//this works in IE on the entire body
    	$('pageBody').observe('keyup',handler);
	}
	else
	{
		Event.observe(window, 'keyup', handler);
	}
}

/**
 * ConfirmationDialog
 * ===============
 * This object creates a modal dialog. If the JQuery library if avaliable, 
 * this class will use JQuery to create a Dialog. Otherwise the standard
 * HTML confirm box is used.
 * 
 * The dialog is created using SimpleModal, a jQuery extension, together with
 * 'aria' markup attributes to help screen readers read the contents of the
 * dialog when it is displayed to the user.
 *
 */
var ConfirmationDialog = Class.create({
	initialize : function(args)
	{
		this.messageTitle = args.messageTitle;
		this.message = args.message;
		this.onOk = args.onOk;
		this.onCancel = args.onCancel;
		this.onShow = args.onShow;
		this.showCancel = (args.showCancel == null) ? true : args.showCancel;
		this.okTitle = args.okTitle || 'Ok';	
		this.cancelTitle = args.cancelTitle || 'Cancel';	
		this.divId = args.divId || 'confirmationDiv';
		var $j = jQuery;				
		$j('#dialogDiv').attr("aria-hidden",true);
	},
	show : function() { 
		var _that = this;
		//invoke onshow
		if(_that.onShow)_that.onShow();
		
		Try.these(
		//JQuery dialog
		function() {
			var $j = jQuery;
			$j('#dialogDiv').html("<div id='dialogTitle' class='ui-dialog-titlebar ui-widget-header'><h1>" + encodeHTML(_that.messageTitle) 
				+ "</h1></div><div id='dialogContent'>"
				+ "<p>" + encodeHTML(_that.message) + "</p></div>"
				+ "<div id='dialogButtons' style='align:right;'>"
				+ "</div>");
										
			//set aria hidden attribute for reader
			$j('#dialogDiv').attr("aria-hidden",false);
			
			//insert buttons with attached handlers
			var okButton = $j(document.createElement("input"));
			$j(okButton).attr("id", "dialogDiv_okButton");
			$j(okButton).attr("type", "button");
			$j(okButton).attr("value", _that.okTitle);
			$j(okButton).attr("class", "simplemodal-close");			
			//attach passed in handlers
			if(_that.onOk)
				$j(okButton).click( function(){_that.onOk();} );
			$j('#dialogButtons').html(okButton);
			
			if(_that.showCancel)
			{
				var cancelButton = $j(document.createElement("input"));
				$j(cancelButton).attr("id", "dialogDiv_cancelButton");
				$j(cancelButton).attr("type", "button");
				$j(cancelButton).attr("value", _that.cancelTitle);
				$j(cancelButton).attr("class", "simplemodal-close");			
				//attach passed in handlers
				if(_that.onCancel)
					$j(cancelButton).click( function(){_that.onCancel();} );
				$j(okButton).after(cancelButton);			
			}
			
			//show dialog using jDialog SimpleModal extension
			$j('#dialogDiv').modal({ autoResize: true, close: false });
		},		
		//Basic dialog - the standard dialog is first in the try block and will always succeed.
		//The standard browser dialog is ADA compliant and reads as expected with JAWS.
		function() {
			if(confirm(_that.message))
			{
				if(_that.onOk) _that.onOk(function(){});
			}
			else
			{
				if(_that.onCancel) _that.onCancel(function(){});
			}
		});	
	}
});

function encodeHTML(s) {
    return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;').split("'").join('&#39;');
}

/**
 * openCognosWindow
 * ===============
 * This method opens a cognos report window
 *
 */
function openCognosWindow(url, title, params)
{	
	var myurl = appendQueryParameters(url, params);
	openPopupUrl(myurl, title);
}

/**
 * appendQueryParameters
 * ===============
 * This method appends query parameters to an URL
 *
 */
function appendQueryParameters(url, params)
{	
	if(params)
	{
		try
		{
			var paramObj = params;
			if(Object.isFunction(params))
			{
				paramObj = params();
			}
					
			if(url.endsWith('&') || url.endsWith('?'))
			{
				return url + Object.toQueryString(paramObj);
			}
			else
			{
				if(url.include('?'))
				{
					return url + '&' + Object.toQueryString(paramObj);
				}
				else
				{
					return url + '?' + Object.toQueryString(paramObj);
				}
			}
		}catch(err){}
	}
	return url;
}

//Toggles hide/show of an HTML element. nodeId is the id property of the element
//to toggle - can be any single element (e.g. a field), or a grouping of elements
//like a DIV.
//This function hides elements by removing the HTML from the DOM and moving
//it to a temporary array. To show the element, the HTML is moved back from the
//array and inserted into the page at the place where an empty DIV placeholder
//element is left when the HTML is removed.
//
//If this function is called when the element is visible, the element is hidden.
//Calling it when the element is hidden toggles it back to visible.

//array used by Psr.toggle() to hold the content of page elements
//currently not visible
var Psr = (function()
{ 
	var hiddenElement = [];
	function psrHide(nodeId){
		var node = $(nodeId);
		if(node != null)
		{
			var tagName = node.tagName;
			if( tagName !== 'TR' && tagName !== 'TD')
			{
				tagName = 'div';
			}
			
			hiddenElement[nodeId] = node.outerHTML ||  $(nodeId);
			//insert placeholder empty DIV into page in place of the element to be hidden
			$(nodeId).replace('<' + tagName + ' id="' + nodeId + '_placeholder' +'"></' + tagName + '>');
		}
	}
	function psrShow(nodeId)
	{
		var node = $(nodeId);
		if(node == null)
		{
			//if node does not exist in dom (i.e. it is currently not visible), retreive from 
		    // hiddenElement and replace placeholder DIV with the stored HTML content from the array.
		    var node = hiddenElement[nodeId];
		    var placeHolder = $(nodeId + '_placeholder');
		    if( placeHolder != null)
		    {
		    	placeHolder.replace(node);
		    }
		}
	}
	var psr = 
	{
		toggle:function(nodeId){
			//if node exists in the page (i.e. it is visible), replace with placeholder DIV and move to array
			var node = $(nodeId);
			if(node != null)
			{
			    psrHide(nodeId);
			}
			else
			{
			    psrShow(nodeId);
			}
		},
		show : psrShow,
		hide : psrHide
	};
	return psr;
})();

var toggleHideShow = Psr.toggle;
var compliantHide = Psr.hide;
var compliantShow = Psr.show;

/**
* This functions toggles the PSR panel/panel like widgets and display the 
* expand and collapse icon to show either the up arrow or down
* arrow based on the current state of the following content, i.e. whether
* the content is currently visible or hidden.
* 
* The third argument is optional and is used when an onExpand or onCollapse
* event listener should be fired.
* 
* Expects urlContext to be written into each page to specify the webapp context. 
* 
*/
Psr.togglePanel = function (visibleAreaId, imageId, notifier) {
    $(visibleAreaId).toggle();
	var imageObj = $(imageId);
    if(imageObj.alt.indexOf('Expand') == 0)
    {
        imageObj.src = urlContext + '/images/btn_arrow-down.gif';
        imageObj.alt = imageObj.alt.replace(/^Expand/, 'Collapse');
        if(notifier && notifier.onExpand)
        	notifier.onExpand();
    }
    else
    {
        imageObj.src = urlContext + '/images/btn_arrow-up.gif';
        imageObj.alt = imageObj.alt.replace(/^Collapse/, 'Expand');
        if(notifier && notifier.onCollapse)
        	notifier.onCollapse();
    }
    
    return false;
}


/**
* This functions toggles the PSR panel/panel only by panelID.
* It will figure out the id of the toggle arrow trough naming convention,
* and invoke the regular Psr.togglePanel method.
* 
* The second argument is optional and is used when an onExpand or onCollapse
* event listener should be fired.
* 
* Expects urlContext to be written into each page to specify the webapp context. 
* 
*/
Psr.togglePanelById = function (panelId, notifier) {
	var panelToggleArrowId = panelId + '_toggleArrow';
	Psr.togglePanel(panelId, panelToggleArrowId, notifier);
}

/**
* This functions expands the PSR panel/panel only by panelID.
* It will figure out the id of the arrow trough naming convention,
* and invoke the regular Psr.togglePanel method.
* 
* The second argument is optional and is used when an onExpand or onCollapse
* event listener should be fired.
* 
* Expects urlContext to be written into each page to specify the webapp context. 
* 
*/
Psr.expandPanelById = function (panelId, notifier) {
    $(panelId).show();
    var imageId = panelId + '_toggleArrow';
	var imageObj = $(imageId);
    imageObj.src = urlContext + '/images/btn_arrow-down.gif';
    imageObj.alt = imageObj.alt.replace(/^Expand/, 'Collapse');
    if(notifier && notifier.onExpand)
        	notifier.onExpand();
    return false;
}


/**
* This functions expands the PSR panel/panel only by panelID.
* It will figure out the id of the arrow trough naming convention,
* and invoke the regular Psr.togglePanel method.
* 
* The second argument is optional and is used when an onExpand or onCollapse
* event listener should be fired.
* 
* Expects urlContext to be written into each page to specify the webapp context. 
* 
*/
Psr.collapsePanelById = function (panelId, notifier) {
    $(panelId).hide();
    var imageId = panelId + '_toggleArrow';
	var imageObj = $(imageId);
    imageObj.src = urlContext + '/images/btn_arrow-down.gif';
    imageObj.alt = imageObj.alt.replace(/^Expand/, 'Collapse');
    if(notifier && notifier.onCollapse)
    	notifier.onCollapse();
    return false;
}


/**
* This function is used to make an ajax request to load HTML content dynmaically.
* The supplied URL will be invoked and the region defined by the contentId will
* be replaced with the HTML that is returned.  Additional options can be passed
* and are defined below.
* 
* @ajaxUrl The url for the GET request
* @contentId The id of the region that will be replaced
* @options
*     loadMessage - A message that is displayed in the region during the load.  i.e. "Loading..."
*     errorMessage - A message that is displaed in the region in case of error  i.e. "There was a problem loading..."
*     inModal - Will open ajax content in a modal after it is loaded
*     callbackFunction - Will invoke callbackFunction on success of ajax load (after ajax request has completed)
*/
Psr.getAjaxContent = function ( ajaxUrl, contentId, options )
{
	// determine if in modal mode
	var modalMode = false;
	if (options.inModal == true)
		modalMode = true;
	
	// if not in modal mode, check for contentId div and update load message
	if (!modalMode)
	{
		// if content region doesn't exist return
		if ($(contentId) == null || $(contentId) == undefined)
		{
			return false;
		}
		 
		// update load message if set
		if (options.loadMessage != null)
		{
			$(contentId).update(options.loadMessage);
		}
	}
	
	// invoke ajax request to get html content
	new Psr.Request(ajaxUrl, {
		  method: "GET",
		  parameters: {formSubmission:false, noCache:new Date().getTime()},
		  onSuccess : function(transport) {
			  	var htmlText = transport.responseText;

			  	if (htmlText)
			  	{
			  		// if full error page was returned, find stack trace and pop response up in a modal
			  		if (htmlText.indexOf("psr.arch.exception.PsrException") > 0 || htmlText.indexOf("Unique Error ID") >0)
			  		{
			  			var errorText = $j(htmlText).find("#exceptionStackTrace").html();
			  			if(errorText == null)
			  			{
			  				errorText = $j(htmlText).find("#errorMessage").html();
			  				errorText = errorText  +   $j(htmlText).find("#uniqueErrorID").html();
			  			}
			  			modalMode=true;
			  			htmlText=errorText;
			  			$(contentId).update(options.errorMessage);
			  		}	
			  		
			  		if (modalMode)
					{
						createModalWindow({html: htmlText});
					}
					else
					{
						$(contentId).replace(htmlText);
					}
			  	}
			  	else
				{
					$(contentId).update(options.errorMessage);
				}
			  	
			  	// invoke call back function if param was passed
				if (options.callbackFunction)
				{
					if (typeof options.callbackFunction == 'function')
					{
						options.callbackFunction();
					}
				}
		  	} 
		});
}

/**
 * FieldLocker
 * ===============
 * This object helps controlling a group of input/select controls. Calling "lock" will disable
 * all input fields listed or contained in the listed elements.
 * A susequent call to "unlock" will reenable them. 
 */
var FieldLocker = Class.create({
	initialize : function(args)
	{
		this.fields = $A(args);
		this.fieldsLocked = [];
	},
	lock : function()
	{
		var _that = this;
		
		function disableField(field)
		{
			Try.these(function(){field.disable();_that.fieldsLocked.push(field);});
		}
		
		this.fields.each(function(fieldId)
		{
			var selector = '#' + fieldId + ' ';
			['input','select'].each(function(tagType)
			{
				var rawField = $(fieldId);
				if( rawField && tagType == rawField.tagName.toLowerCase())
				{
					disableField(rawField);
				}
				$$(selector + tagType).each(function(e)
				{
					disableField(e);
				});
			});
		});
	},
	unlock : function()
	{
		this.fieldsLocked.each(function(e)
		{
			Try.these(function(){$(e).enable();});
		});
	}
});

/**
 *JavaScript function to detect and prevent double submission.
 */
Psr.PreventDoubleSubmit = (function()
{
      var psrform_submitted = false;
      
      function makeDoubleSubmitWrapper(wrapperDetail)
      {
            var _wrapped = wrapperDetail.wrapped;
            var _formObject =  wrapperDetail.formObject || this;        
            var _resetFlagIfReturnFalse =  wrapperDetail.resetFlagIfReturnFalse || false; 
            
            return function()
            {
            if(psrform_submitted)                    
                  {
                        new ConfirmationDialog(
                              {
                                    messageTitle : 'Please wait',
                                    message : 'Your request is being processed.',
                                    showCancel:false,
                                    okTitle :'OK'
                              }).show();
                        return false;
                  }
                  psrform_submitted = true;
                  var oldSubmitValue = true;
                  if(_wrapped != null)
                  {
                        Try.these(
                              function()
                              {
                                    oldSubmitValue = _wrapped.apply(_formObject, arguments);
                              }
                              ,
                              function()
                              {
                                    //try to invoke function directly... but the arguments may no longer be correct.
                                    oldSubmitValue = _wrapped(arguments);
                              });
                        if(!oldSubmitValue && _resetFlagIfReturnFalse)
                        {
                              psrform_submitted = false;
                        }
                  }
                  return oldSubmitValue;
            };
      }
      
      return {
      	resetSubmitFlag : function()
      	{
      		psrform_submitted = false;
      	}
      	,
      	start : function ()
      	{
            Event.observe(window, 'load', function(e)
            {
                  $$('form').each(function(_psrForm){
                        _psrForm.onsubmit = makeDoubleSubmitWrapper({'wrapped':_psrForm.onsubmit, 'formObject':_psrForm, 'resetFlagIfReturnFalse':true}); 
                        _psrForm.submit = makeDoubleSubmitWrapper({'wrapped':_psrForm.submit, 'formObject':_psrForm, 'resetFlagIfReturnFalse':false});
                  });
            });
      	}
      };
}());


/** 
 * Display system support info in the header using a floating div over the date field. 
 */
Psr.supportInfo = {
	//properties to display in popup message - add additional properties here as needed
	//and append into the HTML below
	//initialize property values from herader.jsp before call made to initPsrSupportInfo()
	uidName : "",
	
	initPsrSupportInfo : function(){
		xOffset = 10;
		yOffset = 20;
		
		jQuery("div.psrSupportInfo").hover(function(e){							  
			jQuery("body").append("<p id='psrSupportInfo'>" +
					"UID: " + Psr.supportInfo.uidName
					+ "</p>");
			jQuery("#psrSupportInfo")
				.css("top",(e.pageY - xOffset) + "px")
				.css("left",(e.pageX + yOffset) + "px")
				.fadeIn("fast");
			},
			function(){
		    	jQuery("#psrSupportInfo").remove();
	    });

		jQuery("div.psrSupportInfo").mousemove(function(e){
			jQuery("#psrSupportInfo")
				.css("top",(e.pageY - xOffset) + "px")
				.css("left",(e.pageX + yOffset) + "px");
		});			
	}
}

function throwSyntheticEvent(target, eventType, value) {	
	var x = target;

	if ( document.createEvent ) {
        var e = document.createEvent("UIEvents");
		//e.initMutationEvent(eventType, false, false, null, 0, value, null, 0);
        e.initUIEvent("click", true, true, window, 1);
		x.dispatchEvent(e); //Do not call tlAddEvent for Gecko Browsers
		
	} else {
		var e = document.createEventObject();
		e.type = eventType;		        
		e.target = x;		        
		e.srcElement = x;		        
		e.value = value;		        
		e.result = value;
		          
		if ((typeof TeaLeaf != "undefined") && (typeof TeaLeaf.Client != "undefined") && (typeof TeaLeaf.Client.tlAddEvent != "undefined"))
		{
			TeaLeaf.Client.tlAddEvent(e); //Explicit Report to Tealeaf
		}
    }
    
}

/** 
 * Logs out
 */
function logout(logoutUrl, targetUrl) {	
	jQuery.get(logoutUrl).done(function(data) {			
			jQuery.get("/oamsso-bin/logout.pl").done(function(data) {				
				location.href = targetUrl;				
			});			
		});	
}

/** 
 * Clears Input txtboxes, Radio and Selects with empty cells
 */
function clearMyForm(formName) {
    $j(':input', '#'[formName]).not(
                    ':button, :submit, :reset, :hidden').val('')
    .removeAttr('checked').removeAttr('selected');
}

/**
 * Survey Functions 
 */
function closeSurvey(surveyElectionUrl, name)
{
	dismissSurvey(surveyElectionUrl, name, 'N');
	$j('#surveyPrompt').remove();
}

function dismissSurvey(surveyElectionUrl, name, election)
{
	$j.post(
			surveyElectionUrl,
			{ surveyName: name, surveyElection: election } );
}

function takeSurvey(surveyName, surveyElectionUrl, surveyGetUrl, surveySaveUrl, surveyId, surveyParam, calpersId, tealeafSid )
{
	dismissSurvey(surveyElectionUrl, surveyName, 'Y');
	$j('#surveyPrompt').remove();					
	$j.post(
		surveyGetUrl,
		{ formId: surveyId} )				
			.done(function(data) 							
				{						
					formContent = "<form id='surveyForm' action='" + surveySaveUrl + "}' method='post'>" + data + "<input type='hidden' name='param' value='" + surveyParam + "'/><input type='hidden' name='calpersId' value='" + calpersId + "'/><input type='hidden' name='tealeafSessionId' value='" + tealeafSid + "'/></form>";

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
												
												var is_valid = true;
												if ($j("#cb_contact") && $j("#cb_contact").attr("checked")) {
													//validation
													var invalid_messages = [];
													if ($j.trim($j("#first_name").val()).length == 0) {
														invalid_messages.push("Enter a valid First Name.");
													}
													if ($j.trim($j("#first_name").val()).length > 20) {
														invalid_messages.push("First Name cannot be greater than 20 characters.");
													}
													if ($j.trim($j("#last_name").val()).length == 0) {
														invalid_messages.push("Enter a valid Last Name.");
													}
													if ($j.trim($j("#last_name").val()).length > 30) {
														invalid_messages.push("Last Name cannot be greater than 30 characters.");
													}
													var contact_method = $j("input[name=contact_method]:checked");
													if (contact_method.length == 0) {
														invalid_messages.push("Please select a contact method.");
													}
													else if (contact_method.val() == "phone") {
														var phone_pattern = /^1?[\(\s-]{0,2}\d{3}[\)\s-]{0,2}\d{3}-?\d{4}$/;
														if (!phone_pattern.test($j.trim($j("#phone_number").val()))) {
															invalid_messages.push("Enter a valid U.S. Phone Number with ten digits.");
														}
													}
													else if (contact_method.val() == "email") {
														var email_pattern = /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
														if (!email_pattern.test($j.trim($j("#email").val()))) {
															invalid_messages.push("Enter a valid Email Address. Acceptable formats include, but are not limited to, xxxxx@xxxxx.xxx and xxxxx@xxxxx.xx.xxx.");
														}
													}
													
													// Draw the validation box
													$j(".error").remove();
													if (invalid_messages.length > 0) {
														is_valid = false;
														var validation_html = "<div class='error'>";
														for (i = 0; i < invalid_messages.length; i++) {
															validation_html += invalid_messages[i];
															validation_html += "<br>";
														}
														validation_html += "</div>";
														$j(".survey").prepend(validation_html);
														$j(".error").focus();
													}
												}
												if (is_valid) {
													$j('.dialog-close').trigger('click');
													
													$j.post(
														surveySaveUrl,
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
																							}
																						}
																					}
																				]																			
																																										
																		});	
																},100);
															});
												}
											}
										}
									},	
									{
										'Cancel Survey': {
											"alt":"Click to close",
											"title":"Click to close",								
											"click":function() {
												$j('.dialog-close').trigger('click');
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

function loadPopup()
{
	var requiredWidth=1040;
	var requiredHeight=508;
	var actualPanelHeight = $j('.panel').height() + $j('.req').height(); //required panel + main panel
	if( actualPanelHeight <= 0 ) actualPanelHeight = requiredHeight; //current known height of panel area to display
	var heightOfWindowToolbars = requiredHeight - actualPanelHeight;
	if( heightOfWindowToolbars < 0 ) heightOfWindowToolbars = 90;

	//resize before move so that window is positioned according to new size
	self.resizeTo( requiredWidth, actualPanelHeight + heightOfWindowToolbars );
	
	//check after resize if area we expect to be visible is large enough
	var adjustment = 0;
	if( $j(window).height() < actualPanelHeight ) 
	{
		adjustment = actualPanelHeight - $j(window).height(); //difference between required panel height and visible area
		self.resizeBy( 0, adjustment ); //increase to accomodate difference for toolbars, if any
	}
	
	self.moveTo(  0 ,0 );
}

//Function : createModalWindow
//Purpose    :
//This function creates a modal dialog window that displays content provided or which loads a URL
//within an iframe.
//Arguments  :
//* targetUrl : The URL to be loaded in the dialog; either targetUrl or html should be defined.
//* html : The HTML to be displayed in the dialog; either targetUrl or html should be defined.
//* dialogTitle : The title of the dialog.  No dialog will appear if one is not provided.
//* closeButtonText : The text on the close button.  By default "Close" will appear on the close button.
//* dialogWidth : The target width of the dialog.  If no width is defined then the dialog will use 90% of the parent container's width.
//* dialogHeight : The target height of the dialog.  If no width is defined then the dialog will use 90% of the parent container's height.
//* draggable : Indicates whether the user should be able to drag the dialog around.  false by default.
//* resizable : Indicates whether the user should be able to resize the dialog.  false by default.
function createModalWindow(modalOptions) {

	// default options to use when constructing the modal window
	var defaultModalOptions = {
		targetUrl : null,
		html : null,
		dialogTitle : null,
		closeButtonText : "Close",
		dialogWidth : null,
		dialogHeight : null,
		draggable : false,
		resizable : false,
		closeDialogCallback : null
	}

	// default behaviours
	var widthPercentage = .9;
	var heightPercentage = .9;

	// merge options passed in with default options
	if (typeof modalOptions == 'object') {
		modalOptions = $j.extend(defaultModalOptions, modalOptions);
	} else {
		modalOptions = defaultModalOptions;
	}
	
	var $body = $j('body');
	
	$j('body').addClass('disable-scrolling');

	// construct the dialog window
	var myDialog = $j('<div id="modalDialog"></div>')
		.html(modalOptions.html ? modalOptions.html : '<iframe style="border: 0px; " src="' + modalOptions.targetUrl + '" width="100%" height="100%"></iframe>')
		.dialog({
			autoOpen : false,
			draggable : modalOptions.draggable,
			resizable : modalOptions.resizable,
			modal : true,
			height : modalOptions.dialogHeight ? modalOptions.dialogHeight : $body.innerHeight() * heightPercentage,
			width : modalOptions.dialogWidth ? modalOptions.dialogWidth : $body.innerWidth() * widthPercentage,
			title : modalOptions.dialogTitle,
			buttons : [{
					text : modalOptions.closeButtonText,
					click : function () {
						$j(this).dialog("close");
					}
				}
			],
			close : function (event, ui) {
				$body.removeClass('disable-scrolling');
				$j(".ui-dialog").dialog().dialog('close').remove();
            	$j(window).unbind('resize', resizeHandler);
				if (modalOptions.closeDialogCallback)
				{
					modalOptions.closeDialogCallback();
				}
				
			}
		});
	myDialog.dialog('open');
	myDialog.dialog("widget").next(".ui-widget-overlay").css({"background": "black", "opacity" : .8});

	// define handler to handle resizing the dialog as appropriate when the parent window is resized
	var resizeHandler = function () {
		if (modalOptions.resizable == false) {
			myDialog.dialog("option", "width", $body.innerWidth() * widthPercentage);
			myDialog.dialog("option", "height", $body.innerHeight() * heightPercentage);
		}

	};

	// bind the handler to the resize event of the window
	$j(window).bind('resize', resizeHandler);

}

//Function : floatLeftNavigation
//Purpose  : Floats the left navigation menu such that it remains visible in the upper left corner instead of scrolling out of view.
function floatLeftNavigation() {

	// Cache lookups
	var $window = $j(window);
	var $leftNavBar = $j('#left');
	var $header = $j('#header');

	// Store the default location when not being floated
	var leftNavHome = $leftNavBar.offset().top;

	if ($header.size() == 1 && $leftNavBar.size() == 1) {
		$window.on('scroll resize', function () {
			if ($window.scrollTop() > leftNavHome) {
				$leftNavBar.css({
					"position" : "fixed",
					"top" : "0",
					"left" : $header.offset().left
				});
			} else {
				$leftNavBar.css({
					"position" : "",
					"top" : "",
					"left" : ""
				});
			}
		});
	}
}

//Function : createDataTable
//Purpose : Add DataTable funcionality to a specified table
function createDataTable(tableId, tableOptions) {

	// default options to use when creating a DataTable
	var defaultDatatableOptions = {
		fixedHeader : false,
		scrollX : false,
		searching : true,
		pageLength : 20,
		dataExportEnabled : false
	}

	// merge options passed in with default options
	if (typeof tableOptions == 'object') {
		tableOptions = $j.extend(defaultDatatableOptions, tableOptions);
	} else {
		tableOptions = defaultDatatableOptions;
	}

	var $table = $j('#' + tableId);

	if (tableOptions.dataExportEnabled) {
		$j($table.DataTable({
				lengthChange : false,
				colReorder : true,
				fixedHeader : tableOptions.fixedHeader,
				scrollX : tableOptions.scrollX,
				keys : true,
				searching : tableOptions.searching,
				pageLength : tableOptions.pageLength,
				order : [],
				dom : 'Bfrtip',
				buttons : ['excel', 'print']
			}));
	} else {
		$j($table.DataTable({
				lengthChange : false,
				colReorder : true,
				fixedHeader : tableOptions.fixedHeader,
				scrollX : tableOptions.scrollX,
				keys : true,
				searching : tableOptions.searchEnabled,
				pageLength : tableOptions.pageLength,
				order : []
			}));
	}

}
