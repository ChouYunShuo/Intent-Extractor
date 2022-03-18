import React, {useState,useEffect} from "react";

const bg = chrome.extension.getBackgroundPage().controller;

const ForeApp = ()=>{
    const [Voiceinputs, setVoiceinputs] = useState('say something...')
    const [isVoice, setIsVoice] = useState(false)
    const [curTask, setCurTask] = useState(bg.querytask)
    let lastTime = 0

    const handleKeyDown = (e)=>{
        if (e.keyCode == 16){
            let curTime = Date.now()
            setTimeout(async ()=>{
                if (curTime>lastTime){
                    bg.voiceButtonClick()
                    setTimeout(()=>{
                        setIsVoice(true)
                    },500)
                }
            },1500)
        }
        if (e.keyCode === 17){
            let curTime = Date.now()
            let task = bg.querytask[0]
            setTimeout(async ()=>{
                if (curTime>lastTime){
                    if (curTask.length){
                        bg.playButtonClick(task['gid'],task['pid'])
                        console.log('start play')
                    }
                    let message = {"type": "close-foreground"};
                    sendMessage(message)
                }
            },2000)
            
        }
    }
    const handleKeyUp = (e)=>{
        if (e.keyCode == 16 || e.keyCode == 17){
            lastTime = Date.now()
        }
    }

    useEffect(()=>{
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse)=>{
            if(request.type == "voiceinput") {
              try {
                setCurTask(bg.querytask)
                if (request.content===''){
                    setVoiceinputs('Please repeat again...')
                }else{
                    setVoiceinputs(request.content)
                }
                
                setIsVoice(false)
                
                sendResponse({complete: true});
              }
              catch(e) {
                sendResponse({complete: true, error: e.name + ': ' + e.message});
              }
              return true;
          }

          })
    },[])
    return(
        <div style={styles.main}>
            <div style={styles.header}>Press shift for voice recognition</div>
            <div style ={styles.body} >
                
                <svg style= {styles.taskicon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {curTask.length>0?<div> {curTask[0]['text']}</div>:<div></div>}
               
            </div>
            <div style={styles.footer}>
                <svg style= {styles.voiceicon} fill="none" stroke={isVoice?"green":"currentColor"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <div>
                {'\u00A0'}{Voiceinputs}
                </div> 
               
            </div>

        </div>
    )

}

async function sendMessage(message){
    return new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var myTabId = tabs[0].id;
            chrome.tabs.sendMessage(myTabId, message, function(response) {
                console.log(response)
                resolve()
            });
        });
    });
}

const styles = {
    main: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23,23,31,1)',
        zIndex: '20',
        //marginBottom:-10,
    },
    header:{
        height:56,
        backgroundColor: 'rgba(64, 64, 83,1)',
        textAlign: 'center',
        paddingTop: 8,
        //paddingLeft:'45px',
        fontSize: 20,
        color: 'white',
        borderBottomRightRadius: '24px',
        borderBottomLeftRadius: '24px',/* 24px */
    },
    body:{
        position: 'relative',
        backgroundColor: 'rgba(23,23,31,1)',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        width: '80%',
        height: '60%',
        color: 'rgba(250,250,249,1)',
        marginTop: -20,
        marginLeft: 45,
        borderRadius: '12px',
        textAlign: 'center',
        display: 'flex',
        //paddingLeft: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        gap:'12px',
        fontFamily: 'sans-serif', //tahoma, verdana, arial, sans-serif;

    },
    footer:{
        backgroundColor: 'rgba(23,23,31,1)',
        height:'100%',
        paddingTop: 12,
        paddingLeft: '45px',
        fontSize: 16,
        color: 'white',
        display: 'flex',
        justifyContent: 'start',
        gap:2
       // alignItems: 'center'
    },
    closebtn:{
        cursor: 'pointer'
    },
    voiceicon:{
        width: 20,
        height: 20,
    },
    taskicon:{
        width: 20,
        height: 20,
        paddingLeft:'-30px',
    },
   
}

export default ForeApp