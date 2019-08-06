using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace RadioEtzionProject
{
    public class JwtManegment
    {
      private static Dictionary<string, jwtToken> ConnetedUsers = new Dictionary<string, jwtToken>();

        //// users hardcoded for simplicity, store in a db with hashed passwords in production applications
        //private List<User> _users = new List<User>
        //{
        //    new User { UserFirstName = "Test",  UserLastName = "User", UserEmail = "test", UserPassword = "test" }
        //};

        private readonly AppSettings _appSettings;
        public JwtManegment()
        {
            _appSettings = new AppSettings();
        }

        public User Authenticate(User user )
        {
            //if (IsConnected(user))
            //{
            //    return null;
            //}
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserEmail)
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            string s = tokenDescriptor.Expires.ToString();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.UserToken = tokenHandler.WriteToken(token);

            //create token and add it to Dictionary
            jwtToken jwtToken = new jwtToken(tokenHandler.WriteToken(token), tokenDescriptor.Expires);
            ConnetedUsers.Add(user.UserEmail, jwtToken);

            // remove password before returning
            user.UserPassword = "";
            user.UserPhone = "";
            
            return user;
        }

  


        public bool VerifyToken(string propPK, string token)
        {
            if (ConnetedUsers.ContainsKey(propPK))
            {
                if (token == ConnetedUsers[propPK].tokenValue)
                {
                    if (!ConnetedUsers[propPK].IsTokenExpires())
                    {
                        return true;
                    }
                    ConnetedUsers.Remove(propPK);
                    return false;
                }
            }
            return false;
        }

        public bool IsConnected (User user)
        {

            if (user==null)
            {
                return false;
            }


            if (ConnetedUsers.ContainsKey(user.UserEmail))
            {
                if (ConnetedUsers[user.UserEmail].IsTokenExpires())
                {
                    ConnetedUsers.Remove(user.UserEmail);
                    return false;
                }
                return true;
      
            }
            return false;
        }

        public void DisconectedUser (User user)
        {
            if (ConnetedUsers.ContainsKey(user.UserEmail))
            {
                ConnetedUsers.Remove(user.UserEmail);
            }
        }

    }
}
