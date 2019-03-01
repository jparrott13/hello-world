//Opens a popup window for a given URL.
//
//NOTE: this does not work with IE8 and /int/document/viewPdfForm.html if the form has been
//set into the response as an attachment, due to a security setting in IE8. Use either 
//createPopupForPdfTemplate() or createContractTypePopupForPdf() instead.
function openPopupUrl(url, title)
{
	//check for UI standard on height and width of pop up
	var newWindow= window.open(url,title,"width=800,height=800,resizable=1,status=1,scrollbars=1");
	if(window.focus) 
	{
		newWindow.focus();
	}

}

// This function gets the appropriate PDF form and puts 
// it in a new child window.
function createPopupForPdfTemplate( documentStatus, htmlFormName, viewPdfUrl)
{
	var relForm = $(htmlFormName);
	
	relForm.method='post';

	$('documentStatus').value = documentStatus;		
	$('formSubmission').value = true;

	relForm.action=viewPdfUrl;
	
	//Open document in the browser only if its in In-Progress status so the user can edit the document.
	if( documentStatus == 'PRG' || documentStatus == 'TMP' || documentStatus == 'PNG') 
	{ 
		relForm.target = 'displayPdfFormWindow';
		var win = window.open("", relForm.target, "width=800,height=800,resizable=1,status=1,scrollbars=1");	
		win.focus();
	}
	
	relForm.submit();
	relForm.action='';
	relForm.target='';
	//allow the next submit to be processed...
	Psr.PreventDoubleSubmit.resetSubmitFlag();
}

//Open a popup window to receive the response from a submitted HTML form that posts
//to /int/document/viewPdfForm.html.
//For this to work, submit printInd=true with the submitted form to avoid setting the PDF
//into the response as an attachment.
function createContractTypePopupForPdf( htmlFormName, viewPdfUrl )
{	
	var windowName = 'displayPdfFormWindow';
	var relForm = $(htmlFormName);
	relForm.method='post';
	if( $('formSubmission') )
	{
		$('formSubmission').value = true;
	}
	relForm.action=viewPdfUrl;
	relForm.target = windowName
	var win = window.open("", windowName, "width=800,height=800,resizable=1,status=1,scrollbars=1");
	win.focus();
	relForm.submit();
	relForm.action='';
	relForm.target='';
	
	//allow the next submit to be processed...
	Psr.PreventDoubleSubmit.resetSubmitFlag();
}
