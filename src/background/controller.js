export class Controller{
    constructor(){
        this.allowRec = false;
        this.allowPlay = 0;
        this.playingProjectId;

        this.recordingProjectId = null;
        this.recordingGroupId = null;

        this.instructArray;
        this.playingTabId = null;
        this.instruction;
        this.selectedProjectId;
        this.currentTab;
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
        this.allowPlay = 0;
        this.paused = 0;
    }

    record(groupId, projectId) {
        this.recordingProjectId = projectId;
        this.recordingGroupId = groupId;
        this.allowRec = true;
    }

    
}


