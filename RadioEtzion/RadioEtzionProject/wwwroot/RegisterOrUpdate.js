function RegisterOrUpdateInit(nextModules, divID, userObject) {
    let divElement = document.getElementById(divID);
    let url = "RegisterOrUpdate.html";
    let delegateObj = {

        // maybe netModules contains fun.s that activate other modules. The fun.s that change this module will be defined here.

        onSuccess: function (response) { // success on loading the html file
            if (response) {
                divElement.innerHTML = response;
                insertParametersObj(this, divElement);

                if (userObject) {
                    if (userObject.userEmail && userObject.userToken) {
                        let delegate = {
                            onSuccess: function (response) {
                                if (response) {
                                    let userInfo = JSON.parse(response);
                                    if (userInfo.userEmail && userInfo.userFirstName && userInfo.userLastName && userInfo.userPhone) {
                                        this.txtEmail.value = userInfo.userEmail;
                                        this.txtFirstName.value = userInfo.userFirstName;
                                        this.txtLastName.value = userInfo.userLastName;
                                        this.txtPhone.value = userInfo.userPhone;

                                        this.txtEmail.disabled = true;

                                    } else {
                                        console.log("user from server doesn't contain full details");
                                        nextModules.onFailure();
                                    }
                                    
                                }
         
                            }.bind(this),
                            onFailure: function () { nextModules.onFailure(); }
                        };
                        // http message will return if the user is logged in (then it will return all its properties)
                        sendHttpRequest("api/Users/checkForUpdate", delegate, JSON.stringify(userObject));


                        this.btnRegisterOrUpdate.value = "עדכון";
                        this.txtPhone.onkeypress = function (event) {
                            keyPress(this, event);
                        }
                        this.btnRegisterOrUpdate.onclick = function () {
                            emptyError(this);


                            let userFields = {
                                userEmail: this.txtEmail.value,
                                userFirstName: this.txtFirstName.value,
                                userLastName: this.txtLastName.value,
                                userPhone: this.txtPhone.value,
                                userPassword: this.txtPassword.value, // need to insert password on register!
                                userRank: 1,
                                userPicture: "",
                                userToken: userObject.userToken
                            };
                            if (validateFields(userFields, this)) {
                                LockUI(this, true); // unlock UI
                                let delegateObject = {
                                    onSuccess: function (response) { // bring module 8 (success page) and module 4 (to update toolbar) - defined in NextModules
                                       
                                        let info = JSON.parse(response);
                                        switch (info) {
                                            case -1: {
                                                alert("incorrect parameters");
                                                break;
                                            }
                                            case 0: {
                                                alert("failed updating in server");
                                              //  nextModules.onFailure();
                                                break;
                                            }
                                            case 1: {
                                              //  alert("updated successfully");
                                                nextModules.onSuccess(userFields);
                                                break;
                                            }
                                     
                                        }
                                    }.bind(this),

                                    onFailure: function () {
                                        nextModules.onFailure();
                                    }.bind(this),

                                    onCompletion: function () {
                                        LockUI(this, false); // unlock UI

                                    }.bind(this)
                                };



                                sendHttpRequest("api/Users/update", delegateObject, JSON.stringify(userFields));

                            }

                        }.bind(this);

                    }
                    else {
                        console.log("user object exists but has empty fields");
                        nextModules.onFailure();                       
                    }
                }
                else {
                    this.btnRegisterOrUpdate.value = "הרשמה";
                    this.txtPhone.onkeypress = function (event) {
                        keyPress(this, event);
                    }
                    this.btnRegisterOrUpdate.onclick = function () {
                        emptyError(this);
                       
                        
                            let userFields = {
                                userEmail: this.txtEmail.value,
                                userFirstName: this.txtFirstName.value,
                                userLastName: this.txtLastName.value,
                                userPhone: this.txtPhone.value,
                                userPassword: this.txtPassword.value, // need to insert password on register!
                                userRank: 1,
                                userPicture: "",
                                userToken:""
                            };
                        if (validateFields(userFields, this)) {
                            LockUI(this, true);

                            let delegateObj = {
                                onSuccess: function (response) { // module 8 (success page) and module 4 (to update toolbar)
                                    let answer = JSON.parse(response);
                                    switch (answer) {
                                        case -1: { console.log("incorrect parameters"); break; }
                                        case 0: { console.log("failed adding to server"); break; }
                                        case 1: {
                                            //  console.log("added successfully");
                                            localStorage.setItem("userFirstName", userFields.userFirstName);
                                            cleanFileds(this);
                   
                                            nextModules.onSuccess(response); // insert parameter for toolbar
                                            break;
                                        }
                                        case 2: {
                                            cleanFileds(this);
                                            this.divErrorGeneral.innerHTML = "ההמשתמש קיים במערכת";

                                            break;
                                        }
                                    }

                                }.bind(this),
                                onFailure: function () {
                                    nextModules.onFailure(); // module3

                                }.bind(this),
                                onCompletion: function () {
                                    // nextModules.onCompletion();
                                    LockUI(this, false); // unlock
                                    
                                }.bind(this)
                            };


                            sendHttpRequest("api/Users/add", delegateObj, JSON.stringify(userFields));

                        }
                    }.bind(this);
                }



            }
        },

        onFailure: function () {
            console.log("server failed loading the page");
            nextModules.onFailure();
        }.bind(this)
 

    };

    sendHttpRequest(url, delegateObj); // get module content and give it functions
    function keyPress(ref, event) {

        if (event.keyCode == 13) {

            this.btnRegisterOrUpdate.onclick();

        }
    }
    function validateFields(userFields, ref) {

        let flag = true;

        let email = userFields.userEmail;
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

        if (userFields.userFirstName.length == 0) {
            ref.divErrorFirstName.innerHTML = "יש למלא שם פרטי";
            flag = false; // change to specific div

        }

        if (userFields.userLastName.length == 0) {
            ref.divErrorLastName.innerHTML = "יש למלא שם משפחה";
            flag = false;

        }

        let phone = userFields.userPhone;


        let phoneno = /^\d{10}$/;
        if (phone.length == 0) {
            ref.divErrorPhone.innerHTML = "יש למלא טלפון";
            flag = false;
        }
        else {
            if (!phone.match(phoneno)) {
                ref.divErrorPhone.innerHTML = "יש להכניס מספר טלפון תקין";
                flag = false;
            }
        }

        let password = userFields.userPassword;
        if (password.length == 0) {
            ref.divErrorPassword.innerHTML = "יש להזין סיסמה";
            flag = false;
        }

        return flag;
    }

    function LockUI(ref, toLock) { // lock/unlock

        ref.txtFirstName.disabled = toLock;
        ref.txtLastName.disabled = toLock;
        ref.txtEmail.disabled = toLock;
        ref.txtPassword.disabled = toLock;
        ref.txtPhone.disabled = toLock;


    }

    function emptyError(ref) {
        ref.divErrorEmail.innerHTML = "";
        ref.divErrorFirstName.innerHTML = "";
        ref.divErrorLastName.innerHTML = "";
        ref.divErrorPassword.innerHTML = "";
        ref.divErrorPhone.innerHTML = "";
        ref.divErrorGeneral.innerHTML = "";
    }

    function cleanFileds(ref) {
        ref.txtEmail.value = "";
        ref.txtFirstName.value = "";
        ref.txtLastName.value = "";
        ref.txtPhone.value = "";
        ref.txtPassword.value = "";
    }
}

