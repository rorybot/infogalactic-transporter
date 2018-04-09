chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log('I have the URL and it is', request.redirectedURL)

      chrome.runtime.sendMessage({"message": "redirect", "url": request.redirectedURL});
    }
  }
);


if(window.location.origin.includes('wikipedia.org')){
  window.onbeforeunload = function() {
    chrome.runtime.sendMessage({"message": "goodbye"});
    console.log("arrggghhh")
  }
}
