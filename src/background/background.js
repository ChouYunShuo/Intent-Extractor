import {getStorageData,setStorageData,addAction,pname,getActions,createProject} from "../db/project";
import {Controller} from "./controller"
import {playProject} from "./actions"
import {getPermission,searchYoutube,Speech } from "./voice"
window.controller = new Controller()
window.controller.recordButtonClick = recordButtonClick
window.controller.stopButtonClick = stopButtonClick
window.controller.playButtonClick = playButtonClick
window.controller.clearButtonClick = clearButtonClick

let lasturl = null
let tabcnt = null
let cur_newtab = false
async function isFirstLoad(){
    const database = await getStorageData(pname)

    if(!Object.keys(database).length){
        const dbItem = {};
        dbItem[pname] = [
            {
              id: 1,
              text: "group",
              type: "group",
              expanded: false,
              subItems: [
                {
                  id: 1,
                  text: "project",
                  type: "project",
                  actions: []
                }
              ]
            }
        ];
        
        await setStorageData(dbItem) 
    }

    chrome.storage.local.get( ["firsttime"], function(items2) {
        if (items2.firsttime === undefined || items2.firsttime === 2) {
            chrome.storage.local.set({
                "firsttime": 3
            }, function() {
                getPermission();
            });
        }
    });
    
}


chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name === "recordPort");
    port.onMessage.addListener(async(msg) => {
        
        if(controller.allowRec) {
            //console.log(msg)
            const {type, url} = msg 
            chrome.tabs.getAllInWindow(null, function(tabs){
                console.log(tabs.length, tabcnt)

                if ((type === 'click'|| type === 'change')  &&tabcnt && tabs.length != tabcnt){ // && tabcnt && tabs.length!= tabcnt
                    console.log({msgType: "RecordedEvent", type:"redirect", inputs:[url,""]},msg)
                    storeRecord([{msgType: "RecordedEvent", type:"redirect", inputs:[url,""]},msg])//cur_newtab = true
                }else{
                    console.log(msg)
                    storeRecord(msg)
                }
                    
                
                
                lasturl = url             
                tabcnt =  tabs.length;   
            });
        }
    });
});

chrome.webNavigation.onCommitted.addListener(({transitionQualifiers, url})=>{
   
    if (transitionQualifiers.includes('from_address_bar')) {
        if(controller.allowRec) {
            console.log({msgType: "RecordedEvent", type:"redirect_from_address_bar", inputs:[url,""]})
            storeRecord({msgType: "RecordedEvent", type:"redirect_from_address_bar", inputs:[url,""]})
            lasturl = url
        }
    }
});

function storeRecord(msg) {
     addAction(controller.recordingGroupId, controller.recordingProjectId, msg);
    
}

async function storeCurrentUrl() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        if(tabs.length){
            const url = tabs[0].url 
            storeRecord({
                msgType: "RecordedEvent",
                type: "redirect",
                inputs: [url, ""]
            });
        }
        
    });
    //const {url} = (await chrome.tabs.query({active: true}))[0];
    
}
async function checkProjectExisted(groupId, projectId){
    const groups = await getStorageData(pname);
   
    const [group] = groups[pname].filter(({id})=> id === groupId)
    
    if (group){
        const [project] = group.subItems.filter(({id}) => id===projectId)
        
        if(project){
            console.log(`Find project: ${groupId,projectId}`)
            return true
        }
        return false
    }else{
        return false
    }
}
async function recordButtonClick(groupId, projectId) {
    const isexisted = await checkProjectExisted(groupId, projectId)
    if (isexisted===false){
        await createProject("test",groupId,"testp",projectId)
    }
    chrome.tabs.getAllInWindow(null, function(tabs){   
        tabcnt =  tabs.length;   
    });
    //console.log(tabcnt)
    controller.record(groupId, projectId);
    await storeCurrentUrl();
    chrome.browserAction.setBadgeText({"text": "rec"});
    
}
async function stopButtonClick() {
    controller.stop();
    chrome.browserAction.setBadgeText({"text": ""});

    const groups = await getStorageData(pname);
    console.log(groups)
    //clearDB()
}

async function playButtonClick(){
    const groups = await getStorageData(pname);
    console.log(groups)
    const groupId= 2
    const projectId  = 2
    const actions = await getActions(groupId, projectId)
    
    if (actions){
        chrome.tabs.create({"url":"https://baidu.com","selected":true}, async tab =>{
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    controller.setProject(actions,projectId, tab.id)
                    console.log("start playing...")
                    playProject()
                }
            });
        }) 
    }

    //await playProject();
    
}

async function clearButtonClick(){
    const database = await getStorageData(pname)
    const dbItem = {};
    dbItem[pname] = [
        {
            id: 1,
            text: "group",
            type: "group",
            expanded: false,
            subItems: [
            {
                id: 1,
                text: "project",
                type: "project",
                actions: []
            }
            ]
        }
    ];
    
    await setStorageData(dbItem) 
}

function startRecognition(){
    const recognition = new webkitSpeechRecognition();
    //recognition.continuous = true;
    //recognition.interimResults = true;
    
    let final_transcript = '';
    recognition.onstart = function(event) {
        
    };
    recognition.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } 
        }
        console.log(final_transcript)
        return tasks(final_transcript)
        
    };
    recognition.onend = function() {
        recognition.stop();
        startRecognition();
    }
    recognition.lang = "zh-Hans-CN"; //zh-Hans-CN en-US zh-Hans-TW 
    recognition.start();
}

function tasks(input){
    if (input.includes('百度搜索')){
        const index = input.indexOf('百度搜索')
        if (index != input.length-4){
            chrome.tabs.create({
                'url': `https://www.baidu.com/s?ie=utf-8&wd=${input.substr(index+4)}`
            })
            
        }
        
    }else if (input.includes('播放')){
        const index = input.indexOf('播放')
        const query = input.substr(index+2)//.split(' ').join('+')
        if (index != input.length-2){
            //chrome.tabs.create({ 'url': `https://www.youtube.com/results?search_query=${query}`})
            searchYoutube(query)
        }
        
    }else if (input.includes('起床')){
       
    }else if(input.includes('info')){
        playButtonClick()
    }

}

isFirstLoad();
startRecognition()