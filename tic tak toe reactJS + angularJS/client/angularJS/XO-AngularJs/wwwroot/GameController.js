myApp.controller('GameController', function ($scope, $http) {

    $scope.init = function () {
        $scope.squares = Array(9).fill(" ");
        $scope.moveCount = 0;
        $scope.winner = false;
        $scope.xCount = 0;
        $scope.oCount = 0;
        $scope.userParams = myApp.Main;
        $scope.PlayerX = $scope.userParams.hostUserName;
        $scope.PlayerO = $scope.userParams.guestUserName;
        $scope.turn = $scope.userParams.hostUserName;
        $scope.txtMessage = "";
        $scope.XisYou = $scope.userParams.isCreatedRoom ? true : false;
        $scope.onPlay();
    }
    $scope.onPlay = function () {


        $scope.flagIsRender = false;

        $http.defaults.headers.post["Content-Type"] = "application/JSON";
        $http({
            url: $scope.userParams.baseUrl + "api/game/RenderGame?roomNumber=" + $scope.userParams.roomID + "&moves=" + $scope.moveCount ,
            method: "POST",
            data: JSON.stringify({ "playerName": $scope.userParams.isCreatedRoom === true ? $scope.userParams.hostUserName : $scope.userParams.guestUserName, "token": $scope.userParams.token })
        }).then(function (response) {
            if (response.data !== "") {
                for (var i = 0; i < $scope.squares.length; i++) {
                    $scope.squares[i] = response.data.board[i];
                }
              
                console.log("render board");
                $scope.isYourTurn = response.data.playerTurn.playerName === "" ? false : true;
                let lastMoveCount = $scope.moveCount;
                $scope.moveCount = response.data.moves;
                $scope.winner = response.data.isEnd;    
                if ($scope.winner === true && $scope.moveCount !== lastMoveCount) {
                    if (response.data.result == 'w') {
                        $scope.onWinner(lastMoveCount % 2 == 0 ? 'X' : 'O');
                    }

                }

              

            }



            setTimeout($scope.onPlay(), 2000);
        }
            , function (error) {
                console.log(error);
            });
            
    }


    $scope.onWinner = function (winner) {
        $scope.xCount = (winner === 'X' && $scope.moveCount < 9 ? ($scope.xCount + 1) : $scope.xCount);
        $scope.oCount = (winner === 'O' && $scope.moveCount < 9 ? ($scope.oCount + 1) : $scope.oCount);
    }

    $scope.reset = function () {
      
        $scope.flagOnWaitHost = false;

        $http.defaults.headers.post["Content-Type"] = "application/JSON";
        $http({
            url: $scope.userParams.baseUrl + "api/game/ResetGame?roomNumber=" + $scope.userParams.roomID,
            method: "POST",
            data: JSON.stringify({ "playerName": $scope.userParams.hostUserName, "token": $scope.userParams.token })
        }).then(function (response) {
            if (response.data === true) {
                $scope.txtMessage = "game is Reset";
            }

        }
            , function (error) {
                console.log(error);
            });
  
    }
    $scope.status = function () {
        let CurrentTurn = '';
        let BeforeTurn = '';
        if ($scope.XisYou === true) {
            CurrentTurn = $scope.moveCount % 2 == 0 ? 'X' : 'O';
            BeforeTurn = $scope.moveCount % 2 == 0 ? 'O' : 'X';
        }
        else {
            CurrentTurn = $scope.moveCount % 2 == 1 ? 'O' : 'X';
            BeforeTurn = $scope.moveCount % 2 == 1 ? 'X' : 'O';
        }

        return $scope.winner ? ($scope.moveCount<9? BeforeTurn + ' is the winner!' :'draw') : CurrentTurn + ' turn';
    }


    $scope.handleClick = function (i) {
        if ($scope.squares[i] !== " " || $scope.winner === true) {
            $scope.txtMessage="error";
            return;
        }

        $scope.txtMessage= "";
        $http.defaults.headers.post["Content-Type"] = "application/JSON";
        $http({
            url: $scope.userParams.baseUrl + "api/game/MakeMove?roomNumber=" +  $scope.userParams.roomID + "&place=" + i,
            method: "POST",
            data: JSON.stringify({ "playerName": $scope.userParams.isCreatedRoom === true ? $scope.userParams.hostUserName : $scope.userParams.guestUserName, "token": $scope.userParams.token })
        }).then(function (response) {
            switch (response.data) {
                case -2:
                    $scope.txtMessage = "bad move";
                    break;
                case -1:

                    $scope.txtMessage = "move ok";
                    break;
                case 0:

                    $scope.txtMessage = "game draw";
                    break;
                case 1:

                    $scope.txtMessage = "winning move";


                    break;
                default:

                    break;
            }


           
        },
           function (error) {
            console.log(error);
        });


    }



});