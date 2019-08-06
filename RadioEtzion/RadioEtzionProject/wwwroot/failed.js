function failedInit(nextModules, divId) {
    let divElement = document.getElementById(divId);
    let url = "failed.html";
    let delegateObj = {
        onSuccess: function (response) {
            if (response) {
                divElement.innerHTML = response;
                //fillparameters
                insertParametersObj(this, divElement);
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