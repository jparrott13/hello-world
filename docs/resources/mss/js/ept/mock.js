var defaults = {
	healthPlan : '1',
	useEmployer : '0',
	mailingPO : '0',
	mailingZIP	: '95811',
	physicalZIP	: ''
}

var openEnroll = {
	'healthPlan' : 'value',
	'useEmployer' : 'set',
	'mailingPO' : 'set',
	'mailingZIP' : 'value',
	'physicalZIP' : 'value'
}

function cSetup(name, type, value) {

	if ( value == null )
	{
		if ( defaults[name] != null ) {
			value = defaults[name];
		}
	}

	if ( $j("input[name='" + name + "']").length > 0 ) 
	{
		var input = $j("input[name='" + name + "']")[0];
	}

	if ( type == 'exist')
	{
		console.log($j("input[name='" + name + "'][value='1']").length);
		if ( $j.cookies.get(name) != null )
		{
			$j("input[name='" + name + "'][value='1']").attr("checked","checked");					
		}
		else 
		{
			$j("input[name='" + name + "'][value='0']").attr("checked","checked");
		}

		$j("input[name='" + name + "'][value='1']").click(function() { $j.cookies.set(name, 'exists'); });
		$j("input[name='" + name + "'][value='0']").click(function() { $j.cookies.del(name); });
	}	
	else if ( type == 'set')
	{
		if ( $j.cookies.get(name) == null )
		{
			$j.cookies.set( name, value );
		}

		$j("input[name='" + name + "']").each(function() { 
			if ( $j(this).val() == $j.cookies.get( name ) )
			{
				$j(this).attr("checked", "checked");				
			}
			$j(this).click(function() { 
				console.log(name + " " + $j(this).val());
				$j.cookies.set(name, $j(this).val()); 
			});
		});
	}	
	else if ( type == 'value' )
	{
		if ( $j.cookies.get(name) == null )
		{
			$j.cookies.set( name, value );	
		} 		
		
		$j("input[name='" + name + "']").val( $j.cookies.get(name) );
		$j("input[name='" + name + "']").change( function() { $j.cookies.set(name, $j(this).val()); });
	}		
}

function resetOpenEnroll() {
	for (prop in openEnroll)
	{
		$j.cookies.del( prop );
	}		
	setupOpenEnroll();
}

function setupOpenEnroll() {			
	for (prop in openEnroll)
	{
		cSetup( prop, openEnroll[prop] );				         				
	}	
}

function setupMenu() {
	cSetup( 'menuStyle', 'set', '1' );
}

function setupBillboard() {
	cSetup ('billboard', 'set', '1' );
}
