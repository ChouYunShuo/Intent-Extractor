import React from 'react';
import { useState, useEffect } from 'react'

const App = ()=>{
    useEffect(()=>{    
        console.log(234)
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(function(stream) {
            stream.getTracks().forEach(function (track) {track.stop()});
            close();
        })
        .catch(function(error) {
            alert('Error : Microphone Access Required');
        });
    },[])

    return (<div> get Permission</div>)
}
export default App