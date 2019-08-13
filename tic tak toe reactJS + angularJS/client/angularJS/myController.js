myApp.controller('myController', function ($scope, $http) {

    $scope.init = function () {
        $scope.hostUserName = "";
        $scope.guestUserName = "";
        $scope.token = "";
        $scope.txtRoomID = "";
        $scope.roomID = "";
        $scope.txtMessage = "";
        $scope.flagOnWaitHost = false;
        $scope.flagOnWaitJoiner = false;
        $scope.baseUrl = "http://localhost:2281/";
        $scope.isCreatedUser = false;
        $scope.isEnterRoom = false;
        $scope.isCreatedRoom = false;
        $scope.isGameStarted = false;
        $scope.page = $scope.render();
        myApp.Main = $scope;
   
    }


    $scope.render = function () {
        if (!$scope.isCreatedUser) {
            return 'sighIn.html';
        }

        if (!$scope.isEnterRoom && !$scope.isCreatedRoom) {
            return 'entranceRoomMenu.html';
        }
        if (!$scope.isGameStarted) {
            return 'roomMenu.html';
        }
        return 'game.html';

    }

    $scope.test = function () {
        let loginUserNumber = $event.testing;
        $scope.page = "aaa";
        console.log(loginUserNumber);
        console.log($scope.page);
    };



    $scope.ChangeParameters = function (event) {

     

        switch (event.target.id) {
         
            case "btnCreateUser":
                myApp.Main.hostUserName = $scope.hostUserName;
                $http.get(myApp.Main.baseUrl + "api/game/AddPlayer?username=" + myApp.Main.hostUserName)
                    .then(function (response) {
                        if (response.data === "") {
                            myApp.Main.txtMessage = "illegal user";
                        }
                        else {
                            myApp.Main.token = response.data;
                            myApp.Main.isCreatedUser = true;
                            console.log(myApp.Main.token);
                            myApp.Main.txtMessage = "";
                            
                        }
                        myApp.Main.page = $scope.render();
                  

                    },
                    function (error) {
                        console.log("error");
                    });

                break;
       
            case "btnEnterByRoomCode":
                $http.defaults.headers.post["Content-Type"] = "application/JSON";
                $http({
                    url: myApp.Main.baseUrl + "api/game/JoinRoom?roomNumber=" + $scope.txtRoomID,
                    method: "POST",
                    data: JSON.stringify({ "playerName": myApp.Main.hostUserName, "token": myApp.Main.token })
                }).then(function (response) {
                    if (response.data === "") {


                        myApp.Main.txtMessage = "this room is full or your details are wrong";
                    }
                    else {
                        myApp.Main.guestUserName = myApp.Main.hostUserName;
                        myApp.Main.hostUserName = response.data;
                        myApp.Main.roomID = $scope.txtRoomID;
                        myApp.Main.isEnterRoom = true;
                        myApp.Main.txtMessage = "";
                    }
                    myApp.Main.page = $scope.render();
                    if (myApp.Main.flagOnWaitHost === false) {
                        myApp.Main.onWaitForHostCommand(myApp.Main);
                    }

                },
                    function (error) {
                        console.log("error");
                    });

                break;
            case "btnFindRoom":
                $http.defaults.headers.post["Content-Type"] = "application/JSON";
                $http({
                    url: myApp.Main.baseUrl + "api/game/FindRandomRoom",
                    method: "POST",
                    data: JSON.stringify({ "playerName": myApp.Main.hostUserName, "token": myApp.Main.token })
                }).then(function (response) {
                    if (response.data === "") {
                        myApp.Main.txtMessage = "Room Not Found Please create room and wait for player";
                    }
                    else {
                        myApp.Main.txtRoomID = response.data;
                        myApp.Main.txtMessage = "";
                    }

                },
                    function (error) {
                        console.log(error);
                    });
                    
                break;
            case "btnCreateRoom":

                $http.defaults.headers.post["Content-Type"] = "application/JSON";
                $http({
                    url: myApp.Main.baseUrl + "api/game/CreateRoom",
                    method: "POST",
                    data: JSON.stringify({ "playerName": myApp.Main.hostUserName, "token": myApp.Main.token })
                }).then(function (response) {
                    if (response.data === "") {
                        myApp.Main.txtMessage = "this user is not registered";
                    }
                    else {
                        myApp.Main.roomID = response.data;
                        myApp.Main.isCreatedRoom = true;
                        myApp.Main.txtMessage = "";
                        myApp.Main.txtRoomID = "";
                        myApp.Main.onWaitForGuestPlayer();
                    }
                    myApp.Main.page = $scope.render();
             
                },
                    function (error) {
                    console.log("error");
                });
  
                break;
            case "btnRemovePlayer":

                $http.defaults.headers.post["Content-Type"] = "application/JSON";
                $http({
                    url: myApp.Main.baseUrl + "api/game/RemoveUserFromRoom?roomNumber=" + myApp.Main.roomID,
                    method: "POST",
                    data: JSON.stringify({ "playerName": myApp.Main.hostUserName, "token": myApp.Main.token })
                }).then(function (response) {
                    if (response.data === false) {
                        myApp.Main.txtMessage = "can't remove player";
                    }
                    else {
                        myApp.Main.guestUserName = "";
                    }
                    myApp.Main.onWaitForGuestPlayer();
                },
                    function (error) {
                        console.log(error);
                    });

                break;

            case "btnStartGame":

                $http.defaults.headers.post["Content-Type"] = "application/JSON";
                $http({
                    url: myApp.Main.baseUrl + "api/game/startGame?roomNumber=" + myApp.Main.roomID,
                    method: "POST",
                    data: JSON.stringify({ "playerName": myApp.Main.hostUserName, "token": myApp.Main.token })
                }).then(function (response) {
                    if (response.data === false) {
                        myApp.Main.txtMessage = "can't start game";
                    }
                    else {
                        myApp.Main.isGameStarted = true;
                    }
                    myApp.Main.page = $scope.render();
                   
                },
                    function (error) {
                        console.log(error);
                    });

               
                break;
            default:
                break;
        }

    };

    $scope.onWaitForGuestPlayer = function () {
      
        myApp.Main.flagOnWaitJoiner = false;

        if (myApp.Main.guestUserName === "" && myApp.Main.isCreatedRoom === true) {


            $http.defaults.headers.post["Content-Type"] = "application/JSON";
            $http({
                url: myApp.Main.baseUrl + "api/game/IsPlayerJoined?roomNumber=" + myApp.Main.roomID,
                method: "POST",
                data: JSON.stringify({ "playerName": myApp.Main.hostUserName, "token": myApp.Main.token })
            }).then(function (response) {
                    if (response.data !== "") {
                        myApp.Main.guestUserName = response.data;
                        myApp.Main.flagOnWaitJoiner = true;
                    }
                
                    setTimeout(() => myApp.Main.onWaitForGuestPlayer(), 2000);
                },
                function (error) {
                    console.log("error");
                });
    
        }

    };

    $scope.onWaitForHostCommand = function () {

        myApp.Main.flagOnWaitJoiner = false;


        if (myApp.Main.guestUserName !== "" && myApp.Main.isEnterRoom === true) {

            $http.defaults.headers.post["Content-Type"] = "application/JSON";
            $http({
                url: myApp.Main.baseUrl + "api/game/PollHostCommand?roomNumber=" + myApp.Main.roomID,
                method: "POST",
                data: JSON.stringify({ "playerName": myApp.Main.guestUserName, "token": myApp.Main.token })
            }).then(function (response) {
                console.log(myApp.Main.page);
                switch (response.data) {
                    case -1:
                        myApp.Main.txtMessage = "illgal parameters";
                        break;
                    case 0:
                        myApp.Main.hostUserName = myApp.Main.guestUserName;
                        myApp.Main.guestUserName = "";
                        myApp.Main.roomID = "";
                        myApp.Main.isEnterRoom = false;
                        myApp.Main.txtMessage = "you have been kicked from room";
                       
                        break;
                    case 1:
                        setTimeout(() => myApp.Main.onWaitForHostCommand(), 2000);
                        break;
                    case 2:
                        myApp.Main.isGameStarted = true;
                    
                        break
                    default:
                        break;
                        
                }
                myApp.Main.page = myApp.Main.render();
              
            },
                function (error) {
                    console.log("error");
                });
        }
    }




});