const pname = "projects"
const autoname = "autoRecording"
const tempname = "tempAutoResult"
const idmap = "ids"

const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.local.get(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )
const setStorageData = data =>
  new Promise((resolve, reject) =>
    chrome.storage.local.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  )

async function load() {
    const result = await getStorageData(pname);
    return result[pname];
}

async function saveState(items) {
    const result = {};
    result[pname] = items;
    await setStorageData(result);
}


async function addAction(groupId, subItemId, action) {
    
    const groups = await load();
    const [group] = groups.filter(({id}) => id === groupId);
    if (!group)
      return false;
  
    const [subItem] = group.subItems.filter(({id}) => id === subItemId);
    if (!subItem || !subItem.actions)
      return false;
  
    let {actions} = subItem;
    if (Array.isArray(action)){
      actions.push(action[0],action[1]);
    }else{
      actions.push(action);
    }
    
    await saveState(groups);
    console.log("saved!")
}

async function getActions(groupId, subItemId){
    const groups = await load();
    const [group] = groups.filter(({id}) => id === groupId);
   
    if (!group)
      return null;
    
    const [subItem] = group.subItems.filter(({id}) => id === subItemId);
    if (!subItem || !subItem.actions)
      return null;
    
    const {actions} = subItem;
    return actions
}
async function createProject(groupText, groupId, projectText,projectId){
    
    const groups = await load();
    const [group] = groups.filter(({id}) => id === groupId);
    if (group){
        group.subItems.push({
            id: projectId,
            text: projectText,
            type: "project",
            actions: []
        });
    }
    else{
        groups.push({
            id: groupId,
            text: groupText,
            type: "group",
            expanded: false,
            subItems: [{
                id: projectId,
                text: projectText,
                type: "project",
                actions: []
            }]
        })
    }
    //console.log(groups)

    
    await saveState(groups);
    
}

async function renameProject(groupId,projectId, projectText){
  
    const groups = await load();
    const [group] = groups.filter(({id}) => id === groupId);
   
    if (!group)
      return null;
      
    const [subItem] = group.subItems.filter(({id}) => id === projectId);
    if (!subItem )
      return null;
    subItem['text'] = projectText
    
    await saveState(groups);
    
    console.log("Project renamed to: "+projectText)
    console.log(groups)
}
async function deleteProject(groupId,projectId){
 
  const groups = await load();
  const [group] = groups.filter(({id}) => id === groupId);
  
  if (!group)
    return null;
    
  const newItems = group.subItems.filter(({id}) => id != projectId);
  group['subItems'] = newItems
  
  await saveState(groups);
  
  console.log("Project: "+projectId+" removed!")
  console.log(groups)
}

export {getStorageData,setStorageData,load,saveState,addAction,createProject,getActions,renameProject,deleteProject,pname,idmap,autoname,tempname}