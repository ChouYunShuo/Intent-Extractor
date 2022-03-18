import React from 'react';
import { useState, useEffect } from 'react'
import Navbar from './component/Navbar';
import VoiceFooter from './component/VoiceFooter';
import Cardcontent from './component/Cardcontent';
import Button from './component/Button'
import {load,getStorageData,renameProject,deleteProject} from "../db/project";
import AddTaskModal from './component/Modal/AddModal';
import AutoRecModal from './component/Modal/BgRecModal'

import Recording from './component/Recording';
import Bodybg from './component/Bodybg';

const bg = chrome.extension.getBackgroundPage().controller;
const App = () => {
    const [Userevents, setEvents] = useState([])
    const [Voiceinputs, setVoiceinputs] = useState('')
    const [VoiceButtonClicked, setVoiceButtonClicked] = useState(false)
    const [showAddModal, setshowAddModal] = useState(false) // show adding task modal
    const [inputname, setinputname] = useState(null) // input project name for adding a task
    const [recording, setrecording] = useState(bg.allowRec)
    const [showAutoRecModal, setshowAutoRecModal] = useState(false) // show auto record modal
    const [autoRecording, setAutoRecording] = useState(bg.isAutoRecording)
    const [targetEvents, settargetEvent] = useState([])
    

    /*const cards = [{gid:1,pid:"dc96ee32-6a40-41f3-ae0b-67da141af45c", text:'12306test'},
                    {gid:1,pid:"04e3e5b6-cc6b-4914-8a4b-f5518217175a", text:'dinglebell'},
                    {gid:1,pid:'f8ff101e-3917-4ffd-8c5f-a145f718e32a',text:'dingleVPN' },
                    {gid:1,pid:'a49c5c2c-af58-46eb-977a-52b373d6eb03',text:'test123' },]*/
    
    const cardsmap = targetEvents.map(({gid,pid,text})=>
                        <Cardcontent key={pid} id ={[gid,pid]} text={text} playevent={bg.playButtonClick}
                                    updateStorage = {updateStorage} />)

    useEffect(() => {
        const getData = async () => {
          await fetchMessages()
        }
        getData()
        settargetEvent([])
      }, [])

    // Fetch data from chrome storage
    const fetchMessages = async () => {
        const groups = await load() 
        console.log(groups)
        if(recording){
            const [group] = groups.filter(({id}) => id === bg.recordingGroupId);
            if (group){
                const [subItem] = group.subItems.filter(({id}) => id === bg.recordingProjectId);
                if (subItem)
                    setinputname(subItem.text)
            }
        }
        setEvents(groups)
    }


    useEffect(()=>{
        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse)=>{
            if(request.type == "voiceinput") {
              try {
                setVoiceinputs(request.content)
                setVoiceButtonClicked(false)
                sendResponse({complete: true});
                
              }
              catch(e) {
                sendResponse({complete: true, error: e.name + ': ' + e.message});
              }
              return true;
          }
          })
    },[])

    const openAddModal = ()=>{
        setshowAddModal(cur=>!cur)
    }
    const openAutoRecModal = ()=>{
        setshowAutoRecModal(cur=>!cur)
    }
    const showAllTasks = async () =>{
        await bg.getAllOfficial()
        settargetEvent(bg.querytask)
    }

  
    return (
        recording ?
        <Recording recordingProjectName={inputname}
        stopRecording = { bg.stopButtonClick} setrecording = {setrecording}/> : 
        <>
            <Navbar addTask = {openAddModal} autoRecord = {openAutoRecModal} showTask = {showAllTasks} isAutoRecording = {autoRecording} />
            {targetEvents.length>0 ?
                <div className="relative overflow-auto h-96 -mt-10 flex flex-col justify-start gap-2 z-10">
                    {cardsmap}
                </div>:<Bodybg/>
            }
    
           
            
            <AddTaskModal showModal= {showAddModal} setshowModal = {setshowAddModal} 
                   inputname = {inputname} setinputname = {setinputname}
                   bgrecord = {bg.recordButtonClick} setrecording = {setrecording}>
            </AddTaskModal>
            <AutoRecModal showModal= {showAutoRecModal} setshowModal = {setshowAutoRecModal} autoEventsArray = {bg.autoEventsArray}
                bgrecord = {bg.autoRecordButtonClick} isAutoRecording = {autoRecording} setrecording = {setAutoRecording}>
            </AutoRecModal>
        </>
       
    )
}

async function updateStorage(type, msg){
    //console.log(type, msg)
    if(type === 'rename'){
        await renameProject(msg[0],msg[1],msg[2])
        bg.updateTextIdMap()
        
    }
    if (type === 'delete'){
        await deleteProject(msg[0],msg[1])
        bg.updateTextIdMap()
    }
}
export default App
/*
<VoiceFooter
                onclick = {async ()=>{
                    await bg.voiceButtonClick()
                    setTimeout(()=>{
                        setVoiceButtonClicked(true)
                    },1000)
                }}
                voicetext = {Voiceinputs}
                isclicked = {VoiceButtonClicked}
            />
*/

/*
 <Cardcontent/>
            <VoiceFooter/>
<Button
                color={'green'}
                text={'Record'}
                onclick={()=>   {
                    bg.recordButtonClick(2,2)
                }}
            />
            <Button
                color={'red'}
                text={'Stop'}
                onclick={()=>{
                    bg.stopButtonClick()
                }}
            />
            <Button
                color={'purple'}
                text={'Play'}
                onclick={()=>{
                    bg.playButtonClick()
                }}
            />
            <Button
                color={'brown'}
                text={'Clear'}
                onclick={()=>{
                    bg.clearButtonClick()
                }}

            />
*/