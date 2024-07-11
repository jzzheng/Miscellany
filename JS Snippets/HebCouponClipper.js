/*heb coupon claimer:
go to:
https://www.heb.com/digital-coupon/coupon-selection/all-coupons?clippedStatus=UNCLIPPED
(i.e. for best results, filter for unclipped coupons)

Clip a coupon by hand first - will reveal if you need to log in again.
Press F12, press ESC until Chrome console appears, run.
Brittle - depends on classes etc. being applied consistently.
NB: the count clipped is based on the number of times a coupon is *clicked*. 
  Sometimes the click event doesn't result in a coupon being clipped, in which case the final ctClipped report from talky will be an overestimate
  
NB2: The paged view only pages through the top X coupons; included a warning about addressing that.
  Also, not sure if I broke the logic on the original 'infinite view more' version; guess we'll see.
  In order to get rid of the need to manually refresh & rerun, will need the script to persist between "true" pages. Maybe either a browser extension or do something wacky with generating an iframe.

*/

var timesNoNext = 0;
var ctClipped = 0;
const talky = alert;	// swap with console.log for less verbosity
const isPaginated = document.querySelectorAll("[data-qe-id=paginationList]").length > 0;
// try to get next coupons; return true if there appear to have been more to get
function getNextCoupons() {
	var next;
	if (isPaginated) {
		// 'next' is next page button
		next = document.querySelectorAll("[data-qe-id=paginationNext]");
	}
	else {
		// 'next' is the 'view more' button
		next = Array.from(document.querySelectorAll('[color=curbsideblue], [variant=outline]')).filter(function(elt) { return elt.innerText == 'View more'; });
	}
	
	if (next.length) {
		// found a 'next' button; click it
		next[0].click();
		timesNoNext = 0;
		return true;
	}
	
	return false;
}

const it = setInterval(function() { 
	if (!isPaginated) {
		// when not paginated, first try to pull up all the coupons
		if (getNextCoupons()) {
			// were able to get next coupons; end for now (let the next coupons get loaded)
			return;
		}
	}

	// let's clip a coupon (admittedly view more might be loading but whatever)
	const coupons = Array.from(document.querySelectorAll("[data-qe-id=couponCard] button")).filter(function(elt) { return elt.innerText == 'Clip'; }); 
	if (coupons.length) {
		const coupon = coupons[0];
		coupon.scrollIntoViewIfNeeded();
		coupon.click();
		++ctClipped;
	}
	else if ((++timesNoNext) > 10) {
		// neither coupons nor paginated nor 'view more' button, multiple times - 
		// we're done; have encountered more than 10 times with no 'view more' (or coupons)
		clearInterval(it);
		talky(`all done! clipped ${ctClipped} coupons. `  + (isPaginated ? "Coupons were paginated so process may have to be repeated; remember to restart from a fresh URL / strip the cursor argument from the URL before refreshing." : ""));
	}
	else if (isPaginated) {
		// no coupons left to clip, we haven't hit the "no next" stopping point, and we've got a page view going
		getNextCoupons();
		return;
	}
}, 1000);
