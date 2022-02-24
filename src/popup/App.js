import React from 'react';
import { useState, useEffect } from 'react'
import Header from './component/Header';
import Button from './component/Button'
import {load} from "../db/project";
const bg = chrome.extension.getBackgroundPage().controller;
const App = () => {
    const [Userevents, setEvents] = useState([])

    useEffect(()=>{    
        const groups = load() 
        //console.log(groups)
    },[])
    return (
        <div className='container'>
            <Header></Header>
            <Button
                color={'green'}
                text={'Record'}
                onclick={()=>{
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
        </div>
    )

}

export default App