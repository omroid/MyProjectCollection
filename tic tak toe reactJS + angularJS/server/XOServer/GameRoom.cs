
using System;

namespace XO_Reactjs
{
    public class GameRoom
    {
        public Player hostPlayer { get; set; }
        public Player guestPlayer { get; set; }
        public  string roomCode { get; set; }
        public Game game { get; set; }


        public GameRoom(Player hostPlayer)
        {
            if (Player.ValidatePlayer(hostPlayer))
            {
                Random rnd = new Random();
                this.hostPlayer = hostPlayer;
                Token token = new Token();
                roomCode = token.value;
            }
       
        }
        public bool joinRoom(Player guestPlayer)
        {
            if (Player.ValidatePlayer(guestPlayer) && this.guestPlayer==null)
            {
                this.guestPlayer = guestPlayer;
                return true;
            }
            return false;
        }

        public bool KickGuestPlayer(Player hostPlayer)
        {
            if (Player.ValidatePlayer(hostPlayer) && this.hostPlayer.token.value == hostPlayer.token.value)
            {
                this.guestPlayer = null;
                return true;
            }
            return false;
        }


        public bool CanStartGame(Player hostPlayer)
        {
            if (Player.ValidatePlayer(this.hostPlayer) && Player.ValidatePlayer(this.guestPlayer) && Player.ValidatePlayer(hostPlayer) )
            {
                if (this.hostPlayer.token.value == hostPlayer.token.value)
                {
                    this.game = new Game(this.hostPlayer, this.guestPlayer);
                    return true;
                }
            
            }
            return false;
        }

        public override string ToString()
        {
            if (Player.ValidatePlayer(this.hostPlayer) && (Player.ValidatePlayer(this.guestPlayer)))
            {
                return string.Format("host player: {0} \nguest player:{1}", this.hostPlayer.playerName, this.guestPlayer.playerName);
            }
            return "";
        }

        public override int GetHashCode()
        {
            return this.roomCode.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            GameRoom gameRoom = (GameRoom)obj;
            return this.roomCode == gameRoom.roomCode;
        }
    }
}
