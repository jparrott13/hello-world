var curPage = 0;
var maxPage = 1;

function select(i) {
	/*
	$j('.selectedSicon').addClass('sicon');
	$j('.selectedSicon').removeClass('selectedSicon');
	$j('#s' + i).removeClass('sicon');
	$j('#s' + i).addClass('selectedSicon');
	*/
	$j('#personalSecurityIconId').val(i);
}
/*
function scroll(i)
{
	curPage += i;

	Psr.show('iconLeft');
	Psr.show('iconRight');

	$j('#iconControl > div').hide();
	$j('#icons' + curPage).show();							
	
	if ( curPage == 0 ) {
		Psr.hide('iconLeft');
		$j(".siconLink, .linkedImage").filter(":first").focus();
	}
	if ( curPage == maxPage ) {
		Psr.hide('iconRight');
		$j(".siconLink, .linkedImage").filter(":last").focus();
	}	
}
*/
function clearPSIPSM()
{
	$j('.selectedSicon').addClass('sicon');
	$j('.selectedSicon').removeClass('selectedSicon');
	$j('#personalSecurityIconId').val('0');
	$j('#securityMessage').val('');
	if ( $j('#personalSecurityIconId').val() != '')
	{
		curPage = 0;
		scroll(0);
	}
}
/*
$j(document).ready(function(){				

	maxPage = $j("#iconControl > div").size() - 1;

	if ( $j('.error').size() > 0 && $j('#personalSecurityIconId').val() == 0)
	{
		$j('#iconControl').addClass('errored');
		$j('#iconControl').after('<div class="fieldErrorMessage">Please select a personal security icon.</div>');
	}
	
	if ( $j('#personalSecurityIconId').val() == 0 || $j('.selectedSicon').length == 0 )
	{
		$j('#iconControl > div:first').show();
		Psr.hide('iconLeft');
	}
	else
	{			
		$j('.selectedSicon').parent().parent().show();
		curPage = $j('#iconControl > div').index($j('.selectedSicon').parent().parent());
		
		if ( curPage == 0 )
		{
			Psr.hide('iconLeft');
			console.log('left');
		}
		else if ( curPage == maxPage )
		{
			Psr.hide('iconRight');
			console.log('right');
		}		
	}
});
*/
