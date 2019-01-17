	
   $(document).ready(function(){
	 $('.slider').bxSlider(
      {
    captions: true,
	  controls: true,
	  maxSlides: 1,
	slideMargin: 10,
		  noSwiping: true,  
		   touchEnabled: false,
		  infiniteLoop: false,
		  hideControlOnEnd: true,
	      startSlide: 12,
		pagerCustom: '#calendar-picker'
  });    
	    
	    $('.preview-slider').bxSlider(
      {
   	mode: 'vertical',
		  captions: false,
	      minSlides: 2,
	  controls: true,
	   pager: false,
	  touchEnabled: false,
	            startSlide: 12,
	      moveSlides: 1,
		  infiniteLoop: false,
		  hideControlOnEnd: true,
	   
  }); 
	    
	    
     
		
		
	  $('.multi-event-slider').bxSlider(
      {

	  controls: false,
	  maxSlides: 1,
	preventDefaultSwipeX: true,
		noSwiping: true,  
		   touchEnabled: false,

  });	
		
    });

 
