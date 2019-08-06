function toolbarInit(nextModules, divId,UserObj) {
    let divElement = document.getElementById(divId);
    let url = "toolbar.html";
    this.UserObj = UserObj;
    let delegateObj = {
        onSuccess: function (response) {
            if (response) {
                divElement.innerHTML = response;
                //fillparameters
                insertParametersObj(this, divElement);
            
                if (UserObj && UserObj.userFirstName.length > 0 && UserObj.userToken.length>0 ) {
                    this.username = UserObj.userFirstName;
                    this.token = UserObj.userToken;
                        connectedUserUI(nextModules, this, UserObj);
                    
                }
                else {
                    notConnectedUserUI(nextModules, this);
                }
            }
        }.bind(this),
        onFailure: function (response) {    
            console.log("bad");
        }.bind(this),
        onCompletion: function (response) {
        }.bind(this)
    };



    sendHttpRequest(url, delegateObj);





}
//function cheakForConnectedUser(username, Token, UserObj) {
//    return true;
//}


function notConnectedUserUI(nextModules,ObjRef) {
    ObjRef.signinOrSignout.innerHTML = "התחברות";
    ObjRef.signinOrSignout.onclick = function () {
        nextModules.signin();
    }
    ObjRef.registerOrUpdate.innerHTML = "הרשמה";
    ObjRef.registerOrUpdate.onclick = function () {
        nextModules.register();
    }
    ObjRef.showBrodcast.innerHTML = "דף בית";
    ObjRef.showBrodcast.onclick = function () {
        nextModules.home();
       // alert("ok");//
    }
}

function connectedUserUI(nextModules, ObjRef, UserObj) {
    ObjRef.signinOrSignout.innerHTML = "התנתק";
    ObjRef.signinOrSignout.onclick = function () {
        let url = "api/Users/logout";
        let delegateObj = {
            onSuccess: function (response) {
                if (JSON.parse(response) === true) {
                   
                    nextModules.signOut();
                    
                }

            }.bind(this),
            onFailure: function (response) {
          
                nextModules.onFailure();
            }.bind(this),
            onCompletion: function (response) {
        
                 
            }.bind(this)

        };
        sendHttpRequest(url, delegateObj, JSON.stringify(UserObj));

    }.bind(this);
    ObjRef.registerOrUpdate.innerHTML = "עדכון פרטים";
    ObjRef.registerOrUpdate.onclick = function () {
        nextModules.update(UserObj);
        //to add corret module
    }
    ObjRef.showBrodcast.innerHTML = "שידורים";
    ObjRef.showBrodcast.onclick = function () {
        nextModules.broadcastList(ObjRef.UserObj);
    }
    //    to add corret module
    ObjRef.aConnectedUser.innerHTML = "שלום " + ObjRef.UserObj.userFirstName;
}




