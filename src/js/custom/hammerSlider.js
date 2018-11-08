// 1. Basic object for our stuff
window.slider = {};

// 2. Settings
slider.sliderPanelSelector = '.wrappers-wrapper';
slider.sensitivity = 25; // horizontal % needed to trigger swipe

// 2. Placeholder to remember which slide we’re on
slider.activeSlide = 0;

// 3. Slide counter
slider.slideCount = 0;


// 4. Initialization + event listener
slider.init = function( selector ) {

    if(window.innerWidth>999 || window.innerWidth<768) return;

    if(slider.initiated === undefined) {
        slider.initiated = true;

        // 4a. Find the container
        slider.sliderEl = document.querySelector(selector);

        // 4b. Count stuff
        slider.slideCount = 4;
    }


    slider.sliderManager = new Hammer.Manager(slider.sliderEl);
    slider.sliderManager.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    slider.sliderManager.on( 'pan', function( e ) {

        // 4e. Calculate pixel movements into 1:1 screen percents so gestures track with motion
        var percentage = 100 / slider.slideCount * e.deltaX / 500;

        // 4f. Multiply percent by # of slide we’re on
        var percentageCalculated = percentage - 100 / slider.slideCount * slider.activeSlide;

        // 4g. Apply transformation
        slider.sliderEl.style.transform = 'translateX( ' + percentageCalculated + '% )';

        // 4h. Snap to slide when done
        if( e.isFinal ) {
            slider.pauseRotating();
            if( e.velocityX > 0 ) {
                slider.goTo( slider.activeSlide - 1 );
            } else if ( e.velocityX < -1 ) {
                slider.goTo( slider.activeSlide + 1 )
            } else {
                if( percentage <= -( slider.sensitivity / slider.slideCount ) )
                    slider.goTo( slider.activeSlide + 1 );
                else if( percentage >= ( slider.sensitivity / slider.slideCount ) )
                    slider.goTo( slider.activeSlide - 1 );
                else
                    slider.goTo( slider.activeSlide );
            }
        }
    });

    slider.startRotating();
};

// 5. Update current slide
slider.goTo = function( number ) {

    // 5a. Stop it from doing weird things like moving to slides that don’t exist
    if( number < 0 )
        slider.activeSlide = 0;
    else if( number > slider.slideCount - 2 )
        slider.activeSlide = slider.slideCount - 2;
    else
        slider.activeSlide = number;

    // 5b. Apply transformation & smoothly animate via .is-animating CSS
    slider.sliderEl.classList.add( 'is-animating' );
    var percentage = -( 100 / slider.slideCount ) * slider.activeSlide;

    slider.sliderEl.style.transform = 'translateX( ' + percentage + '% )';
    clearTimeout( slider.timer );
    slider.timer = setTimeout( function() {
        slider.sliderEl.classList.remove( 'is-animating' );
    }, 400 );

};

// 6.Rotation
slider.startRotating = function(){
    let direction = 1;
    let finish = slider.slideCount-2;

    slider.rotate = setInterval(function(){
        switch(slider.activeSlide){
            case finish: direction=-1; break;
            case 0: direction=1; break;
            default: break;
        }
        slider.goTo(slider.activeSlide+direction);
    },3000);
};

slider.pauseRotating = function(){
    clearInterval(slider.rotate);
    clearTimeout(slider.timerToRotate);
    slider.timerToRotate = setTimeout(slider.startRotating,15000);
};

slider.stopRotating = function(){
    clearInterval(slider.rotate);
    clearTimeout(slider.timerToRotate);
};

// Initialize
slider.init( '#slider' );

// Remove and append slider, if screen is resized
slider.stop = function(){
    slider.goTo(0);
    slider.stopRotating();
    slider.sliderManager.destroy();
};

window.addEventListener('resize',function(){
    if(slider.initiated) {
        slider.stop();
    }
    slider.init( '#slider' );
});
