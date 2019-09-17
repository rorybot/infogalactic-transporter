var wikiIdentifier = 'wikipedia.org/wiki'
var igIdentifier = 'infogalactic.com/info'
var redirectedArray = {}

function prepForEntry (url) {
  url = url.replace('.m', '') // Sanitise Mobile sites.
  return url.replace(/https:\/\/.+?\./, 'https://')
}

browser.browserAction.onClicked.addListener(
  function (tab) {
    browser.tabs.query(
      {active: true, currentWindow: true},
      function (tabs) {
        var activeTab = tabs[0]
        var currentURL = activeTab.url
        redirectedArray[activeTab.id] = 'disallowRedirect'

        if (currentURL.includes(wikiIdentifier)) {
          currentURL = currentURL.replace('.m', '') // Sanitise Mobile sites.
          currentURL = currentURL.replace(/https:\/\/.+?\./, 'https://')
          var igURL = currentURL.replace(wikiIdentifier, igIdentifier)
          browser.tabs.update({'url': igURL})
        }

        if (currentURL.includes(igIdentifier)) {
          var wikiURL = currentURL.replace(igIdentifier, wikiIdentifier)
          browser.tabs.update({'url': wikiURL})
        }
      })
  }
)

browser.webRequest.onBeforeRequest.addListener(
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
  {urls: ['*://*.wikipedia.org/*'], types: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'object', 'xmlhttprequest', 'other']},
  ['blocking']
)

browser.tabs.onUpdated.addListener(
  function (tabid, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      console.log(redirectedArray)
      if (!tab.url.includes(wikiIdentifier) && !tab.url.includes(igIdentifier)) {
        redirectedArray[tabid] = 'allowRedirect'
      }
    }
  }
)
