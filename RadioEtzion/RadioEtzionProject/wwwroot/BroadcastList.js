/// <reference path="audiotag.js" />
function BroadcastListInit(nextModules, divID,userObj) {
    let divElement = document.getElementById(divID);
    let url = "BroadcastList.html";

    let delegateObj = { 
        onSuccess: function (response) {
            
            if (response) {
                divElement.innerHTML = response;
                insertParametersObj(this, divElement);

                let delegateObj = {
                    onSuccess: function (response) { // response = list of tracks
                      
                        let tracks = JSON.parse(response);
                        AudioInit(tracks);
                    }.bind(this),
                    onFailure: function () {
                        nextModules.onFailure(); // module 3

                    }.bind(this)

                };
                sendHttpRequest("api/Broadcast/get", delegateObj, JSON.stringify(userObj)); // getting tracks from storage

            

                //this.imgSearch.onclick = function () {
                   
                //}.bind(this);


            }
        },


        onFailure: function () {

            nextModules.onFailure();
        }.bind(this)
 
    };

    sendHttpRequest(url, delegateObj);

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
}

