/*

Mark read up to here in Feedly

find the 'mark as read' button on the element *up to and including which*
you want to mark articles read, store as global variable, then call like
markReadUpToHere(temp1)

Will mark all articles as read if bad eltUntil argument is provided!
This would be the best one for an extension... to just add a button that handles this
so there's no need to monkey around with element inspector

*/

function markReadUpToHere(eltUntil) {	
	for (let readBtn of document.querySelectorAll("[aria-label='Mark as Read']"))
	{
		readBtn.click();
		if (readBtn === eltUntil) {
			break;
		}
	}
}