/**
 * Setups page for inline error messages
 */
var fieldSuccessClass = 'inlineValid';
var fieldErrorClass = 'fieldErrorMessage';
var fieldErrorHolderSuffix = '_errorHolder';
var fieldInvalidDivSuffix = '_fldErrorInvalid';
var fieldErrorReqDivSuffix = '_fldErrorRequired';

$j(document).ready(function() {
	// add onBlur handler for required input fields
	var requiredTextFields = document.querySelectorAll('.requiredTextField');
	[].forEach.call( requiredTextFields, function( field ) {
		field.addEventListener( 'blur', function( event ) { requiredTextFieldValidation( event.target );  });
	});
	
	// inline error post processors (moves any error messages that require to be relocated)
	fieldErrorPageLoadPostProcessor();
});

/**
 * Utility function for jquery selector escaping
 */
function escapeSelector(s){
    return s.replace( /(:|\.|\[|\])/g, "\\$1" );
}

/**
 * Page load post processor which moves any field error messages that need to be moved so backend server 
 * can just output errors to page without scanning the dom for input fields that require special error
 * placement.
 * 
 * This method will search for all error holders (divs with id that end with '_errorHolder').
 * If found will search for any errors for that field and move them.
 */
function fieldErrorPageLoadPostProcessor() {
	var errorDivHolderIdEndPattern = fieldErrorHolderSuffix;
	// find all error holders
	$j('[id$="' + escapeSelector(errorDivHolderIdEndPattern) + '"]').each(function() {
		// extract field id for error holder
		var fieldID =  $j(this).attr('id').replace(errorDivHolderIdEndPattern, '');
		var $errorHolderDiv =  $j(this);
		
		// find all error divs for are currently displayed for this field
		var errorDivIdStartPattern = fieldID + '_fldError';
		$j('[id^="' + escapeSelector(errorDivIdStartPattern) + '"]').each(function() {
			if ($j(this).hasClass(fieldErrorClass)) {
				// move error to error holder
				$j(this).detach();
				$errorHolderDiv.append($j(this));
			}
		});
	});
}

/**
 * This method will search for all div with ids that 
 * start with fieldName_fldError and remove them
 */
function clearAllErrors( field ) {
	var errorDivIdStartPattern = field.getAttribute('id') + '_fldError';
	$j('[id^="' + escapeSelector(errorDivIdStartPattern) + '"]').remove();
}

/**
 * This method will remove the div with id=errorDivId 
 * and update the accessibility tag on the input field
 */
function clearError( field, errorDivId ) {
	$j('[id="' + escapeSelector(errorDivId) + '"]').remove();
	removeFromAttributeValue(field, 'aria-describedby', errorDivId);
}

/**
 * This method will add the error div after the input field 
 * and update the accessibility tag on the input field
 */
function addError( field, $errorDiv ) {
	var $field = $j(field);
	// if error holder div is defined for this field, add error as child there, 
	// else add error right after input field
	var errorHolderDivId = field.getAttribute('id') + fieldErrorHolderSuffix;
	var $errorHolderDiv = $j('[id="' + escapeSelector(errorHolderDivId) + '"]');
	if ($errorHolderDiv != null && $errorHolderDiv.length > 0) {
		$errorHolderDiv.append($errorDiv);
	}
	else {
		$field.after($errorDiv);
	}
	addToAttributeValue(field, 'aria-describedby', $errorDiv.attr('id'));
}

/**
 * Utility methods to add to a mutli value attribute
 */
 function addToAttributeValue(field, attributeName, addString) {
	var $field = $j(field);
	var currentValue =  $field.attr(attributeName);
	if (currentValue != null && currentValue.length > 0) {
		var newValue = currentValue + " " + addString;
		$field.attr(attributeName, newValue);
	}
	else {
		$field.attr(attributeName, addString);
	}
}
	
/**
 * Utility methods to remove from a mutli value attribute
 */ 
function removeFromAttributeValue(field, attributeName, removeString) {
	var $field = $j(field);
	var currentValue =  $field.attr(attributeName);
	if (currentValue != null && currentValue.length > 0) {
		if (currentValue.indexOf(removeString) >= 0) {
			var newValue = currentValue.replace(removeString, '');
			$field.attr(attributeName, newValue);
		}
	}
}


/**
 * This method returns the field label for a given field by
 * searching for the <label for=""> tag
 */
function getFieldLabel( field ) {
	var $field = $j(field);
	var $fieldLabel = $j("label[for='" + escapeSelector($field.attr('id')) + "']");
	// clone field lable so we can remove spans without affecting real field label
	var $fieldLabelClone = $fieldLabel.clone();
	$fieldLabelClone.find('span').remove();
	return $j.trim($fieldLabelClone.text());
	
}

/**
 * This method returns and div with the input error message with the proper
 * assessibility attributes.
 */
