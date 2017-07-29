/**
 * Created by Liujx on 2017-07-26 21:33:10
 */
	
(function($) {
	$.init();

    var offCanvasInner = $('.mui-off-canvas-wrap')[0].querySelector('.mui-inner-wrap');

	offCanvasInner.addEventListener('drag', function(event) {
	    event.stopPropagation();
	});
	
	$(".mui-scroll-wrapper").scroll({
		deceleration : 0.0005
	});

})(mui)
    
