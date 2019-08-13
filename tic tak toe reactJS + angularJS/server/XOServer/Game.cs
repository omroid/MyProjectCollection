using System;


namespace XO_Reactjs
{
    public class Game
    {
        public Player PlayerX { get; set; }
        public Player PlayerO{ get; set; }
        public Player playerTurn { get; set; }

        public bool stillPlay { get; set; }

        public char[] board;
        public int moves;
        public bool isEnd;
        public char result = ' ';

        public Game()
        {

        }

        public Game(Player hostPlayer,Player guestPlayer)
        {
            if (Player.ValidatePlayer(hostPlayer) && Player.ValidatePlayer(guestPlayer))
            {
                this.PlayerX = hostPlayer;
                this.PlayerO = guestPlayer;

                resetGame();


            }
        }

        public void resetGame()
        {
            this.stillPlay = true;
            this.board = new char[9];
            this.ClearBoard();
            //this.DecideFirstPlayer();
            this.playerTurn = this.PlayerX;
            this.moves = 0;
            this.isEnd = false;
            this.result = ' ';
        }
        private void DecideFirstPlayer()
        {
            Random random = new Random();
            int rnd = random.Next(0, 2);
            
              playerTurn= (rnd==0? PlayerX : PlayerO);
        }
        private void ClearBoard()
        {
            if (board==null)
            {
                return;
            }
            for (int i = 0; i < board.Length; i++)
            {
                board[i] = ' ';
            }
        }

        public bool SetOnBorad (int place,Player player)
        {
            if (place>=board.Length || place <0)
            {
                return false;
            }

            if (board[place]!=' ')
            {
                return false;
            }
            if (player.token.value != playerTurn.token.value)
            {
                return false;
            }

            if (playerTurn==PlayerX)
            {
                board[place] = 'X';
                moves++;
                return true;
            }
            else if (playerTurn==PlayerO)
            {
                board[place] = 'O';
                moves++;
                return true;
            }
            return false;

        }
        public void ChangeTurn()
        {
            playerTurn = playerTurn==PlayerX ? PlayerO : PlayerX;
        }

        public int CheakforWiner(int pos)
        {
            if (this.moves >= 5)
            {
                int col = pos % 3;
                int row = ((pos - col) / 3) * 3;
                if (board[col] == board[col + 3] && board[col] == board[col + 6])
                {
                    isEnd = true;
                    result = 'w';
                    return 1;
                }
                if (board[row] == board[row + 1] && board[row] == board[row + 2])
                {
                    isEnd = true;
                    result = 'w';
                    return 1;
                }
                if (pos % 2 == 0)
                {
                    if (board[0] == board[4] && board[0] == board[8] && board[pos] == board[0])
                    {
                        isEnd = true;
                        result = 'w';
                        return 1;
                    }
                    if (board[2] == board[4] && board[2] == board[6] && board[pos] == board[2])
                    {
                        isEnd = true;
                        result = 'w';
                        return 1;
                    }
                }
            }
            if (this.moves>=9)
            {
                isEnd = true;
                result = 'd';
                return 0;
            }
            return -1;
        }
    }
}
