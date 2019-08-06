using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace XO_Reactjs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        //the int value mean roomCode, value = -1 means no room, value > 1 means roomNumber
        static Dictionary<Player, string> players = new Dictionary<Player, string>();
        static Dictionary<string, GameRoom> gameRoomsDictionary = new Dictionary<string, GameRoom>();

        [HttpGet("AddPlayer")]
        public string AddPlayer(string username)
        {
            if (String.IsNullOrEmpty(username))
            {
                return "";
            }
            Player player = new Player(username);
            if (players.ContainsKey(player))
            {
                return "";
            }
            players.Add(player, null);

            return player.token.value;
        }

        [HttpPost("CreateRoom")]
        public string CreateRoom([FromBody]Player player)
        {
            if (!Player.ValidatePlayer(player))
            {
                return "";
            }
            if (players.ContainsKey(player))
            {
                if (players[player] == null)
                {
                    GameRoom gameRoom = new GameRoom(player);
                    players[player] = gameRoom.roomCode;
                    gameRoomsDictionary.Add(gameRoom.roomCode, gameRoom);
                    return gameRoom.roomCode;
                }
                return gameRoomsDictionary[players[player]].roomCode;
            }
            return "";

        }



        [HttpPost("JoinRoom")]
        public string JoinRoom([FromBody]Player player, string roomNumber)
        {

            if (!players.ContainsKey(player))
            {
                return "";
            }
            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return "";
            }
            if (!players.ContainsKey(player))
            {
                return "";
            }
            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return "";
            }
            if (gameRoomsDictionary[roomNumber].guestPlayer == null)
            {
                if (gameRoomsDictionary[roomNumber].joinRoom(player))
                {
                    return gameRoomsDictionary[roomNumber].hostPlayer.playerName;
                }
            }
            return "";
        }



        [HttpPost("FindRandomRoom")]
        public string FindRandomRoom([FromBody]Player player)
        {

            if (!players.ContainsKey(player))
            {
                return null;
            }
            if (!Player.ValidatePlayer(player))
            {
                return null;
            }
            if (!players.ContainsKey(player))
            {
                return null;
            }
            foreach (GameRoom item in gameRoomsDictionary.Values)
            {
                if (item.guestPlayer == null)
                {
                    return item.roomCode;
                }
            }
            return "";
        }

        [HttpPost("IsPlayerJoined")]
        public string IsPlayerJoined([FromBody]Player player, string roomNumber)
        {
            if (!players.ContainsKey(player))
            {
                return "";
            }
            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return "";
            }
            if (!players.ContainsKey(player))
            {
                return "";
            }
            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return "";
            }

            if (gameRoomsDictionary[roomNumber].guestPlayer != null)
            {
                return gameRoomsDictionary[roomNumber].guestPlayer.playerName;
            }

            return "";
        }


        [HttpPost("RemoveUserFromRoom")]
        public bool RemoveUserFromRoom([FromBody]Player player, string roomNumber, bool guestOrHost = true)
        {
            if (!players.ContainsKey(player))
            {
                return false;
            }
            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return false;
            }
            if (!players.ContainsKey(player))
            {
                return false;
            }
            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return false;
            }
            if (guestOrHost)
            {
                if (gameRoomsDictionary[roomNumber].guestPlayer != null)
                {
                    return gameRoomsDictionary[roomNumber].KickGuestPlayer(player);
                }
                return false;
            }
            else
            {
                gameRoomsDictionary[roomNumber] = null;
            }

            return true;
        }


        [HttpPost("startGame")]
        public bool startGame([FromBody]Player player, string roomNumber)
        {
            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return false;
            }

            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return false;
            }
            if (!players.ContainsKey(player))
            {
                return false;
            }
            return gameRoomsDictionary[roomNumber].CanStartGame(player);
        }


        [HttpPost("IsGameStarted")]
        public bool IsGameStarted([FromBody]Player player, string roomNumber)
        {

            if (!players.ContainsKey(player))
            {
                return false;
            }
            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return false;
            }
            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return false;
            }
            if (gameRoomsDictionary[roomNumber].guestPlayer != player)
            {
                return false;
            }
            if (gameRoomsDictionary[roomNumber].game == null)
            {
                return false;
            }
            return gameRoomsDictionary[roomNumber].game.stillPlay;
        }

        [HttpPost("ResetGame")]
        public bool ResetGame([FromBody]Player player, string roomNumber)
        {

            if (!players.ContainsKey(player))
            {
                return false;
            }
            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return false;
            }
            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return false;
            }
            if (gameRoomsDictionary[roomNumber].hostPlayer.token.value != player.token.value)
            {
                return false;
            }
            if (gameRoomsDictionary[roomNumber].game == null)
            {
                return false;
            }
            if (!gameRoomsDictionary[roomNumber].game.stillPlay)
            {
                return false;
            }
            if (!gameRoomsDictionary[roomNumber].game.isEnd)
            {
                return false;
            }
            gameRoomsDictionary[roomNumber].game.resetGame();
            return true;
        }

        ///-1 = wrong parameters ,0=player not at room,1=game not started yet,2=game is started 
        [HttpPost("PollHostCommand")]
        public int PollHostCommand([FromBody]Player player, string roomNumber)
        {

            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return -1;
            }
            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return -1;
            }
            if (!players.ContainsKey(player))
            {
                return -1;
            }
            if (gameRoomsDictionary[roomNumber].guestPlayer == null)
            {
                return 0;
            }
            if (gameRoomsDictionary[roomNumber].game != null)
            {
                return gameRoomsDictionary[roomNumber].game.stillPlay == true ? 2 : 1;
            }
            return 1;

        }





        [HttpPost("MakeMove")]
        //-2 = error parameters -1=game is not end yet 0=draw move 1 =winner move
        public int MakeMove([FromBody]Player player, string roomNumber, int place = -1)
        {
            if ((place > 8) || (place < 0))
            {
                return -2;
            }
            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return -2;
            }
            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return -2;
            }
            if (!players.ContainsKey(player))
            {
                return -2;
            }
            if (gameRoomsDictionary[roomNumber].game == null || !gameRoomsDictionary[roomNumber].game.stillPlay)
            {
                return -2;
            }
            if (!gameRoomsDictionary[roomNumber].game.SetOnBorad(place, player))
            {
                return -2;
            }
            int result= gameRoomsDictionary[roomNumber].game.CheakforWiner(place);
            if (!gameRoomsDictionary[roomNumber].game.isEnd)
            {
                gameRoomsDictionary[roomNumber].game.ChangeTurn();
            }
            return result;

        }

        [HttpPost("RenderGame")]
        //-2 = error parameters -1=game is not end yet 0=draw move 1 =winner move
        public Game RenderGame([FromBody]Player player, string roomNumber, int moves)
        {
            if ((moves > 9) || (moves < 0))
            {
                return null;
            }
           

            if (string.IsNullOrEmpty(roomNumber) || !Player.ValidatePlayer(player))
            {
                return null;
            }
            if (!gameRoomsDictionary.ContainsKey(roomNumber))
            {
                return null;
            }
            if (!players.ContainsKey(player))
            {
                return null;
            }
            if (gameRoomsDictionary[roomNumber].game == null || !gameRoomsDictionary[roomNumber].game.stillPlay)
            {
                return null;
            }
            if (gameRoomsDictionary[roomNumber].game.moves>=moves || gameRoomsDictionary[roomNumber].game.moves==0)
            {
                Game game = new Game();
                game.playerTurn = new Player("");
                game.board = gameRoomsDictionary[roomNumber].game.board;
                game.playerTurn.playerName = gameRoomsDictionary[roomNumber].game.playerTurn.token.value==player.token.value ? gameRoomsDictionary[roomNumber].game.playerTurn.playerName : "";
                game.playerTurn.token = null;
                game.moves = gameRoomsDictionary[roomNumber].game.moves;
                game.isEnd = gameRoomsDictionary[roomNumber].game.isEnd;
                game.result = gameRoomsDictionary[roomNumber].game.result;

                return game;
            }
            return null;
         
        }
    }
}