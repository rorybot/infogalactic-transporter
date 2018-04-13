var wikiIdentifier = 'wikipedia.org/wiki'
var igIdentifier = 'infogalactic.com/info'
var redirectedArray = {}

function prepForEntry (url) {
  return url.replace(/https:\/\/.+?\./, 'https://')
}

chrome.browserAction.onClicked.addListener(
  function (tab) {
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function (tabs) {
        var activeTab = tabs[0]
        var currentURL = activeTab.url
        redirectedArray[activeTab.id] = 'disallowRedirect'

        if (currentURL.includes(wikiIdentifier)) {
          currentURL = currentURL.replace(/https:\/\/.+?\./, 'https://')
          var igURL = currentURL.replace(wikiIdentifier, igIdentifier)
          chrome.tabs.update({'url': igURL})
        }

        if (currentURL.includes(igIdentifier)) {
          var wikiURL = currentURL.replace(igIdentifier, wikiIdentifier)
          chrome.tabs.update({'url': wikiURL})
        }
      })
  })

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!(details.tabId in redirectedArray)) {
      redirectedArray[details.tabId] = 'allowRedirect'
    }
    if (redirectedArray[details.tabId] === 'allowRedirect') {
      return {
        redirectUrl: prepForEntry(details.url).replace(wikiIdentifier, igIdentifier)
      }
    }
  },
  {urls: ['*://*.wikipedia.org/*'], types: ['main_frame']},
  ['blocking']
)

chrome.tabs.onUpdated.addListener(
  function (tabid, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      console.log(redirectedArray)
      if (!tab.url.includes(wikiIdentifier) && !tab.url.includes(igIdentifier)) {
        redirectedArray[tabid] = 'allowRedirect'
      }
    }
  }
)
