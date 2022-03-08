export class Controller{
    constructor(){
        this.allowRec = false;
        this.isAutoRecording = false;
        this.allowPlay = 0;
        this.playingProjectId;

        this.recordingProjectId = null;
        this.recordingGroupId = null;
        this.recordingProjectName = null
        this.instructArray;
        this.playingTabId = null;
        this.instruction;
        this.selectedProjectId;
        this.currentTab;

        this.autoEventsArray;
        this.textIdMap;
        this.querytask = [];
    }

    setProject(actions, curProjectID,newTabId){
        if(this.clipboard == null) {
            this.clipboard = {};
        }

        this.allowPlay = 1;
        if(curProjectID){
            this.playingProjectId = curProjectID 
        }

        this.instructArray = actions;
        this.playingTabId = newTabId;
    }

    stop() {
        this.allowRec = false;
        this.isAutoRecording = false
        this.allowPlay = 0;
        this.paused = 0;
    }

    record(projectName,groupId, projectId) {
        this.recordingProjectId = projectId;
        this.recordingGroupId = groupId;
        this.recordingProjectName = projectName
        this.allowRec = true;
    }
    autoRecord(){
        this.autoEventsArray = []
        this.isAutoRecording = true
    }
    
    
    
    

    
}