function createErrorDivElement(id, errorMessage) {
	var $errorDiv = $j('<div/>', { 'id':id, 'class':fieldErrorClass, 'aria-live':'assertive', 'aria-relevant':'additions', 'role':'alert'});
	$errorDiv.text(errorMessage);
	return $errorDiv;
}

/**
 * This method returns and div with the input success message with the proper
 * assessibility attributes.
 */
function createSuccessDivElement(id, successMessage) {
	var $successDiv = $j('<div/>', { 'id':id, 'class':fieldSuccessClass, 'aria-live':'polite', 'aria-relevant':'additions', 'role':'status'});
	$successDiv.text(successMessage);
	return $successDiv;
}

/**
 * Implementation method for the onBlur() off field focus handler for required input field
 */
function requiredTextFieldValidation( field ) {
	var errorDivId = field.getAttribute('id') + fieldErrorReqDivSuffix;
	clearError(field, errorDivId);
	
	// validate field
	var $field = $j(field);
	if ($field.val() == null || $field.val() == '') {
		//Clear any other exist on this field
		clearAllErrors(field);
		// build error and add after field
		var fieldLabel = getFieldLabel(field);
		
		$errorDiv = createErrorDivElement(errorDivId, 'Enter the required field: ' + fieldLabel);
		addError(field, $errorDiv);
	}	
}

/*
 * Checks for valid username pattern and availability in database 
 */
function checkUsername(userNameField, pwdValue, url, errorUrl, token)
{
	var $field = $j(userNameField);
	var fieldMessageDivId = userNameField.getAttribute('id') + fieldInvalidDivSuffix;	
	if ($field.val() != null && $field.val().trim() != '') {
		clearAllErrors(userNameField);
		var un = $field.val();
		var fieldLabel = getFieldLabel(userNameField);
	
		if ( /^[A-Za-z][A-Za-z0-9@._-]*$/i.test(un) && un.length > 5 && un.length < 36 )
		{
			$j.post(url, { username: un, queryUsername: "true", psrFormToken: token }).done(function(data)
			{		
				data = JSON.parse(data);
				if ( data.valid == "ERROR" )
				{
					window.location = errorUrl;
				}
				else if (data.valid == "true")
				{
					if (pwdValue != null && pwdValue.trim() != '' && un.toUpperCase() == pwdValue.toUpperCase())
					{
						$errorDiv = createErrorDivElement(fieldMessageDivId, "Username can't match password.");
						addError(userNameField, $errorDiv);
					}else{
						$successDiv = createSuccessDivElement(fieldMessageDivId, 'Username available');
						addError(userNameField, $successDiv);
					}
				}
				else
				{
					$errorDiv = createErrorDivElement(fieldMessageDivId, 'Username unavailable.');
					addError(userNameField, $errorDiv);
				}
			});			
		}else{
			$errorDiv = createErrorDivElement(fieldMessageDivId, "Username Invalid.");
			addError(userNameField, $errorDiv);
		}
	}
}

/*
 * Checks for valid password patterns 
 */
function checkPassword(un, pwdField)
{	
	var $field = $j(pwdField);
	var fieldMessageDivId = pwdField.getAttribute('id') + fieldInvalidDivSuffix;	
	if ($field.val() != null && $field.val().trim() != '') {
		clearAllErrors(pwdField);
		var pw = $field.val();
		var fieldLabel = getFieldLabel(pwdField);
		if ( un != null && un.trim() != '' && un.toUpperCase() == pw.toUpperCase())
		{
			$errorDiv = createErrorDivElement(fieldMessageDivId, "Password can't match username.");
			addError(pwdField, $errorDiv);
		}
		else if ( /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /^[A-Za-z0-9@!#$%^&*_-]*$/.test(pw) && pw.length > 7 && pw.length < 33 )
		{
			$successDiv = createSuccessDivElement(fieldMessageDivId, 'Password valid.');
			addError(pwdField, $successDiv);
		}
		else
		{
			$errorDiv = createErrorDivElement(fieldMessageDivId, "Password Invalid.");
			addError(pwdField, $errorDiv);
		}
	}
}	

/*
 * Checks for valid email patterns 
 */
function checkEmail(emailField)
{
	var $field = $j(emailField);
	var fieldMessageDivId = emailField.getAttribute('id') + fieldInvalidDivSuffix;	
	if ($field.val() != null && $field.val().trim() != '') {
		clearAllErrors(emailField);
		var email = $field.val();
		var fieldLabel = getFieldLabel(emailField);
	
		if ( /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test( email.toUpperCase() ) )
		{
			$successDiv = createSuccessDivElement(fieldMessageDivId, "Email address format valid.");
			addError(emailField, $successDiv);
		}
		else
		{
			$errorDiv = createErrorDivElement(fieldMessageDivId, "Email address format invalid.");
			addError(emailField, $errorDiv);
		}
	}
}
