using System;
using System.Collections;
using System.Collections.Generic;

namespace XO_Reactjs
{
    public class Player 
    {
        public string playerName { get; set; }
        public Token token { get; set; }

        public Player(string playerName,string token="")
        {
            this.playerName = playerName;
            if (token=="")
            {
                this.token = new Token();
            }
            else
            {
                this.token = new Token();
                this.token.value = token;
            }
          
        }

        public static bool ValidatePlayer(Player player)
        {
            if (player!=null && player.playerName != null && player.token != null && !string.IsNullOrEmpty(player.playerName))
            {
                return true;
            }
            return false;
        }

    



        public override string ToString()
        {
            return string.Format("player {0} token {1}", playerName, token.value);
        }

        public override bool Equals(object obj)
        {
            Player other = (Player)obj;
            return ((this.playerName == other.playerName) && (this.token.value == other.token.value) ? true : false);
        }

        public override int GetHashCode()
        {
            return this.playerName.GetHashCode() ^ this.token.GetHashCode();
        }
    }
}
