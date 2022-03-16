
import { getCssSelector } from 'css-selector-generator'

const port = chrome.runtime.connect({name: 'recordPort'})
function findClosest(query)
{
  return this.closest(query);
}
function getActionDataValue(data, target)
{
  return typeof data === "function" ? data(target) : data;
}

function recordAction(target, actionsData){
    for (const {queries, type, input1, input2} of actionsData) {
        const closestTargets = queries.map(findClosest.bind(target)).filter(e => e);
        if (closestTargets.length) {
          
          const closestTarget = closestTargets[0];
          const inputs = [getActionDataValue(input1, closestTarget),
                          getActionDataValue(input2, closestTarget)];
          const url = window.location.href
          const text = closestTarget.textContent.replace(/[\s0-9]+/g, '')  //.trim() replace(/\s+/g, '')
          const title = document.title.replace(/[\s0-9]+/g, '')
          return sendmsg(type, inputs,url , text,title);
        }
      }
}
function actionRecorder({target, type}){
    const clickActions = [{
        queries: ["button", "input[type='button']", "a[type='button']"],
        type: "click",
        input1: getPath,
        input2: ""
      },
      {
        queries: ["input[type=submit]", "input[type=image]"],
        type: "click-update",
        input1: getPath,
        input2: ""
      },
      {
        queries: ["a[href]",'i','li'],//a[href^='#']", "a[href='']"
        type: "click",
        input1: getPath,
        input2: (closestTarget) => closestTarget.getAttribute("href")
      },
      {
        queries: ["div[class='onload']",'div[onclick]',"div[id='01']","div[id='02']"],
        type: "click",
        input1: getPath,
        input2: ""
      },
      /*{
        queries: ["a[href]"],
        type: "click",
        input1: getPath,
        input2: (closestTarget) => closestTarget.getAttribute("href"),
      }*/

    ];
    const changeActions = [{
        queries: ["input[type='text']", "input[type='password']","input[id='p_email']", "textarea", "select"],
        type: "change",
        input1: getPath,
        input2: (closestTarget) => closestTarget.value
      },
      {
        queries: ["input[type=radio]", "input[type=checkbox]"],
        type: "check",
        input1: getPath,
        input2: ""
      }];
    
    
    
    if (type === "focusout")
        recordAction(target, changeActions);
    if (type === "click")
        recordAction(target, clickActions);
    
        
        
}

function getPath(element) {
    const path = [];
    let cnt = 0
    if (element.nodeType === Node.TEXT_NODE)
      element = element.parentElement;
    if (element.nodeType !== Node.ELEMENT_NODE)
      return false;
  
    while (element && element !== document.documentElement)
    {
      if (element.id) {
        if (element.id.match(/^\d/)) {
          path.unshift(`#\\3${element.id.substr(0,1)} ${element.id.substr(1)}`);
        }else{
          path.unshift(`#${element.id}`);
        }
        cnt += 1
        if (cnt === 2) break
        //break;
      }
      else {
        let tagName = element.nodeName.toLowerCase();
        let sibling = element;
        let numberOfTypes = 1;
        while (sibling = sibling.previousElementSibling) {
          if (sibling.nodeName.toLowerCase() == tagName)
            numberOfTypes++;
        }
        if (numberOfTypes != 1)
          path.unshift(`${tagName}:nth-of-type(${numberOfTypes})`);
        else
          path.unshift(tagName);
      }
      element = element.parentElement;
    }
    return path.length ? path.join(" > ") : false;
}

function sendmsg(type, inputs, url,text,title){
     //console.log({msgType: "RecordedEvent", type, inputs})
     port.postMessage({msgType: "RecordedEvent", type, inputs, url, text, title});
     
}

document.addEventListener("click", actionRecorder, true)
document.addEventListener("focusout",actionRecorder, true)

console.log('start')
