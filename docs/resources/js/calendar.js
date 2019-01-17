var slider,
  oBxSettings = { 
  	mode: 'vertical',
		  captions: false,
	  slideWidth: 376,
	  controls: true,
	   pager: false,
	  touchEnabled: false,
	  infiniteLoop: false,
	   hideControlOnEnd: true,
	   startSlide: 13,

  };

function init() {
  // Set maxSlides depending on window width
  oBxSettings.minSlides = window.outerWidth < 845 ? 1 : 2;
}

$(document).ready(function() {
  init();
  // Initial bxSlider setup
  slider = $('.preview-slider').bxSlider(oBxSettings);
});

$(window).resize(function() {
  // Update bxSlider when window crosses 845px breakpoint
  if ((window.outerWidth<845 && window.prevWidth>=845)
    || (window.outerWidth>=845 && window.prevWidth<845)) {
    init();
    slider.reloadSlider(oBxSettings);
  }
  window.prevWidth = window.outerWidth;
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

 
