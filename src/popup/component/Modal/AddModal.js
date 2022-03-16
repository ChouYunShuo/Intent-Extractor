import React,{useRef, useState} from "react";
import { v4 as uuidv4 } from 'uuid'
const AddTaskModal = ({showModal, setshowModal, inputname, setinputname, bgrecord,setrecording}) =>{
    const modalRef = useRef()

    function getInput(val){
        setinputname(val.target.value)
    }
    function startRecord(){
        const pid = uuidv4() 
        bgrecord('official',1,inputname,pid)
        setshowModal(false)
        setrecording(true)
    }

    const closeModal = e=>{
        if (modalRef.current === e.target){
            setshowModal(false)
        }
    }
    return (
        <>
            {showModal ? 
            <div ref = {modalRef} onClick = {closeModal} className="bg-black absolute inset-0 z-20 bg-opacity-50 flex justify-center items-end">
                <div className="bg-nav  w-10/12 mb-8 h-48 rounded-2xl shadow-lg px-4" >
                    <div className="flex text-white justify-between pt-4 ">
                        <div className="text-lg">Record Task</div>
                        <svg onClick={()=>{setshowModal(false)}} className="pt-1 w-6 h-6 cursor-pointer hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <input autoFocus={true} onChange = {getInput} className="text-base focus-within mt-4 bg-input shadow appearance-none border border-input-border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Task name">
                    </input>
                    <div className="mt-10 flex justify-between gap-4 text-base">
                        <button onClick={()=>{setshowModal(false)}} className="bg-secondary w-32 h-10 rounded hover:bg-[#6f6f87]" >Cancel</button>
                        <button onClick={()=>{
                            startRecord()
                        }} className="bg-body w-32 h-10 rounded hover:bg-[#2a2a38]">Start</button>
                    </div>

                    
                </div>
            </div>: null}
        </>
       
      
        
    )
}


export default AddTaskModal //<span className="text-white absolute left-0 top-4 mx-6 px-2">Input</span>  <input type='text' className="mt-2 h-10 w-full px-6 bg-input border-2 border-input-border rounded "></input>