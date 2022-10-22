/*heb coupon claimer:
go to:
https://www.heb.com/digital-coupon/coupon-selection/all-coupons

press F12, press ESC until Chrome console appears, run.
Brittle - depends on classes etc. being applied consistently.
*/

var timesNoViewMore = 0;
var ctClipped = 0;
var talky = alert;	// swap with console.log for less verbosity
var it = setInterval(function() { 
	var coupon = document.querySelector("button[color=coupon]"); 
	if (coupon) {
		coupon.scrollIntoViewIfNeeded();
		coupon.click();
		++ctClipped;
	}
	else {
		// no coupon to claim; can we get more?
		var viewMore = Array.from(document.querySelectorAll('[color=curbsideblue], [variant=outline]')).filter(function(elt) { return elt.innerText == 'View more'; });
		if (viewMore.length) {
			// found view more button; click it
			viewMore[0].click();
			timesNoViewMore = 0;
		}
		else if ((++timesNoViewMore) > 10) {
			// we're done; have encountered more than 10 times with no 'view more' 
			clearInterval(it);
			talky(`all done! clipped ${ctClipped} coupons`);
		}
	}
}, 1000);
