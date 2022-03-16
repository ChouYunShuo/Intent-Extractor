import {load,getStorageData,setStorageData,addAction,pname,getActions,createProject,autoname,tempname} from "../db/project";

import {Controller} from "./controller"
import {autoExtract} from "./extractor"
import {playProject} from "./actions"
import {getPermission,searchYoutube,Speech } from "./voice"
window.controller = new Controller()

window.controller.recordButtonClick = recordButtonClick
window.controller.stopButtonClick = stopButtonClick
window.controller.playButtonClick = playButtonClick
window.controller.clearButtonClick = clearButtonClick
window.controller.voiceButtonClick = voiceButtonClick
window.controller.autoRecordButtonClick = autoRecordButtonClick
window.controller.updateTextIdMap = updateTextIdMap
window.controller.voiceInput = ''

let lasturl = null
let tabcnt = null

function gettextIdMap(db){
    //console.log(db.projects)
    
    if(Array.isArray(db.projects)){
        let result = []
        result.push({});
        result.push({});
        for(let index = 0; index < result.length; index++ ) {
            db.projects[index].subItems.forEach(project => {
                let key = project.text
                let val = project.id
                result[index][key]=  val
            });
        }
        return result
    }
    return []
}

async function isFirstLoad(){
    const database = await getStorageData(pname)
    const isbgRecording = await getStorageData(autoname)
    const tempEvents = await getStorageData(tempname)
    console.log(database)

    if (isbgRecording[autoname] === true){
        controller.autoEventsArray = tempEvents[tempname]
        controller.isAutoRecording = true

        const result = {};
        result[tempname] = [];
        await setStorageData(result);

    }else{
        controller.isAutoRecording = false
    }

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
    controller.textIdMap = gettextIdMap(database)
    //controller.querytask = []
    //console.log(controller.textIdMap)

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



chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(async(msg) => {
        if(controller.allowRec || controller.isAutoRecording) {
            const {type, url} = msg 
            chrome.tabs.getAllInWindow(null, function(tabs){
                //console.log(tabs.length, tabcnt)

                if ((type === 'click'|| type === 'change')  &&tabcnt && tabs.length != tabcnt){ // && tabcnt && tabs.length!= tabcnt
                    //console.log({msgType: "RecordedEvent", type:"redirect", inputs:[url,""]},msg)
                    const time1 = new Date()
                    const time2 = new Date()
                    msg['time'] = time2.toString()
                    storeRecord([{msgType: "RecordedEvent", type:"redirect", inputs:[url,""], time: time1.toString() },msg])//cur_newtab = true
                }else{
                    //console.log(msg)
                    const time2 = new Date()
                    msg['time'] = time2.toString()
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
        if(controller.allowRec || controller.isAutoRecording) {
            const time1 = new Date()
            //console.log({msgType: "RecordedEvent", type:"redirect_from_address_bar", inputs:[url,""], time:time1})
            storeRecord({msgType: "RecordedEvent", type:"redirect_from_address_bar", inputs:[url,""], time:time1.toString()})
            lasturl = url
        }
    }
});

chrome.windows.onRemoved.addListener(async ()=> {
    if (controller.isAutoRecording){
        const result = {};
        result[tempname] = controller.autoEventsArray;
        console.log(controller.autoEventsArray)
        await setStorageData(result);
    }
    
})
chrome.downloads.onCreated.addListener(()=>{
    if(controller.isAutoRecording){
        console.log("file Downloaded!")
        const time1 = new Date()
        storeRecord({msgType: "RecordedEvent", type:"download", inputs:["",""], time:time1.toString()})
    }
    
})
function storeRecord(msg) {
    
    if(controller.allowRec){
        if (Array.isArray(msg)){
            for (let i = 0; i < msg.length; i++) {
                delete msg[i].time
                delete msg[i].text
                delete msg[i].title
            }
        }else{
            delete msg.time
            delete msg.text
            delete msg.title
        }
        console.log(msg)
        
        addAction(controller.recordingGroupId, controller.recordingProjectId, msg);
        return
    }
    console.log(msg)
    
    if (Array.isArray(msg)){
        controller.autoEventsArray.push(msg[0],msg[1])
    }else
    controller.autoEventsArray.push(msg)
}

async function storeCurrentUrl() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        if(tabs.length){
            const url = tabs[0].url 
            const time1 = new Date()
            storeRecord({
                msgType: "RecordedEvent",
                type: "redirect",
                inputs: [url, ""],
                time: time1
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
async function recordButtonClick(groupText, groupId,projectText,projectId) {
    const isexisted = await checkProjectExisted(groupId, projectId)
    if (isexisted===false){
        await createProject(groupText,groupId,projectText,projectId,[])
    }
    chrome.tabs.getAllInWindow(null, function(tabs){   
        tabcnt =  tabs.length;   
    });
   
    //
    //const result = {};
    //result['allowRec'] = true;
    //await setStorageData(result);

    controller.record(projectText, groupId, projectId);
    await storeCurrentUrl();
    chrome.browserAction.setBadgeText({"text": "rec"});
    
}

async function autoRecordButtonClick(){

    if(controller.isAutoRecording){ //stop AutoRecording
        console.log("Stop bg recording")
        controller.stop();
        autoExtract(controller.autoEventsArray)

        const result = {};
        result[autoname] = false;
        await setStorageData(result);
        updateTextIdMap()
        //console.log(controller.autoEventsArray)

       
    }else{ //startAutoRecording()
        console.log("Start bg recording")
        const result = {};
        result[autoname] = true;
        await setStorageData(result);
        controller.autoRecord()
    }

}

async function stopButtonClick() {
    controller.stop();
    chrome.browserAction.setBadgeText({"text": ""});

    updateTextIdMap()
    //const result = {};
    //result['allowRec'] = false;
    //await setStorageData(result);

    //const groups = await getStorageData(pname);
    //console.log(groups)
    //clearDB()
}

async function playButtonClick(groupId,projectId){
    //const groups = await getStorageData(pname);
    //console.log(groups,projectId)
    
    const actions = await getActions(groupId, projectId)
    console.log(actions)
    if (actions){
        chrome.tabs.create({"url":"https://baidu.com","selected":true}, async tab =>{
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    controller.setProject(actions, projectId, tab.id)
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
            text: "official",
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
        },
        {
            id: 2,
            text: "auto_segment",
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
        },
    ];
    
    await setStorageData(dbItem) 
}
async function voiceButtonClick(){
    startRecognition()
}

function startRecognition(){
    const recognition = new webkitSpeechRecognition();
    //recognition.continuous = true;
    //recognition.interimResults = true;
    
    let final_transcript = '';
    recognition.onstart = function(event) {
        console.log("Start Recognition")
    };
    recognition.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } 
        }
        //tasks(final_transcript)
    };
    recognition.onend = function() {
        recognition.stop();
        console.log(final_transcript)
        let text = final_transcript.replace(/[\s]+/g, '') 

        let message = {"type": "voiceinput" ,"content": text};
        controller.recogtext= text
        messagePopup(message) 
        searchText(text)
        //startRecognition();
    }
    recognition.lang = "zh-Hans-CN"; //zh-Hans-CN en-US zh-Hans-TW 
    recognition.start();
}
function searchText(text){
    let autosegment = Object.keys(controller.textIdMap[0])
    controller.querytask = []
    //console.log(text,official)
    for(let i=0; i<autosegment.length;i++){
        let text = autosegment[i]
        controller.querytask.push({gid:1,pid:controller.textIdMap[0][text], text:text})
    }
    /*if (official.includes(text)){
        console.log(controller.textIdMap[0][text],text)
        controller.querytask = [{gid:1,pid:controller.textIdMap[0][text], text:text}]
        return
    }*/
}
async function updateTextIdMap(){
    const database = await getStorageData(pname)
    //console.log(database)
    controller.textIdMap = gettextIdMap(database)
    controller.querytask = []
    searchText(controller.recogtext)
    
}
async function messagePopup(message){
    
    return new Promise(resolve => {
        chrome.runtime.sendMessage(message, async (response) => { 
            console.log(response)
            resolve()
        });
    });
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
        
    }else if(input.includes('info')){
        playButtonClick()
    }

}

isFirstLoad();

/*
$.ajax({ 
    type: "POST",
    data: '{"words":"清华大学网络学堂大数据金融"}',
    url: "https://intentextractor.herokuapp.com/segment",
    success: function(data){        
      console.log(data);
    }
 });*/