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
    const [targetEvents, settargetEvent ] = useState([])

    const cards = [{gid:1,pid:"26e8c9dc-ccea-4b75-a585-f8010753c302", text:'tesst'},
                    {gid:1,pid:"04e3e5b6-cc6b-4914-8a4b-f5518217175a", text:'dinglebell'},
                    {gid:1,pid:'f8ff101e-3917-4ffd-8c5f-a145f718e32a',text:'dingleVPN' },
                    {gid:1,pid:'fc3caf83-a27e-441f-96cf-717a69177c2b',text:'dingleVPN' },
                    {gid:1,pid:'f18a0e89-f771-436d-ad89-bb3dc1512da0',text:'dingleVPN' },
                    {gid:1,pid:'48c148cd-f6dd-4cc6-81e1-ee8cc167adca',text:'dingleVPN' },
                    {gid:1,pid:'28334247-fa13-46c5-bae1-24914169bdd4',text:'dingleVPN' },
                    {gid:1,pid:'f8ff101e-3917-4ffd-8c5f-a145f718e32a',text:'dingleVPN' }]
    
    const cardsmap = cards.map(({gid,pid,text})=>
                        <Cardcontent key={pid} id ={[gid,pid]} text={text} playevent={bg.playButtonClick}
                                    updateStorage = {updateStorage} />)

    useEffect(() => {
        const getData = async () => {
          await fetchMessages()
        }
        getData()
        
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

  
    return (
        recording ?
        <Recording recordingProjectName={inputname}
        stopRecording = {bg.stopButtonClick} setrecording = {setrecording}/> : 
        <>
            <Navbar addTask = {openAddModal} autoRecord = {openAutoRecModal} isAutoRecording = {autoRecording} />
            <div className="relative overflow-auto h-96 -mt-10 flex flex-col justify-start gap-2 z-10">
                {cardsmap}
            </div>
           
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
            <AddTaskModal showModal= {showAddModal} setshowModal = {setshowAddModal} 
                   inputname = {inputname} setinputname = {setinputname}
                   bgrecord = {bg.recordButtonClick} setrecording = {setrecording}>
            </AddTaskModal>
            <AutoRecModal showModal= {showAutoRecModal} setshowModal = {setshowAutoRecModal} 
                bgrecord = {bg.autoRecordButtonClick} isAutoRecording = {autoRecording} setrecording = {setAutoRecording}>
            </AutoRecModal>
        </>
       
    )

}

async function updateStorage(type, msg){
    console.log(type, msg)
    if(type === 'rename'){
        await renameProject(msg[0],msg[1],msg[2])
        
    }
    if (type === 'delete'){
        await deleteProject(msg[0],msg[1])

    }
}
export default App


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