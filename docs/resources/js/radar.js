
    $(document).click(function(e) {
    if ($(e.target).closest('.dropdown-toggle').length === 0) {
        // Close all open toggles if any open
        $('.dropdown-content').removeClass("show");
    }

    if ($(e.target).closest('#radarFilter').length === 0 && $(e.target).closest('.toggle-filter').length === 0) {
        // Close all open toggles if any open
        $('#radarFilter').removeClass("visible");
    }

    


});

// ------ Loop through all items and add quarter/year class to element  ------ // 
$('.innerWrapper').each(function() {
    //STARTING QUARTER
    let Q = 1;
    //STARTING YEAR
    let Y = 2017;

    $(this).children().each(function() {
        if (!$(this).hasClass("FYheader")) {
            $(this).addClass("Y" + Y + " Q" + Q)
        }
        if (Q >= 4) {
            Q = 1;
            Y++;
        } else {
            Q++;
        }
    })
});




// ------ Table scrolling and fit ------ // 
let scrollWrapperWidth = $('.scrollWrapper').outerWidth();

let swipeCounter = 0;
let swipePos = 0;
let yearColumns = 3;
let possibleScrolls = 0;



showYears(yearColumns);


$( window ).resize(function() {    
    showYears(yearColumns);
  });


function translateTable(dir) {


    let yearWidth = scrollWrapperWidth / yearColumns;
    
    if (dir == "left" && swipeCounter > 0) {
        swipePos += yearWidth;
        swipeCounter--;

        $('.scrollWrapper').removeClass("swipePosition"+(swipeCounter+1));
        $('.scrollWrapper').addClass("swipePosition"+(swipeCounter));
    }

    if (dir == "right" && swipeCounter < possibleScrolls) {
        swipePos -= yearWidth;
        swipeCounter++;

        $('.scrollWrapper').removeClass("swipePosition"+(swipeCounter-1));
        $('.scrollWrapper').addClass("swipePosition"+(swipeCounter));
    }

    //aninmate translation 
    $('.innerWrapper').css('transition', '.3s');

    //translate table
    $('.innerWrapper').css('transform', 'translateX(' + (-1*swipeCounter*yearWidth) + 'px)');

    
    toggleArrows();

    


}



function showYears(yearsAmount) {
  
    scrollWrapperWidth = $('.scrollWrapper').outerWidth();
    possibleScrolls = ((8)-yearsAmount);

    if(swipeCounter >= possibleScrolls){
        swipeCounter = possibleScrolls;
    }

    yearColumns = yearsAmount;

    if (yearsAmount == 1) {
        $("body").addClass("oneYearView")
    } else {
        $("body").removeClass("oneYearView")
    }

    
    let yearWidth = scrollWrapperWidth / yearsAmount;
    let quarterWidth = yearWidth / 4;


    console.log("Possible", possibleScrolls)
    console.log("swipeCounter", swipeCounter)

    toggleArrows();

    $('.innerWrapper').css('transform', 'translateX(' + (-1 * yearWidth * swipeCounter) + 'px)');
    $('.innerWrapper').css('grid-template-columns', 'repeat(32, ' + (quarterWidth) + 'px)');

    //disable animation to avoid jump
    $('.innerWrapper').css('transition', '0s');

    

}

function toggleArrows(){
    //show left arrow if swiped 
    (swipeCounter!=0 ? $('.arrow-left').addClass("visible") : $('.arrow-left').removeClass("visible"))

    if (swipeCounter == possibleScrolls){
        $('.arrow-right').removeClass("visible") 
    } else {
        $('.arrow-right').addClass("visible")
        
    }

    console.log("Possible", possibleScrolls)
   console.log("swipeCounter", swipeCounter)
}





// ------ More details toggle ------ //  
$('.liToggle').click(function(e) {
    let sidebarTarget = e.currentTarget.dataset.target;

    // Close all other sidebars if any open
    $('.overlaySidebar.visible').removeClass("visible")

    $(sidebarTarget).addClass("visible")
    $("body").addClass("sidebar-open")
})

$('.close').click(function() {
    // Remove visible class from all sidebars
    $('body').toggleClass('document-open');
    $('.overlaySidebar.visible').removeClass("visible")
    $("body").removeClass("sidebar-open")
})

$('.toggle-filter').click(function() {

    $('.overlaySidebar.visible').removeClass("visible")

    $('#radarFilter').addClass("visible")
});




function filterItems() {
    $("input:checkbox[name=programName]:not(:checked)").each(function() {
        $('ul.innerDataUl li.' + $(this).val()).addClass("not-checked")

    });
    $("input:checkbox[name=programName]:checked").each(function() {
        $('ul.innerDataUl li.' + $(this).val()).removeClass("not-checked")

    });
    $('.table-scroll').addClass("filter-applied")
}


$('.filter-program-btn').click(function() {
    $('.program-filer').toggleClass("visible")
})
$('#programFilter .btn').click(function() {
    $('.program-filer').toggleClass("visible")
})


$(document).keydown(function(e) {
    //on arrow left 
    if (e.keyCode == 37)
        translateTable('left');
    //arrow right
    if (e.keyCode == 39)
        translateTable('right');
});


$('.dropdown-toggle').click(function(e) {
    let dropdownTarget = e.currentTarget.dataset.target;


    // Close all open toggles if any open
    $('.dropdown-content').removeClass("show")

    $("#" + dropdownTarget).addClass("show")


})


//tabs nav
$('.tabs-nav li a').click(function(e){    
    e.preventDefault();
    var t = e.currentTarget.dataset.target; 

    if(!$(this).hasClass('active')){ //this is the start of our condition 
      $('.tabs-nav li a').removeClass('active');           
      $(this).addClass('active');

      $('.tab-content').removeClass('active');           
      $('#'+t).addClass('active');
   }
  });

  
