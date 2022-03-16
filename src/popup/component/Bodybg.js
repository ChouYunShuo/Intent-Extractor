import React from 'react';

const Bodybg = () => {
    return(
        <>
            <div className='relative h-96 -mt-10 mx-6 bg-body shadow-2xl rounded-t-3xl  rounded-b-xl '>
                <div className='relative h-10  z-0'></div>
                <div className='relative h-full w-full   animate-[pulse_5s_ease-in-out] bg-top bg-no-repeat bg-[length:180px_180px] bg-[url("../../public/images/bodyai.png")]'>
                    <div className="font-bold text-stone-100 ml-8  text-xl translate-y-52">
                        <p>Creating<br/> beautiful chrome<br/> experiences.</p>
                    </div>
                    
                </div>
            </div>
        </>
       
        
    )

}

export default Bodybg