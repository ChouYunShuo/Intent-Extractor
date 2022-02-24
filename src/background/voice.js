//window.SpeechRecognition = new webkitSpeechRecognition();



function getPermission() {
    var oldTabID;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        oldTabID = tabs[0].id;
    });
    chrome.tabs.create({
        active: true,
        url: './permission.html'
    }, null);
    var permissionsTabID;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        permissionsTabID = tabs[0].id;
    });
    chrome.tabs.onRemoved.addListener(function switchTab(tabId) {
        if (tabId == permissionsTabID) {
            chrome.tabs.update(oldTabID, {
                selected: true
            }, function() {
                // listen();
                //startRecognition();
                console.log("startRecognition")
            });
            chrome.extension.onRequest.removeListener(switchTab);
        }
    });
};
function searchYoutube(temp) {
    
    var gapikey = process.env.gapikey;
    var q = temp;
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            type: 'video',
            key: gapikey
        },
        function(data) {
            $.each(data.items, function(i, item) {
                var videoID = item.id.videoId;
                var nurl = "https://www.youtube.com/watch?v=" + videoID;
                chrome.tabs.create({
                    'url': nurl
                });
                return false;
            });
        });
    
}
function Speech(say) {
    if ('speechSynthesis' in window ) {
        var utterance = new SpeechSynthesisUtterance(say);
        //if (timevocal == 1) {
            utterance.rate = 0.8
            utterance.volume = 1; // 0 to 1
            utterance.pitch = 1; //0 to 2
            utterance.voiceURI = 'native';
            utterance.lang = "zh-Hans-CN";
            utterance.voice = speechSynthesis.getVoices()[1]
            speechSynthesis.speak(utterance);
            /*timevocal = 0
        //} else {
            utterance.volume = 1; // 0 to 1
            utterance.pitch = 0; //0 to 2
            utterance.voiceURI = 'native';
            utterance.lang = "zh-Hans-CN";
            speechSynthesis.speak(utterance);*/
        //}
    }
}


export {getPermission,searchYoutube,Speech}







