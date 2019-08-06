function signInInit(nextModules, divId) {
    let divElement = document.getElementById(divId);
    let url = "signInModule.html";
    let delegateObj = {
        onSuccess: function (response) {
            if (response) {
                divElement.innerHTML = response;

                //fillparameters
                insertParametersObj(this, divElement);

                this.txtPassword.onkeypress = function (event) {
                    keyPress(this, event);
                }
                //fill actions of elements
                this.btnSend.onclick = function myfunction() {
                 
                    emptyError(this);
                    if (validateFields(this)) {
                        LockUI(this, true);
                        let email = this.txtEmail.value;
                        let password = this.txtPassword.value;

                        let delegateObj = {
                            onSuccess: function (response) {
                                if (response) {
                                    let user = JSON.parse(response);
                                    if (user.userToken &&  user.userEmail) {
                                        if (user.userToken.length > 0 && user.userEmail.length > 0) {
                                            cleanFileds(this);
                                            localStorage.setItem("userFirstName", user.userFirstName);
                                            localStorage.setItem("userEmail", user.userEmail);
                                            localStorage.setItem("userToken", user.userToken);
                                            nextModules.onSuccess(user);
                                        }
                                    }
                                    else {
                                      //  console.log("login Failed");
                                        cleanFileds(this);
                                        this.divErrorConnect.innerHTML = "שם משתמש וסיסמא לא תואמים";
                                    }
                                }
                                else {
                                    console.log("login Failed");
                                    cleanFileds(this);
                                    nextModules.onFailure();
                                }
                            }.bind(this),
                            onFailure: function (response) {
                                nextModules.onFailure();

                            }.bind(this),
                            onCompletion: function (response) {
                                LockUI(this, false);
                            }.bind(this)
                        };
                        sendHttpRequest("api/users/get?userEmail=" + email + "&userPassword=" + password, delegateObj);
                    }

                }.bind(this);
                
                
            }
        }.bind(this),
        onFailure: function (response) {
            console.log("bad");
        }.bind(this),
        onCompletion: function (response) {
        }.bind(this)
    };
        
    

    sendHttpRequest(url, delegateObj);

    function validateFields(ref) {

        let flag = true;

        let email = this.txtEmail.value;
        if (email.length == 0) { // email is empty
            ref.divErrorEmail.innerHTML = "יש למלא כתובת אימייל";
            flag = false;
        }
        else {
            let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(mailformat)) {
                ref.divErrorEmail.innerHTML = "כתובת אימייל שגויה";
                flag = false;
            }
        }
        let password = this.txtPassword.value;
        if (password.length == 0) {
            ref.divErrorPassword.innerHTML = "יש להזין סיסמה";
            flag = false;
        }

        return flag;
    }

    function LockUI(ref, toLock) { // lock/unlock


        ref.txtEmail.disabled = toLock;
        ref.txtPassword.disabled = toLock;


    }

    function emptyError(ref) {
        ref.divErrorEmail.innerHTML = "";
        ref.divErrorPassword.innerHTML = "";
        ref.divErrorConnect.innerHTML = "";
    }

    function cleanFileds(ref) {
        ref.txtEmail.value = "";
        ref.txtPassword.value = "";

    }
    function keyPress(ref,event) {

        if (event.keyCode == 13) {

            this.btnSend.onclick();

        }

    }

}




