var wikiIdentifier = 'wikipedia.org/wiki'
var igIdentifier = 'infogalactic.com/info'
var redirectedArray = {}
const iconPaths = {
  dark: {
   '16': './images/IW-16.png',
   '48': './images/IW-48.png',
   '128': './images/IW-128.png'
  },
  light: {
    '16': './images/IW-16-light.png',
    '48': './images/IW-48-light.png',
    '128': './images/IW-128-light.png'
  }
};
const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

function replace_url (url, wikipedia_fragment, infogalactic_fragment) {
  return url.replace(new RegExp('https:\/\/(|en\.|www\.)' + wikipedia_fragment), 'https://' + infogalactic_fragment)
};

chrome.browserAction.setIcon({
  path: darkMode ? iconPaths.light : iconPaths.dark
})

chrome.browserAction.onClicked.addListener(
  function (tab) {
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function (tabs) {
        var activeTab = tabs[0]
        var currentURL = activeTab.url
        redirectedArray[activeTab.id] = 'disallowRedirect'

        if (currentURL.includes(wikiIdentifier)) {
          var igURL = replace_url(currentURL, wikiIdentifier, igIdentifier)
          return chrome.tabs.update({'url': igURL})
        }

        if (currentURL.includes(igIdentifier)) {
          var wikiURL = currentURL.replace(igIdentifier, wikiIdentifier)
          return chrome.tabs.update({'url': wikiURL})
        }
      })
  }
)

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!(details.tabId in redirectedArray)) {
      redirectedArray[details.tabId] = 'allowRedirect'
    }
    if (redirectedArray[details.tabId] === 'allowRedirect') {
      return {
        redirectUrl: replace_url(details.url, wikiIdentifier, igIdentifier)
      }
    }
  },
  {urls: ['*://*.wikipedia.org/*'], types: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'object', 'xmlhttprequest', 'other']},
  ['blocking']
)

chrome.tabs.onUpdated.addListener(
  function (tabid, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (!tab.url.includes(wikiIdentifier) && !tab.url.includes(igIdentifier)) {
        redirectedArray[tabid] = 'allowRedirect'
      }
    }
  }
)
