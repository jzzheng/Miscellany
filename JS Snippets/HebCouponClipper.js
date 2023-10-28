/*heb coupon claimer:
go to:
https://www.heb.com/digital-coupon/coupon-selection/all-coupons?clippedStatus=UNCLIPPED
(i.e. for best results, filter for unclipped coupons)

Clip a coupon by hand first - will reveal if you need to log in again.
Press F12, press ESC until Chrome console appears, run.
Brittle - depends on classes etc. being applied consistently.

*/

var timesNoViewMore = 0;
var ctClipped = 0;
var talky = alert;	// swap with console.log for less verbosity
var it = setInterval(function() { 
	// first try to get all the 'view more' options
	var viewMore = Array.from(document.querySelectorAll('[color=curbsideblue], [variant=outline]')).filter(function(elt) { return elt.innerText == 'View more'; });
	if (viewMore.length) {
		// found view more button; click it
		viewMore[0].click();
		timesNoViewMore = 0;
		return;
	}

	// no view more; let's clip a coupon (admittedly view more might be loading but whatever)
	var coupons = Array.from(document.querySelectorAll("[data-qe-id=couponCard] button")).filter(function(elt) { return elt.innerText == 'Clip'; }); 
	if (coupons.length) {
		var coupon = coupons[0];
		coupon.scrollIntoViewIfNeeded();
		coupon.click();
		++ctClipped;
	}
	else if ((++timesNoViewMore) > 10) {
		// neither coupons nor 'view more' button, multiple times - 
		// we're done; have encountered more than 10 times with no 'view more' (or coupons)
		clearInterval(it);
		talky(`all done! clipped ${ctClipped} coupons`);
	}
}, 1000);
