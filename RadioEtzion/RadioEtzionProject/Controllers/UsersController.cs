using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;





namespace RadioEtzionProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {


        [HttpGet("get")]

        public User Login(string userEmail, string userPassword)

        {
            User userFromDb = null;
            User user = new User(userEmail, userPassword);
            if (!user.ValidateUser(false))
            {
                return null;
            }

            JwtManegment jwtManegment = new JwtManegment();
            if (jwtManegment.IsConnected(new User(userEmail, userPassword)))
            {
                return null;
            }



            string sql = "SELECT UserEmail,UserFirstName,UserLastName,UserPassword,UserPhone,UserPicture,Ranks_RanksID FROM users where UserEmail=@userEmail";

            DB.PullFromDB(sql,

                (cmd) => cmd.Parameters.AddWithValue("@userEmail", userEmail),

                (dr) => userFromDb = new User(dr));
            if (userFromDb != null)
            {
                if ((PasswordStorage.VerifyPassword(userPassword, userFromDb.UserPassword)) && userEmail == userFromDb.UserEmail)
                {
                    return (jwtManegment.Authenticate(userFromDb));
                }
            }

            return new User();

        }

        [HttpPost("checkForUpdate")]
        public User checkForUpdate([FromBody] User user)
        {
            User userDetails = null;
            //To DO: full validate for UserEmail and Users
            if (user.ValidateUser(user.UserToken))
            {
                return null;
            }

            JwtManegment jwtManegment = new JwtManegment();
            if (!jwtManegment.VerifyToken(user.UserEmail, user.UserToken))
            {
                return new User();
            }

            string sql = "SELECT UserEmail,UserFirstName,UserLastName,UserPassword,UserPhone,UserPicture,Ranks_RanksID FROM users where UserEmail=@userEmail";

            DB.PullFromDB(sql,

                (cmd) => cmd.Parameters.AddWithValue("@userEmail", user.UserEmail),

                (dr) => userDetails = new User(dr));
            userDetails.UserPassword = null;

            return userDetails;
        }
        [HttpPost("update")]

        public int UpdateUser([FromBody] User user)
        {
          

            if (user == null)
            {
                return -1;
            }
            if (!user.ValidateUser())
            {
                return -1;
            }
            JwtManegment jwtManegment = new JwtManegment();


            if (!jwtManegment.VerifyToken(user.UserEmail, user.UserToken))
            {
                return -1;
            }
            user.UserPassword = PasswordStorage.CreateHash(user.UserPassword);
            string sql = "UPDATE users SET UserFirstName =@UserFirstName , UserLastName = @UserLastName, UserPassword = @UserPassword, UserPhone = @UserPhone, UserPicture = @UserPicture WHERE UserEmail =@UserEmail";

            bool IsRowUpdated = DB.ExecuteCommand(sql, (cmd) =>
            {
                cmd.Parameters.AddWithValueCheckNull("@UserFirstName", Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(user.UserFirstName)));
                cmd.Parameters.AddWithValueCheckNull("@UserLastName", Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(user.UserLastName)));
                cmd.Parameters.AddWithValueCheckNull("@UserPassword", Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(user.UserPassword)));
                cmd.Parameters.AddWithValueCheckNull("@UserPhone", user.UserPhone);
                cmd.Parameters.AddWithValueCheckNull("@UserPicture", user.UserPicture);
                cmd.Parameters.AddWithValueCheckNull("@UserEmail", user.UserEmail);
            }) == 1;

            if (IsRowUpdated)
            {
                return 1;
            }
            return 0;

        }



        [HttpPost("add")]

        public int AddUser([FromBody] User user)

        {

            //To DO: full validate for UserEmail and Users
            if (user == null)
            {
                return -1;
            }
            if (!user.ValidateUser())
            {
                return -1;
            }
            JwtManegment jwtManegment = new JwtManegment();
            if (jwtManegment.IsConnected(user))
            {
                return -1;
            }


            User userFromDb = null;
            string sqlSelect = "SELECT UserEmail,UserFirstName,UserLastName,UserPassword,UserPhone,UserPicture,Ranks_RanksID FROM users where UserEmail=@userEmail";

            DB.PullFromDB(sqlSelect,

                (cmd) => cmd.Parameters.AddWithValue("@userEmail", user.UserEmail),

                (dr) => userFromDb = new User(dr));
            if (userFromDb != null)
            {
                return 2;
            }

            user.UserPassword = PasswordStorage.CreateHash(user.UserPassword);

            string sql = "INSERT INTO users (UserEmail, UserFirstName, UserLastName, UserPassword, UserPhone, UserPicture,Ranks_RanksID) VALUES(@UserEmail, @UserFirstName, @UserLastName, @UserPassword, @UserPhone, @UserPicture, @UserRank)";

            bool IsRowAdded = DB.ExecuteCommand(sql, (cmd) =>
             {
                 cmd.Parameters.AddWithValueCheckNull("@UserFirstName", Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(user.UserFirstName)));
                 cmd.Parameters.AddWithValueCheckNull("@UserLastName", Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(user.UserLastName)));
                 cmd.Parameters.AddWithValueCheckNull("@UserPassword", Encoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(user.UserPassword)));
                 cmd.Parameters.AddWithValueCheckNull("@UserPhone", user.UserPhone);
                 cmd.Parameters.AddWithValueCheckNull("@UserPicture", user.UserPicture);
                 cmd.Parameters.AddWithValueCheckNull("@UserEmail", user.UserEmail);
                 cmd.Parameters.AddWithValueCheckNull("@UserRank", 1);

             }) == 1;

            if (IsRowAdded)
            {
                return 1;
            }
            return 0;



        }


        [HttpPost("logout")]
        public bool logOutUser([FromBody] User user)
        {
            user.ValidateUser(user.UserToken);
            JwtManegment jwtManegment = new JwtManegment();
            if (jwtManegment.VerifyToken(user.UserEmail, user.UserToken))
            {
                jwtManegment.DisconectedUser(user);
                return true;
            }
            return false;
        }


        [HttpPost("IsConnected")]
        public bool IsExist([FromBody] User user)
        {
            user.ValidateUser(user.UserToken);
            JwtManegment jwtManegment = new JwtManegment();
            if (jwtManegment.VerifyToken(user.UserEmail, user.UserToken))
            {
                return true;
            }
            return false;
        }



    }


        
}

