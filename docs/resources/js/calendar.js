    $(document).ready(function(){
      $('.preview-slider').bxSlider(
      {
   	mode: 'vertical',
		  captions: false,
	  slideWidth: 376,
	  controls: true,
	   pager: false,
	  minSlides: 2,
	slideMargin: 10,
	      startSlide: 13,
	  touchEnabled: false,
	  infiniteLoop: false,
	   hideControlOnEnd: true,
  });
    });

	
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
		
		
	  $('.multi-event-slider').bxSlider(
      {

	  controls: false,
	  maxSlides: 1,
	preventDefaultSwipeX: true,
		noSwiping: true,  
		   touchEnabled: false,

  });	
		
    });

 
