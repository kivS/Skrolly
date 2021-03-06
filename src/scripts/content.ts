
// Handle page visibility change   
document.addEventListener('webkitvisibilitychange', function(){

	console.debug('Page visibility: ', document.visibilityState);
	//document.title = document.visibilityState;

	if(document.visibilityState == 'hidden'){
		sendPageLocation();
	}

}, false);


// On page unload send page y location to be saved
window.onbeforeunload = sendPageLocation;


// Start up && send some info about page
chrome.runtime.sendMessage(
	{
		what: "START_BOT",
		scrollY: scrollY,     // info about the Y distance travelled in this page
		url: getPageUrl()   // current page url
	},
	function(response) {

		console.debug('START_BOT response: ', response);

		if(response.changes){
			travelY(response.newScrollY, response.oldScrollY);
		}
  	}
);


//---------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Scroll page vertically to determined coord
 *  
 */
function travelY(y: number, oldY: number){
	console.group('TravelY - Scroll page to new Y');
	console.log('current page Y: ', window.scrollY);
	console.log('newY: ', y);
	console.log('oldY: ', oldY);

	// If oldY > 0 and newY is 0 something went down... so let's scroll to olY instead..
	const scrollY = (y == 0 && oldY > 0) ? oldY:y;
	console.log('newY or oldY: ', scrollY);

	scrollTo(0, scrollY);

	//make sure it scrolls..
	forceScroll(scrollY);

	console.groupEnd();
}

/**
 * send current page location to be saved
 * 
 */
function sendPageLocation(){
	chrome.runtime.sendMessage(
		{
			what: "ECHO_ECHO",
			scrollY: scrollY,     // info about the Y distance travelled in this page
			url: getPageUrl()	// current page url
		}
	);
}



/**
 * Get current page url
 * @return {[string]} --> filtered url
 */
function getPageUrl(): string{
	return location.origin + location.pathname;
}

/**
 * Force page to scroll..
 */
function forceScroll(y: number){
	
	if(scrollY != y){
		window.scrollTo(0, y);
	}
	

	// make sure it scrolled..
 	const force_scroll_timeout = setTimeout(() => {

 		// clear timeout
 		clearTimeout(force_scroll_timeout);
		
		if(scrollY != y){
			// it scroll is not correct
			// To the rabbit hole we go
			forceScroll(y);
		}

	}, 10);
}
