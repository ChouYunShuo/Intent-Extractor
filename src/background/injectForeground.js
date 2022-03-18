
function injectForeground(tabId){
    chrome.tabs.executeScript(tabId, {file:'./injectforeground.js',  allFrames: true})
}


export {injectForeground}