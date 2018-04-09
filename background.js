var redirected = false
var wikiIdentifier = 'wikipedia.org/wiki'
var igIdentifier = 'infogalactic.com/info'
// Called when the user clicks on the browser action.

function prepForEntry(url){
  return url.replace(/https:\/\/.+?\./, 'https://')
}

chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    var currentURL = activeTab.url

    if(currentURL.includes(wikiIdentifier)){
      currentURL = currentURL.replace(/https:\/\/.+?\./, 'https://')
      console.log(currentURL)
      var igURL = currentURL.replace(wikiIdentifier, igIdentifier)
      // chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "redirectedURL": igURL});
      chrome.tabs.update({"url": igURL});
    }

    if(currentURL.includes(igIdentifier)){
      var wikiURL = currentURL.replace(igIdentifier, wikiIdentifier)
      // chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "redirectedURL": wikiURL});
      chrome.tabs.update({"url": wikiURL});
    }
  });

});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  var currentURL = activeTab.url


    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
          if(redirected == false){
                      var redirected = true;
                      return {
                          redirectUrl: prepForEntry(details.url).replace(wikiIdentifier, igIdentifier)
                      };
          }


      },
      {urls: ['*://*.wikipedia.org/*'], types: ['main_frame']},
      ['blocking']
    );
});
