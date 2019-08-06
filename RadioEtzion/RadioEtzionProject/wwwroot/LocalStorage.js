function ValidateLocal(nextModule) {
    if ((localStorage.getItem("userFirstName") && localStorage.getItem("userEmail") && localStorage.getItem("userToken") && localStorage.getItem("userFirstName").length > 0) && (localStorage.getItem("userToken").length > 0) && (localStorage.getItem("userEmail").length > 0)) {

        let obj = {
            userToken: localStorage.getItem("userToken"),
            userEmail: localStorage.getItem("userEmail"),
            userFirstName: localStorage.getItem("userFirstName"),
        }
        let delegateObj = {
            onSuccess: function (response) {
                if (response === "false") {
                    localStorage.setItem("userFirstName", "");
                    localStorage.setItem("userEmail", "");
                    localStorage.setItem("userToken", "");
                    nextModule.LocalStorage();
                }
                else {
                    nextModule.LocalStorage(obj);
                }
            }.bind(this),
            onFailure: function (response) {
                localStorage.setItem("userFirstName", "");
                localStorage.setItem("userEmail", "");
                localStorage.setItem("userToken", "");

            }.bind(this),

        };

        sendHttpRequest("api/Users/IsConnected", delegateObj, JSON.stringify(obj));
    }
    else {
        nextModule.LocalStorage();
    }

}