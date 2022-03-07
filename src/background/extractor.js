//var nodejieba = require("nodejieba");
//import {} from 'nodejieba';
function autoExtract(events){
    console.log("start auto Extraction")

    let lasttime = events[0].time
    let cur_keywords = new Set()
    let extract_results = []
    let cur_task = {}

    events.forEach((element,index) => {

        const interval = getInterval(element.time,lasttime)
        console.log(interval, element)
        if(interval >3 && element.type === 'redirect_from_address_bar'){
            //console.log(element)
        }else{
            if(element.text){

            }
        }
        
    });


}

function getInterval(time1, time2){
    return (time1.getTime()-time2.getTime())/(1000*60)
}
                          
function extractionStorage(){

}
export {autoExtract}