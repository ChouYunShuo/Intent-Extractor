import {getStorageData,pname,createProject,addAction} from "../db/project";
import { v4 as uuidv4 } from 'uuid'
async function autoExtract(events){
   
    console.log("start auto Extraction")

    let lasttime = events[0].time
    let lastTitle = ''
    let cur_keywords = ''
    let cur_task = []
    let isdownload = false

    const updateText = (element)=>{
        if(element.text){
            cur_keywords+=element.text
        }
        if(element.title && element.title!=lastTitle){
            if(lastTitle===''){
                cur_keywords+=element.title
            }
            cur_keywords+=element.title
            lastTitle = element.title
        }
    }
    const updateTask = (element)=>{
        if(element.type ==='download'){
            isdownload = true
        }
        const newelement = (({ msgType, type ,inputs,url}) => ({ msgType, type ,inputs,url}))(element);
        cur_task.push(newelement)
    }

    for(let index = 0; index < events.length; index++ ) {
        const interval = getInterval(events[index].time,lasttime)
        const element = events[index]

        if(interval > 1 && element.type === 'redirect_from_address_bar'){ // segmentation condition 
           
            let response = await getSegment(cur_keywords)
            const result = JSON.parse(response).result
            if(isdownload){
                result+=',下载'
            }
            extractionStorage(result,cur_task)

            cur_keywords = ''
            cur_task = []
            lastTitle = ''
            isdownload = false
        }

        updateTask(element)
        updateText(element)
        
    }

    console.log(cur_keywords)
    let response = await getSegment(cur_keywords)
    const result = JSON.parse(response).result

    console.log(result)
    console.log(cur_task)
    extractionStorage(result,cur_task)

}
async function getSegment(text){
    let jsontext = `{"words":"${text}"}`
    //console.log(jsontext)
    return new Promise((resolve) => {
        $.ajax({
            type: 'POST',
            url: "https://intentextractor.herokuapp.com/segment",
            data: jsontext,
            success: function (res) {
                resolve(res)
            },
            fail: function (xhr, ajaxOptions, thrownError) {
                resolve(false)
            },
        })
    })
}
function getInterval(time1, time2){
    return (time1.getTime()-time2.getTime())/(1000*60)
}
                          
async function extractionStorage(projectText,action){
    const pid = uuidv4() 
    await createProject("", 2, projectText,pid,action)
}
export {autoExtract}