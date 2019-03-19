var staticDialogContent = new Object;
var currentAjaxDialog = "<all>";

function createQuicktip(id, heading, msg, width) {
	if ( heading == null || heading == '')
	{
		heading = "Information";
	}
	createDialog(id, id, id, msg, heading, width, true );
	
	if ((typeof TeaLeaf != "undefined") && (typeof TeaLeaf.Event != "undefined") && (typeof TeaLeaf.Event.tlAddCustomEvent != "undefined"))
	{
		TeaLeaf.Event.tlAddCustomEvent("viewQuicktip", { 'heading': heading }); 
	}
	window.setTimeout(1000);
}

function createDialog(loc, id, anchor, msg, heading, width, solo) {		
	if (msg != null)
	{
		staticDialogContent[id] = msg;		
	}
	var content = staticDialogContent[id];
	
	Ept.createSimpleDialog(
	{
		title: heading,
		body: content,
		autoOpen: true,
		width: width,
	    modal: true,
	    fluid: true, //new option
	    responsive: true,
	    resizable: false,
	    draggable: false	    
	});
}

function createAjaxDialog(url, loc, id, heading, anchor, width, solo) {
	
	if (solo) {
		currentAjaxDialog = anchor;
	} else {
		currentAjaxDialog = "<all>";
	}
	
	$j.get(url, function(data){
		  if (anchor == currentAjaxDialog || currentAjaxDialog == "<all>") {
			  staticDialogContent[id] = data;
			  createDialog(loc, id, heading, anchor, w, solo);
		  }
		});
}

function closeDialog(id, anchor) {
	Psr.hide('dialog_' + id);
	$j('#' + anchor).focus();
}

function addStaticDialogContent(id, msg) {
	staticDialogContent[id] = msg;
}
