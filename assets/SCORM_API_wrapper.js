/* 
   Arquivo: SCORM_API_wrapper.js
   Descrição: Wrapper básico para API SCORM 1.2
*/

var pipwerks = {};
pipwerks.SCORM = {
    version: null,
    handleCompletionStatus: true,
    handleExitMode: true,
    API: {
        handle: null,
        isFound: false
    },
    connection: {
        isActive: false
    },
    data: {
        completionStatus: null,
        exitStatus: null
    },
    debug: {
        isActive: true
    }
};

pipwerks.SCORM.init = function() {
    var API = pipwerks.SCORM.API.getHandle(),
        completionStatus = pipwerks.SCORM.status("get");
    
    if (API) {
        pipwerks.SCORM.API.isFound = true;
        pipwerks.SCORM.connection.isActive = true;
    } else {
        pipwerks.SCORM.connection.isActive = false;
    }

    if (completionStatus) {
        pipwerks.SCORM.data.completionStatus = completionStatus;
    }
    
    return pipwerks.SCORM.connection.isActive;
};

pipwerks.SCORM.API.getHandle = function() {
    var API = null,
        win = window;

    if (win.parent && win.parent != win) {
        API = win.parent.API;
    }
    
    if (!API && win.top.opener) {
        API = win.top.opener.API;
    }

    return API;
};

pipwerks.SCORM.status = function(action, status){
    var success = false,
        scorm = pipwerks.SCORM,
        API = scorm.API.getHandle(),
        trace = pipwerks.UTILS.trace,
        traceMsgPrefix = "SCORM.status failure: ";

    if (!action){
        return null;
    } else {
        switch(action){
            case "get": 
                success = scorm.get("cmi.core.lesson_status");
                break;
            
            case "set": 
                if(status !== null){
                    success = scorm.set("cmi.core.lesson_status", status);
                } else {
                    success = false;
                    trace(traceMsgPrefix +"status was not specified.");
                }
                break;
            
            default:
                success = false;
                trace(traceMsgPrefix +"no valid action was specified.");
        }
    }
    
    return success;
};

pipwerks.SCORM.get = function(parameter) {
    var value = "",
        API = pipwerks.SCORM.API.getHandle();
    
    if (API) {
        value = API.LMSGetValue(parameter);
    }
    
    return value;
};

pipwerks.SCORM.set = function(parameter, value) {
    var success = false,
        API = pipwerks.SCORM.API.getHandle();
    
    if (API) {
        success = API.LMSSetValue(parameter, value);
    }
    
    return success;
};

pipwerks.SCORM.quit = function() {
    var success = false,
        API = pipwerks.SCORM.API.getHandle();
    
    if (API) {
        success = API.LMSFinish("");
    }
    
    return success;
};

pipwerks.UTILS = {};

pipwerks.UTILS.trace = function(msg){
    if(pipwerks.SCORM.debug.isActive){
        console.log(msg);
    }
};