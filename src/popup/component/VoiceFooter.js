import React from 'react';

const VoiceFooter = ({voicetext,onclick,isclicked})=>{
    return(
        <div className="h-28 flex flex-col justify-center items-center">
            <p className="pl-6 py-2 self-start font-white text-sm h-6 mb-4">{voicetext}</p>
            <div
             onClick={onclick}
             className={isclicked ? 'p-2 bg-green-500 rounded-full cursor-pointer mb-4' :'p-2 mb-4 bg-red-500 rounded-full hover:bg-red-300 transition duration-300 ease-in-out animate-pulse hover:animate-none cursor-pointer'}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </div>
            
            
       </div>
    )


}
VoiceFooter.defaultProps = {
    voicetext: '',
}
export default VoiceFooter

