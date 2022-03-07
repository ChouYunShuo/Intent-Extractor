let clipboard = {}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse)=>{
  if(request.action == "executeAction") {

    try {
       await executeAction(request.instruction).then(()=>{
        sendResponse({complete: true, action: request.instruction});
       })   
    }
    catch(e) {
      // We want to continue playing project when action has error.
      sendResponse({complete: true, error: e.name + ': ' + e.message});
    }
    return true;
}
})

async function executeAction(instruction)
{
  
    let {type, inputs} = instruction;
    let [input1, input2] = inputs;
    console.log(instruction)
    if (input2)
      if (type === 'click' && input2!= null && (input2.substr(0,1) ==='/') || (input2.substr(0,4) ==='http')){
        input1 = input2;
        type = 'redirect';
      }
    switch(type){
        case "change": {
            const targetElement = document.querySelector(input1);
            targetElement.focus();
            const eventOptions = {"bubbles": true};
            const editableParent = targetElement.closest('[contenteditable="true"]');
            if (editableParent)
            {
              targetElement.innerHTML = placeholders(input2);
              const event = new Event("input");
              targetElement.dispatchEvent(event, eventOptions);
            }
            else
            {
              targetElement.value = placeholders(input2);
              const event = new Event("change");
              targetElement.dispatchEvent(event, eventOptions);
            }
            break;
          }
          case "click-update":
          case "click": {
            
            const targetElement = document.querySelector(input1);
            const options = { "bubbles": true };
            targetElement.dispatchEvent(new MouseEvent("mousedown"), options);
            targetElement.focus();
            targetElement.click();
            targetElement.dispatchEvent(new MouseEvent("mouseup"), options);

            break;
          }
          case "check": {
            document.querySelector(input1).checked = true;
            break;
          }
          case "redirect": {
            if (input1!='chrome://extensions/')
              window.location = input1;
            break;
          }
          case "redirect_from_address_bar": {
            window.location = input1;
            break;
          }
          default:
            break;
    }
    
}

function placeholders(checkValue) {
    const patt= /<\$unique=.*?>/;
    const pastPatt = /<\$past>/;
    const clipPatt = /<\$clipboard=.*?>/;
    if(patt.test(checkValue)) {
      const uniquePlaceholder = patt.exec(checkValue)[0];
      const lastIndex = uniquePlaceholder.indexOf(">");
      const firstIndex = uniquePlaceholder.indexOf("=");
      const length = uniquePlaceholder.slice(firstIndex+1, lastIndex);
      const currentTime = new Date().getTime() + '';
      const unique = currentTime.substring(currentTime.length - length);
      return checkValue.replace(patt, unique);
    }
    else if(pastPatt.test(checkValue)) {
      return clipboard["copy"];
    }
    else if(clipPatt.test(checkValue)) {
      const clipPlaceholder = clipPatt.exec(checkValue)[0];
      const lastIndex = clipPlaceholder.indexOf(">");
      const firstIndex = clipPlaceholder.indexOf("=");
      const clipAttr = clipPlaceholder.slice(firstIndex+1, lastIndex);
      return checkValue.replace(clipPlaceholder, clipboard[clipAttr]);
    }
    else {
      return checkValue;
    }
  }