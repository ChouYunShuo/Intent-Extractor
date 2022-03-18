import React,{useEffect} from 'react';

const Recording = ({recordingProjectName,stopRecording,setrecording}) => {
    return(
        <>
             <div className="bg-body inset-0 flex flex-col justify-between items-center">
                <div className='flex flex-col justify-start w-full mt-6 gap-2 items-start'>
                    <div className="pl-6 text-xl " >
                        Recording
                    </div>
                    <div className="pl-6 text-sm text-secondary" >
                        {recordingProjectName}
                    </div>
                </div>
                <div onClick={()=>{
                    stopRecording() 
                    setrecording(false)}} className='mt-32 cursor-pointer group'>
                    <span className="animate-ping absolute w-40 h-40 rounded-full bg-[#fc356a] opacity-75 z-0 "></span>
                    <svg className="relative w-40  h-40 z-10" fill="#fc356a" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" stroke="#fc356a" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" stroke="white" strokeLinejoin="round" strokeWidth={1} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    <p className="absolute invisible group-hover:visible bg-nav rounded px-2 py-1 mt-4  text-sm">Stop Recording</p>
                    
                </div>
                
            </div>
        </>
       
        
    )

}

export default Recording
