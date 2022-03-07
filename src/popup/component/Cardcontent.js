import React,{useState,useRef} from 'react';
import { useSearchParams } from 'react-router-dom';

const Cardcontent = ({id,text,playevent,updateStorage})=>{
    const [openMenu,setOpenMenu] = useState(false)
    const [opemRenameModal, setOpenRenameModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [taskname, setTaskName] = useState(text)

    const modalRef = useRef()
    const [dropDownMenuOverflow,setDropDownMenuOverflow] = useState(false)
    

    function CheckOverflow(){
        modalRef.current.getBoundingClientRect().bottom>365? setDropDownMenuOverflow(true) : setDropDownMenuOverflow(false) 
    }
    return(
        
        <div className='relative cursor-pointer'>
            <div ref = {modalRef}  className='flex justify-between items-center bg-input h-24 self-stretch mx-6 p-4 rounded-3xl text-stone-200 hover:border-2 hover:border-input-border text-base'>
            {taskname}
                <div className='pr-2 flex items-center gap-2'>
                    <div onClick={()=>{ playevent(id[0],id[1])}} >
                        <svg className="w-6 h-6 hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div onClick={()=>{
                        CheckOverflow()
                        setOpenMenu(!openMenu)
                    }} className=''>
                        <svg className="w-6 h-6 hover:scale-125 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                        {openMenu?<DropDownMenu setOpenRenameModal = {setOpenRenameModal} setOpenMenu = {setOpenMenu} setOpenDeleteModal = {setOpenDeleteModal} dropDownMenuOverflow={dropDownMenuOverflow}></DropDownMenu>:null}
                       
                       
                    </div>
                    
                </div>
            </div>
            {opemRenameModal?<RenameTask setshowModal = {setOpenRenameModal} renameProject = {updateStorage} setTaskName = {setTaskName} id = {id}/>:null}
            {openDeleteModal?<DeleteTask setshowModal = {setOpenDeleteModal} deleteProject = {updateStorage} id = {id} name ={taskname}/>:null}
        </div>
        
       
        
    )
}

function DropDownMenu({setOpenRenameModal,setOpenDeleteModal,setOpenMenu,dropDownMenuOverflow}){
    const modalRef = useRef()

    const closeModal = e=>{
        if (modalRef.current === e.target){
            setOpenMenu(false)
        }
    }
    
    return(
        <div >
            <div ref = {modalRef} onClick = {closeModal} className='fixed inset-0 h-screen z-0 w-screen'></div>
            <div className={dropDownMenuOverflow?'dropDownMenu -translate-y-40  ':'dropDownMenu -translate-x-32 mt-2'}>
            <div onClick={()=>setOpenRenameModal(true)} className='flex justify-start hover:bg-nav pl-2 pr-6 py-2 rounded-lg gap-2'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Rename
            </div>
            <div onClick={()=>setOpenDeleteModal(true)} className='flex justify-start mt-2 hover:bg-nav pl-2 pr-6 py-2 rounded-lg gap-2'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
            </div>
            </div>
            
        </div>
        
    )
}

function DeleteTask({setshowModal,id, deleteProject,name}){
    const modalRef = useRef()
    
    const closeModal = e=>{
        if (modalRef.current === e.target){
            setshowModal(false)
        }
    }
    return(
        <>
            <div ref = {modalRef} onClick = {closeModal} className="bg-black fixed inset-0 h-screen z-20 w-screen  bg-opacity-50 flex justify-center items-end">
                <div className="bg-nav w-10/12 mb-8 h-48 rounded-2xl shadow-lg px-4" >
                    <div className="flex text-white justify-between pt-4 ">
                        <div className="text-lg">Delete Task</div>
                        <svg onClick={()=>{setshowModal(false)}} className="pt-1 w-6 h-6 cursor-pointer hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className='text-sm mt-6 text-stone-200'>Are you sure to delete "{name}"?</div>
                    <div className="absolute bottom-12 flex justify-between text-base gap-4 pl-3">
                        <button onClick={()=>{setshowModal(false)}} className="bg-secondary w-28 h-10 rounded hover:bg-[#6f6f87]" >Cancel</button>
                        <button onClick={ ()=>{
                            setshowModal(false)
                            deleteProject('delete',[id[0],id[1]])}        
                        } className="bg-red-500 w-28 h-10 rounded hover:bg-red-600">Confirm</button>
                    </div>

                    
                </div>
            </div>
        </>
    )
}
function RenameTask({setshowModal,renameProject, id, setTaskName}){
    const modalRef = useRef()
    const [tempname, setTempname] = useState(null)
    const closeModal = e=>{
        if (modalRef.current === e.target){
            setshowModal(false)
        }
    }
    function getInput(val){
        setTempname(val.target.value)
    }
    return(
        <>
            <div ref = {modalRef} onClick = {closeModal} className="bg-black fixed inset-0 h-screen z-20 w-screen  bg-opacity-50 flex justify-center items-end">
                <div className="bg-nav w-10/12 mb-8 h-48 rounded-2xl shadow-lg px-4 transition-all duration-500 ease-in-out" >
                    <div className="flex text-white justify-between pt-4 ">
                        <div className="text-lg">Rename Task</div>
                        <svg onClick={()=>{setshowModal(false)}} className="pt-1 w-6 h-6 cursor-pointer hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <input autoFocus={true} onBlur = {getInput} className="text-base focus-within mt-4 bg-input shadow appearance-none border border-input-border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Task name">
                    </input>
                    <div className="mt-10 flex justify-between gap-4 text-base">
                        <button onClick={()=>{setshowModal(false)}} className="bg-secondary w-32 h-10 rounded hover:bg-[#6f6f87]" >Cancel</button>
                        <button onClick={ ()=>{
                            if(tempname!=''){
                                setshowModal(false)
                                setTaskName(tempname)
                                renameProject('rename',[id[0],id[1],tempname])} 
                            else alert('Name can not be empty')   
                            }
                                
                        } className="bg-body w-32 h-10 rounded hover:bg-[#2a2a38]">Rename</button>
                    </div>

                    
                </div>
            </div>
        </>
    )
}
export default Cardcontent

/*
 <div className='mx-8 bg-badge rounded-full text-xs uppercase py-1 px-2 absolute top-0  mt-1'>
                <span>10 times</span>
            </div>
*/
