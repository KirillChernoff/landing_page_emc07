$(document).ready(function() {

	$(".top_text h1").animated("fadeInDown");
	$(".top_text p").animated("fadeInUp");

	function heightDetect(){
		$(".main_head").css("height", $(window).height());	
	};
	
	function firstStartPage(){
		$(".top_menu").fadeIn(600);
		$(".top_menu li a").addClass("fadeInRight animated");
		$(".sandwich").toggleClass("active");
	}

	firstStartPage();
	
	heightDetect();

	$(window).resize(function() {
		heightDetect();
	});

	$(".toggle_menu").click(function() {
		$(".sandwich").toggleClass("active");
	});

	$(".top_menu ul a").click(function() {
		$(".top_menu").fadeOut(600);
		$(".sandwich").toggleClass("active");
	}).append("<span>");

	$(".toggle_menu").click(function() {
		if ($(".top_menu").is(":hidden")) {
			$(".top_menu").fadeIn(600);
			$(".top_menu li a").addClass("fadeInRight animated");
		} else {
			$(".top_menu").fadeOut(600);
			$(".top_menu li a").removeClass("fadeInRight animated");
		};
	});

});




//prepost jquery plugin
(function($) {

  $.fn.prepost = function(options) {
 
    //the slide slideshow object
    var slide = {
      //initialize the object properties
      initVars: function(slideshow){
        //the div that contains the slideshow
        this.slideDiv = slideshow;
        //the ul that contains the slides
        this.slideUl = this.slideDiv.find('ul');
        //the li slides
        this.slideLi = this.slideUl.find('li');
        //get ready to store pre nav button
        this.navPre = null;
        //get ready to store post nav button
        this.navPre = null;
        //the current slide
        this.slideCur = 0;
        //options passed into the plugin
        this.opt = $.extend({
          //center the first and last slide
          centerEnds: false,
          //go back to slide 0 when users click past the end
          loop: false,
          //set the default background color behind the slides
          background: '#1a4559',
          //set defualt innactive slide opacity
          opacity: .3,
          //set default innactive slide blur (none)
          blur: 0
        }, options);
      },
      
      //initialize the slider
      init: function(slideshow){
        
        //set up the properties
        this.initVars(slideshow);

        //for the slider parent div
        this.slideDiv
          //hide overflow (visible by default as fallback)
         .css({
           'overflow-x': 'hidden',
           'background-color': slide.opt.background
         })
          //bind swipe navigation for touch devices
          .bind('touchstart touchend', function(e){
            slide.swipe(e);
          })
          //add the post slide/pre slide navigation buttons
          .prepend('<a href="javascript:void(0);" id="prepost-pre" class="prepost-pre prepost-nav-inactive">prev</a><a href="javascript:void(0);" id="prepost-post" class="prepost-post">next</a>');
        
        //establish pre slide nav
        slide.navPre = $('#prepost-pre');
        //on pre slide nav button click
        slide.navPre.click(function(){
          //go one slide back
          slide.decrement();
        });
        //establish post slide nav
        slide.navPost = $('#prepost-post');
        //on post slide nav button click
        slide.navPost.click(function(){
          //go one slide forward
          slide.increment();
        });
        
        //for each slide list item (indivisual slides)
        this.slideLi.each(function(){
          var that = $(this);
          that
            //grab the img src and add it as the background image
            .css({
              'background-image': 'url(' + that.find('img').attr('src') + ')'
            })
            //hide the imgs but maintain placement
            .find('img')
              .css('visibility','hidden');
        //when users click an li
        }).bind('click',function(){
          //get the clicked li's index number
          var thisSlide = slide.slideLi.index($(this));
          //identify this li as the current slide
          slide.slideCur = thisSlide;
          //move to this slide
          slide.moveTo(thisSlide);
          //handle the nav buttons
          slide.navBtn();
        });
        
        //fix up the slider on window resize
        var slideResize = null;
        $(window).resize(function(){
          //clear any existing timeout
          window.clearTimeout(slideResize);
          //move to the current slide again 100ms after the window stops resizing
          slideResize = window.setTimeout(function(){slide.moveTo(slide.slideCur);}, 100);
        });
        
        //nav forward and back on left/right arrow click
        $(document).keydown(function(e){
            if (e.keyCode == 37) { //left
              slide.decrement();
            } else if (e.keyCode == 39){ //right
              slide.increment();
            }
        });

        //initially, move to the current slide (first one)
        slide.moveTo(this.slideCur);
      },
      
      //move to a slider
      moveTo: function(slideNum){
        //store the position to move to
        var movePos = null;
        ///get the li's width
        var liWidth = Math.round(this.slideLi.eq(slideNum).width());
        //get the li's left position
        var liPos = this.slideLi.eq(slideNum).position().left;
        //get the div's (slider parent's) width
        var viewWidth = this.slideDiv.width();
        //center the slide
        movePos = -(liPos - ((viewWidth - liWidth) / 2));
        //if the first and last slide should not center (default)
        if(!this.opt.centerEnds){
          //if this is the first slide
          if(slideNum == 0){
            //move to the starting (don't center)
            movePos = liPos;
          //if this is the last slide
          } else if(slideNum == this.slideLi.length - 1){
            //just slide to the end (don't center)
            movePos = -(liPos - ((viewWidth - liWidth)));
          }
        }
        //move the ul with the slides in it
        this.slideUl.css('transform','translateX(' + movePos + 'px)');
        //for all the slides (lis)
        this.slideLi
          //add innactive class
          .addClass('inactive-slide')
            //fade out inactive lides
            .css(slide.css('inactive'))
            //for the current slide
            .eq(slideNum)
              //remove the inactive class
              .removeClass('inactive-slide')
              //fade in active slide
              .css(slide.css('active'));
      },
      
      //increment the slide
      increment: function(){
        //if it's not the last slide
        if(slide.slideCur < slide.slideLi.length - 1){
          //increment the current slide and move to it
          slide.moveTo(++slide.slideCur);
        //if it is the last slide
        } else {
          if(slide.opt.loop){
            slide.slideCur = 0;
            slide.moveTo(slide.slideCur); 
          }
        }
        //set up nav buttons
        slide.navBtn();
      },
      
      //decrement the slide
      decrement: function(){
        //if it's not the first slide
        if(slide.slideCur != 0){
          //decrement the current slide and move to it
          slide.moveTo(--slide.slideCur);
        }
        //set up nav buttons
        slide.navBtn();
      },
      
      //handle nav buttons
      navBtn: function(){
        //make both nav buttons visible
        slide.navPost.removeClass('prepost-nav-inactive');
        slide.navPre.removeClass('prepost-nav-inactive');
        //if this is the first slide
        if(slide.slideCur == 0){
          //hide the pre nav button
          slide.navPre.addClass('prepost-nav-inactive');
        //if this is the last slide
        } else if(slide.slideCur >= slide.slideLi.length - 1){
          //if the slides shouldn't loop
          if(!slide.opt.loop){
            //hide the post slide nav
            slide.navPost.addClass('prepost-nav-inactive');
          }
        }
      },
      
      //handle touch swipes
      swipe: function(e){
        //get mouse position
        var mousePos = function(e){
          return e.clientX - slide.slideDiv.offset().left;
        }
        //if the event was the starting of a touch
        if(e.type == 'touchstart'){
          //set swipe from origin
          slide.swipeFrom = mousePos(e.originalEvent.touches[0]);
        //if the event was the end of a touch
        } else if (e.type == 'touchend'){
          //set the swipe to origin
          slide.swipeTo = mousePos(e.originalEvent.changedTouches[0]);
          //determine the difference between from and to
          var delta = slide.swipeFrom - slide.swipeTo;
          //if the delta was big enough and positive then increment
          if(delta > 100){
            slide.increment();
          //if the detla was big enough and negative then decrement
          } else if (delta < -100){
            slide.decrement();
          }
        }
      },
      
      //handle slide styling
      css: function(direction){
        //if we're showing an inactive slide
        if(direction == 'inactive'){
          //set opacity
          var inlineStyle = {
            'opacity': slide.opt.opacity
          };
          //add blur if set
          if(slide.opt.blur != 0){
            inlineStyle['-webkit-filter'] = 'blur('+slide.opt.blur+')';
          }
          //return styles
          return inlineStyle;
        //if we're showing the active slide
        } else {
          //remove opacity style
          var inlineStyle = {
            'opacity': ''
          };
          //remove blur if set
          if(slide.opt.blur != 0){
            inlineStyle['-webkit-filter'] = '';
          }
          //return styles
          return inlineStyle;
        }
      }
      
    };
    
    //initialize the slider for the object passed in
    slide.init(this);

  };

}(jQuery));

//call prepostslider on an element (all options set to default)
jQuery(function($){
  $('.prepostslider').prepost({
    centerEnds: true,         //center the first and last slide
    loop: true,
    background: '#1a4559',     //set the background behind the slides
    opacity: .3,               //set opacity of innactive slides
    blur: 0                    //set blur amount for innactive slides
  });
});
