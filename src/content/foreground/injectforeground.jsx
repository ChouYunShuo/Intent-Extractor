function elementSelectorInstance() {
    const rootElementExist = document.querySelector(
      '#app-container.foreground-wrapper'
    );
  
    if (rootElementExist) {
      rootElementExist.style.display = 'block';
        
      return true;
    }
  
    return false;
  }


(async function(){
    try{
        const isAppExists = elementSelectorInstance();
        if (isAppExists) return;
        const rootElement = document.createElement('div');
        rootElement.setAttribute('id', 'app-container');
        rootElement.setAttribute('class', 'foreground-wrapper');
        rootElement.attachShadow({ mode: 'open' });

        document.documentElement.appendChild(rootElement);

        const modal = document.createElement("dialog");

        modal.setAttribute("style", "position:fixed;opacity:0.9;height:30%;width:30%;border:1;border-color: rgb(0 0 0);padding:0;border-radius:15px;overflow-Y:hidden; background-color:rgba(23,23,31,1);");//right:-65%;bottom:-60%
        modal.innerHTML =  
            `<iframe id="frameFetcher" style="height:100%;width:100%;"></iframe>
            <div style="position:absolute; top:8px; right:8px;">  
                    <button style="border-radius:10px;border:1;cursor:pointer">x</button>
                </div>`;
        rootElement.shadowRoot.appendChild(modal);


        const iframe = rootElement.shadowRoot.getElementById("frameFetcher");  
        iframe.src = chrome.extension.getURL("foreground.html")
        iframe.frameBorder = 0;

    }catch (error){
        console.error(error);
    }
    
})()

const rootElement = document.querySelector('#app-container')
const dialog = rootElement.shadowRoot.querySelector("dialog");
let lastTime = Date.now();
dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
    rootElement.setAttribute("style", "z-index:0");
});

const handleKeydown = (e)=>{
    
    if (e.keyCode == 16){
        let curTime = Date.now()
        setTimeout(()=>{
            if (curTime>lastTime){
                dialog.showModal();
                rootElement.setAttribute("style", "position:fixed;inset:0; background-color:rgba(0,0,0,0.3);z-index:100000");
            }
        },1500)
    }
}
const handleKeyup =(e)=>{
    if (e.keyCode == 16){
        lastTime = Date.now()
    }
}
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse)=>{
    if(request.type == "close-foreground") {
        console.log("close-foreground")
      try {
        dialog.close();
        rootElement.setAttribute("style", "z-index:0");
        sendResponse({complete: true});
      }
      catch(e) {
        sendResponse({complete: true, error: e.name + ': ' + e.message});
      }
      return true;
  }

  })
document.addEventListener('keydown', handleKeydown)
document.addEventListener('keyup', handleKeyup)