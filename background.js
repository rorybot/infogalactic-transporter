
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    var currentURL = activeTab.url
    var wikiIdentifier = 'wikipedia.org/wiki'
    var igIdentifier = 'infogalactic.com/info'

    if(currentURL.includes(wikiIdentifier)){
      currentURL = currentURL.replace(/https:\/\/.+?\./, 'https://')
      console.log(currentURL)
      var igURL = currentURL.replace(wikiIdentifier, igIdentifier)
          chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "redirectedURL": igURL});
    }

    if(currentURL.includes(igIdentifier)){
      var wikiURL = currentURL.replace(igIdentifier, wikiIdentifier)
          chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "redirectedURL": wikiURL});
    }



    // console.log(urlChoices.indexOf(currentURL))
    // console.log(Number.isInteger(urlChoices.indexOf(currentURL)))






  });

});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.update({"url": request.url});
      console.log('bob')
    }
  }
);
