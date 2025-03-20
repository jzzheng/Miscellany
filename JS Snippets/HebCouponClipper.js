/*heb coupon claimer:
go to:
https://www.heb.com/digital-coupon/coupon-selection/all-coupons?clippedStatus=UNCLIPPED
(i.e. for best results, filter for unclipped coupons)

Clip a coupon by hand first - will reveal if you need to log in again.
Press F12, press ESC until Chrome console appears, run.
Brittle - depends on classes etc. being applied consistently.
NB: the count clipped is based on the number of times a coupon is *clicked*. 
  Sometimes the click event doesn't result in a coupon being clipped, in which case the final ctClipped report from talky will be an overestimate
*/


const couponUrl = "https://www.heb.com/digital-coupon/coupon-selection/all-coupons?clippedStatus=UNCLIPPED";

const iframe = document.createElement('iframe');
iframe.setAttribute("src", couponUrl);
iframe.style.cssText = "width: 100%; height: 95vh;"

const progress = document.createElement('span');
updateProgressText("Starting clipper. Don't forget those gosh darn instructions in the comments!");
document.body.replaceChildren(progress, iframe);

function updateProgressText(val) {
	progress.innerText = val;
}

var timesLoaded = 1;
var ctClipped = 0;
const talky = updateProgressText;	// swap with alert or console.log for more/less verbosity
const extraTalky = true, alertWhenDone = true;

// everything to do when loading a fresh coupon page
function onLoadFreshCouponPage() {
	// whether or not we seem to have actually loaded a good coupon page; sometimes there's a security block and we have to refresh until it clears up
	const seemsGood = iframe.contentWindow.document.querySelectorAll("[data-qe-id='clippedCoupons']").length > 0 
		|| iframe.contentWindow.document.querySelectorAll("[data-qe-id='navigationList']").length > 0
		|| iframe.contentWindow.document.querySelectorAll("[data-testid='Log out desktop link']").length > 0
		;

	if (!seemsGood) {
		// refresh and try again
		if (extraTalky) {
			talky(`Clipped ${ctClipped} times so far across ${timesLoaded} batches. HEB page seems angry/borked; will refresh after a delay.`);
		}
		
		const delay = 1000 + (Math.floor(Math.random() * 3000));	// add some jigger under the belief that maybe that'll make the security page less angry
		setTimeout(function() {
			++timesLoaded;
			iframe.src = couponUrl;	// resetting src to couponUrl will reload the iframe, purge the cursor argument, and refire the 'load' event as appropriate
		}, delay);
		return;
	}
	
	var timesNoNext = 0;
	const isPaginated = iframe.contentWindow.document.querySelectorAll("[data-qe-id=paginationList]").length > 0;
	
	// try to get next coupons; return true if there appear to have been more to get
	function getNextCoupons() {
		var next;
		if (isPaginated) {
			// 'next' is next page button
			next = iframe.contentWindow.document.querySelectorAll("[data-qe-id=paginationNext]");
		}
		else {
			// 'next' is the 'view more' button
			next = Array.from(iframe.contentWindow.document.querySelectorAll('[color=curbsideblue], [variant=outline]')).filter(function(elt) { return elt.innerText == 'View more'; });
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
		const coupons = Array.from(iframe.contentWindow.document.querySelectorAll("[data-qe-id=couponCard] button")).filter(function(elt) { return elt.innerText == 'Clip'; }); 
		if (coupons.length) {
			const coupon = coupons[0];
			coupon.scrollIntoViewIfNeeded();
			coupon.click();
			++ctClipped;
			
			if (extraTalky) {
				talky(`clipped ${ctClipped} times so far across ${timesLoaded} batches.`);
			}
		}
		else if ((++timesNoNext) > 10) {
			// neither coupons nor paginated nor 'view more' button, multiple times - 
			// we're done for this iteration; have encountered more than 10 times with no 'view more' (or coupons)
			clearInterval(it);
			
			if (isPaginated) {
				// may need to repeat process
				if (extraTalky) {
					talky(`Reached end of batch ${timesLoaded}; beginning new batch. Clipped ${ctClipped} times so far across ${timesLoaded} batches.`);
				}
				
				++timesLoaded;
				iframe.src = couponUrl;	// resetting src to couponUrl will reload the iframe, purge the cursor argument, and refire the 'load' event as appropriate
			}
			else {
				const finalText = `all done! clipped ${ctClipped} coupons across ${timesLoaded} loads.`
				talky(finalText);
				if (alertWhenDone) {
					alert(finalText);
				}
			}
		}
		else if (isPaginated) {
			// no coupons left to clip, we haven't hit the "no next" stopping point, and we've got a page view going
			getNextCoupons();
			return;
		}
	}, 1000);
}

iframe.addEventListener("load", onLoadFreshCouponPage);
