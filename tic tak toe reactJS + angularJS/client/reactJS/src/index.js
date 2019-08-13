import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import { spawn } from 'child_process';





function Square(props) {
    return (<button className='box' onClick={props.onClick}>
        {props.value}
    </button>);
}

class Board extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
            squares: Array(9).fill(" "),
            isYourTurn: false,
            XisYou: this.props.params.isCreatedRoom === true ? true : false,
            result:' ',
            moveCount: 0,
            winner: false,
            baseUrl: "http://localhost:2281/",
            txtMessage: "",
            flagIsRender: true
		};
		
	}
	
	
    renderSquare(i) {
        return (<Square onPlay={this.state.flagIsRender === true ? this.onPlay(this.state, this.props.params) : () => { }}  value={this.state.squares[i]} onClick={() => this.handleClick(i, this.props.params)} />)
    }

    onPlay(state, params) {
      
        let tempState = state;

        tempState.flagIsRender = false;
        axios.post(tempState.baseUrl + "api/game/RenderGame?roomNumber=" + params.roomID + "&moves=" + state.moveCount, { "playerName": params.isCreatedRoom === true ? params.hostUserName : params.guestUserName, "token": params.token })
            .then(function (response) {
                if (response.data !== "") {
                    tempState.squares = response.data.board;
                    console.log("render board");
                    tempState.isYourTurn = response.data.playerTurn.playerName === "" ? false : true;
                    let lastMoveCount = tempState.moveCount;
                    tempState.moveCount = response.data.moves;
                    tempState.winner = response.data.isEnd;
                    tempState.result = response.data.result;
                    
                    if (tempState.winner === true && tempState.moveCount !== lastMoveCount) {
                        if (response.data.result == 'w') {
                            this.props.onWinner(lastMoveCount%2===0 ? 'X' : 'O');
                        }
                     
                    }
                }
                this.setState(tempState);
                
               
                setTimeout(() => this.onPlay(tempState, params), 2000);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

    reset(state,params) {
        let tempState = state;
        tempState.flagOnWaitHost = false;
        axios.post(state.baseUrl + "api/game/ResetGame?roomNumber=" + params.roomID, { "playerName": params.hostUserName, "token": params.token })
            .then(function (response) {
                if (response.data === true) {
                    tempState.txtMessage = "Reset Ok";
                   
                    
                }
                this.setState(tempState);
              
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

	
    handleClick(i, params) {
        if (this.state.squares[i] !== " " || this.state.winner === true) {
            console.log("error");
            return;
        }


        const squares = this.state.squares.slice();
        let txtMessage = "";

        axios.post(this.state.baseUrl + "api/game/MakeMove?roomNumber=" + params.roomID + "&place=" + i, { "playerName": params.isCreatedRoom === true ? params.hostUserName : params.guestUserName, "token": params.token })
            .then(function (response) {
                switch (response.data) {
                    case -2:
                        txtMessage = "bad move";
                        break;
                    case -1:

                        txtMessage = "move ok";
                        break;
                    case 0:

                        txtMessage = "game draw";
                        break;
                    case 1:

                        txtMessage = "move ok";


                        break;
                    default:

                        break;
                }
                this.setState({
                    squares: squares,
                    moveCount: this.state.moveCount + 1,
                    txtMessage: txtMessage
                })
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });


    }

    render() {
        let CurrentTurn = '';
        if (this.state.XisYou === true) {
            CurrentTurn = this.state.isYourTurn === true ? 'X' : 'O';
        }
        else {
            CurrentTurn = this.state.isYourTurn === true ? 'O' : 'X';
        }
        const status = this.state.winner ? (this.state.moveCount < 9 ? CurrentTurn + ' is the winner!' : 'draw') : CurrentTurn + ' turn';

        return (
            <div>
				<div className="text">{status}</div>
            <div className='game-board'>
			
					{this.renderSquare(0)}
			
      
                    {this.renderSquare(1)}
         
       
                    {this.renderSquare(2)}
      
             
                    {this.renderSquare(3)}
            
           
                    {this.renderSquare(4)}
           
              
                    {this.renderSquare(5)}
         
              
                    {this.renderSquare(6)}
            
                    {this.renderSquare(7)}
           
           
                    {this.renderSquare(8)}
                </div>
                <br /><span className="errorMessage">{this.state.txtMessage}</span>
                <div>
                    <button className="mySmallerButton" onClick={() => this.reset(this.state, this.props.params)} style={{ visibility: (this.state.winner === true && this.props.params.isCreatedRoom === true ? "visible" : "hidden") }}>reset</button>
                </div>
            </div>
     
		);
		
	}

	
}


class Game extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            xCount: 0,
            oCount: 0
        };
    }



    onWinner(winner) {

        this.setState({

            xCount: (winner === 'X'  ? (this.state.xCount + 1) : this.state.xCount),

            oCount: (winner === 'O' ? (this.state.oCount + 1) : this.state.oCount)

        });

    }

    render() {
        return (
            <div className="border center">
                <h2>XO game</h2><br/>
            <div>
                <div>
                        <Board onWinner={(winner) => this.onWinner(winner)} params={{ token: this.props.token, roomID: this.props.roomID, hostUserName: this.props.PlayerX, guestUserName: this.props.PlayerO, isCreatedRoom: this.props.isCreatedRoom }} />
                </div>
               
                <div className="game-info">
                    <div>{this.props.PlayerX} is X wins: {this.state.xCount}</div>
                    <div>{this.props.PlayerO} is O wins: {this.state.oCount}</div>

				</div>
				</div>
			</div>
		
		);
		
		
	}
	
}


class AddUser extends React.Component {


    render() {

        if (!this.state.isCreatedUser) {

            return (
                <div className='AddUser center'>
                    <h1>Welcome To XO game</h1>
                   <input type="text" className='css-input' id="txtUserName" value={this.state.hostUserName} placeholder='please enter your name' onChange={(event) => this.ChangeParameters(event, this.state)}  /><br />
                    <br /> <button className='myButton' id="btnCreateUser" onClick={(event) => this.ChangeParameters(event, this.state)} >enter the game</button>
                    <br /><span className="errorMessage">{this.state.txtMessage}</span>
                </div>);
        }

        if (!this.state.isEnterRoom && !this.state.isCreatedRoom) {
            return (
                <div className='center'>
                    <h1>Room Menu</h1>
                    <p className='text'>Your Username: {this.state.hostUserName}</p>
                    <h3>Join a room by room code </h3>
                    <input type="text" placeholder="enter Room ID" id="txtRoomId" className="css-input" value={this.state.txtRoomID} onChange={(event) => this.ChangeParameters(event, this.state)} /><br />
                    <button id="btnEnterByRoomCode" className="mySmallerButton" onClick={(event) => this.ChangeParameters(event, this.state)}>enter by room code </button>
                    <button id="btnFindRoom" className="mySmallerButton" onClick={(event) => this.ChangeParameters(event, this.state)}>find random room </button><br />
                    <h3> or create your own room</h3>
                    <button id="btnCreateRoom" className="mySmallerButton" onClick={(event) => this.ChangeParameters(event, this.state)}>create room </button>
                    <br /><span className="errorMessage">{this.state.txtMessage}</span>
                </div>
            );
        }
        if (!this.state.isGameStarted) {
            return (<div className="center" onWait={this.state.isCreatedRoom === this.state.flagOnWaitJoiner ? this.onWaitForGuestPlayer(this.state) : (this.state.isEnterRoom === this.state.flagOnWaitHost ? this.onWaitForHostCommand(this.state) : () => { })}>
                <h1>Waiting Room</h1>
                <h3>give your room ID to your friend or wait for player</h3>
                <span className="text">{this.state.roomID}</span> <br />
                 <br/>
                <p className="text">player host</p>
                <input type="text" placeholder="Waiting For player..." className="css-input" value={this.state.hostUserName} />
                <p className="text">player guest</p>
                <input type="text" placeholder="Waiting For player..." className="css-input" value={this.state.guestUserName} />
                <div><button className="mySmallerButton" id="btnRemovePlayer" style={{ visibility: (this.state.isCreatedRoom === true ? "visible" : "hidden") }} onClick={(event) => this.ChangeParameters(event, this.state)} >remove player</button> 
                    <button className="mySmallerButton" id="btnStartGame" style={{ visibility: (this.state.isCreatedRoom === true ? "visible" : "hidden") }} onClick={(event) => this.ChangeParameters(event, this.state)} >start game </button> </div>
                <br /><span className="errorMessage">{this.state.txtMessage}</span>
            </div>);
           
        }

        return (<Game PlayerX={this.state.hostUserName} PlayerO={this.state.guestUserName} token={this.state.token} roomID={this.state.roomID} isCreatedRoom={this.state.isCreatedRoom}  />);
    }

    constructor(props) {
        super(props);
        this.state = {
            hostUserName: "",
            guestUserName:"",
            token: "",
            txtRoomID: "",
            roomID: "",
            txtMessage: "",
            flagOnWaitHost: true,
            flagOnWaitJoiner: true,
            baseUrl: "http://localhost:2281/",
            isCreatedUser: false,
            isEnterRoom: false,
            isCreatedRoom: false,
            isGameStarted: false
        };
    }

    ChangeParameters(event,state) {

        let tempState = state;

    
        switch (event.target.id) {
            case "txtUserName":
                tempState.hostUserName = event.target.value;
                break;
            case "btnCreateUser":
                axios.get(state.baseUrl + "api/game/AddPlayer?username=" + state.hostUserName)
                    .then(function (response) {
                        if (response.data === "") {
                            tempState.txtMessage = "illegal user";
                        }
                        else {
                            tempState.token = response.data;
                            tempState.isCreatedUser = true;
                            console.log(tempState.token);
                            tempState.txtMessage = "";
                        }
                        this.setState(tempState);

                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
                
                break;
            case "txtRoomId":
                tempState.txtRoomID = event.target.value;
                break;
            case "btnEnterByRoomCode":
                axios.post(state.baseUrl + "api/game/JoinRoom?roomNumber=" + this.state.txtRoomID, { "playerName": tempState.hostUserName, "token": tempState.token })
                    .then(function (response) {
                        if (response.data === "") {


                            tempState.txtMessage = "this room is full or your details are wrong";
                        }
                        else {
                            tempState.guestUserName = tempState.hostUserName;
                            tempState.hostUserName = response.data;
                            tempState.roomID = tempState.txtRoomID;
                            tempState.isEnterRoom = true;
                            tempState.txtMessage = "";
                        }
                        this.setState(tempState);
                        if (tempState.flagOnWaitHost === false) {
                            this.onWaitForHostCommand(tempState);
                        }
                     
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
                this.setState(tempState);
                break;
            case "btnFindRoom":
                axios.post(state.baseUrl + "api/game/FindRandomRoom", { "playerName": tempState.hostUserName, "token": tempState.token })
                    .then(function (response) {
                        if (response.data === "") {
                            tempState.txtMessage = "Room Not Found Please create room and wait for player";
                        }
                        else {
                            tempState.txtRoomID = response.data;
                            tempState.txtMessage = "";
                        }
                        this.setState(tempState);
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
                break;
            case "btnCreateRoom":
                axios.post(state.baseUrl + "api/game/CreateRoom", {"playerName": tempState.hostUserName, "token": tempState.token })
                    .then(function (response) {
                        if (response.data === "") {
                            tempState.txtMessage = "this user is not registered";
                        }
                        else {
                            tempState.roomID = response.data;
                            tempState.isCreatedRoom = true;
                            tempState.txtMessage = "";
                            tempState.txtRoomID = "";
                        }
                        this.setState(tempState);
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
                break;
            case "btnRemovePlayer":
                axios.post(state.baseUrl + "api/game/RemoveUserFromRoom?roomNumber=" + this.state.roomID, { "playerName": tempState.hostUserName, "token": tempState.token })
                    .then(function (response) {
                        if (response.data === false) {
                            tempState.txtMessage = "can't remove player";
                        }
                        else {
                            tempState.guestUserName = "";
                        }
                        this.setState(tempState);
                        this.onWaitForGuestPlayer(tempState);
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
                break;
            case "btnStartGame":
                tempState.txtRoomID = "";
                axios.post(state.baseUrl + "api/game/startGame?roomNumber=" + this.state.roomID, { "playerName": tempState.hostUserName, "token": tempState.token })
                    .then(function (response) {
                        if (response.data === false) {
                            tempState.txtMessage = "can't start game";
                        }
                        else {
                            tempState.isGameStarted = true;
                        }
                        this.setState(tempState);
                    }.bind(this))
                    .catch(function (error) {
                        console.log(error);
                    });
                break;
            default:
                break;
        }
        this.setState(tempState);
    };

    onWaitForGuestPlayer(state) {
        let tempState = state;
        tempState.flagOnWaitJoiner = false;

        if (tempState.guestUserName === "" && tempState.isCreatedRoom === true) {
       axios.post(tempState.baseUrl + "api/game/IsPlayerJoined?roomNumber=" + state.roomID, { "playerName": tempState.hostUserName, "token": tempState.token })
                .then(function (response) {
                    if (response.data !== "") {
                        tempState.guestUserName = response.data;
                        tempState.flagOnWaitJoiner = true;
                    }
                    this.setState(tempState);
                    setTimeout(() => this.onWaitForGuestPlayer(state), 2000);
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        }


    }

    onWaitForHostCommand(state) {
        let tempState = state;
        tempState.flagOnWaitHost = false;


        if (tempState.guestUserName !== "" && tempState.isEnterRoom === true) {
            axios.post(tempState.baseUrl + "api/game/PollHostCommand?roomNumber=" + state.roomID, { "playerName": tempState.guestUserName, "token": tempState.token })
                .then(function (response) {
                    switch (response.data) {
                        case -1:
                            tempState.txtMessage = "illgal parameters";
                            this.setState(tempState);
                            break;
                        case 0:
                            tempState.hostUserName = tempState.guestUserName;
                            tempState.guestUserName = "";
                            tempState.roomID = "";
                            tempState.isEnterRoom = false;
                            tempState.txtMessage = "you have been kicked from room";
                            this.setState(tempState);
                            break;
                        case 1:
                            tempState.txtMessage = "";
                            this.setState(tempState);
                            setTimeout(() => this.onWaitForHostCommand(tempState), 2000);
                            break;
                        case 2:
                            tempState.isGameStarted = true;
                            this.setState(tempState);
                            break
                        default:
                            break;
                    }
              
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        }


    }
}







ReactDOM.render(<AddUser />, document.getElementById('root'));



