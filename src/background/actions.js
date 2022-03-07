let cnt = 0
async function playProject(){
    if (controller.allowPlay === 0){
        return 
    }else if(controller.instructArray.length){
       
        chrome.browserAction.setBadgeText({"text": "play"});
        const [instruction] = controller.instructArray.splice(0, 1);
        
        await actionExecution(instruction)
        await playProject()

    }else{
        controller.allowPlay = 0 
        chrome.browserAction.setBadgeText({"text": ""});
    }
}
async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function actionExecution(instruction){
    const {type, inputs} = instruction;
    
    switch (type) {
        case "redirect":{
            await messageContentScript(instruction,0);
            await waitForUpdate();
            //await timeout(100);
            break;
        }
        case "redirect_from_address_bar":{
            await messageContentScript(instruction,0);
            await waitForUpdate();
            //await timeout(100); 
            
            break;
        }
        case "click-update": {
            await messageContentScript(instruction,0);
            await waitForUpdate();
            break;
        }
        case "change":{
            //await timeout(100); 
            await messageContentScript(instruction,0);
            break;
        }
        default: {
            await messageContentScript(instruction,0);
            //await timeout(100); 
            break;
        }
    }
   
}
async function messageContentScript(instruction,errorcnt)
{
    
    const message = {"action": "executeAction" ,instruction};
    const playingTabId = controller.playingTabId;
    console.log( controller.playingTabId,instruction, cnt++)
    await chrome.tabs.update(controller.playingTabId, {highlighted: true});

    return new Promise(resolve => {
        chrome.tabs.sendMessage(playingTabId, message, async (response) => { 
            console.log(response)
            var seconds = (new Date()).getSeconds();
            console.log(seconds);
            if(chrome.runtime.lastError || (response.error && errorcnt === 0)){
                await timeout(3000)
                await messageContentScript(instruction,1)
                resolve()
            }else 
                resolve()
        });
    });
    
}

async function waitForUpdate()
{
  const playingTabId = controller.playingTabId;
  let onUpdate;
  
  return new Promise((resolve) =>
  {
    onUpdate = (tabId , info) => {
      //console.log(tabId,playingTabId)
      if(tabId == playingTabId && info.status == "complete")
        resolve();
    };
    chrome.tabs.onUpdated.addListener(onUpdate);
  }).then(() => chrome.tabs.onUpdated.removeListener(onUpdate));
}



export {playProject}