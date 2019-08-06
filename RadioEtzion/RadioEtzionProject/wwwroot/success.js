function successInit(nextModules, divId,a) {
    let divElement = document.getElementById(divId);
    let url = "success.html";
    let delegateObj = {
        onSuccess: function (response) {
            if (response) {
                divElement.innerHTML = response;
                //fillparameters
                insertParametersObj(this, divElement);
            }
        }.bind(this),
        onFailure: function (response) {
        }.bind(this),
        onCompletion: function (response) {
        }.bind(this)
    };



    sendHttpRequest(url, delegateObj);
}