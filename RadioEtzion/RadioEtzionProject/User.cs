using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using System.Security.Cryptography;

namespace RadioEtzionProject
{
    public class User
    {
        public string UserEmail { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserPassword { get; set; }
        public string UserPhone { get; set; }
        public string UserPicture { get; set; }
        public int UserRank { get; set; }
        public string UserToken { get; set; }

        public User()
        {

        }
        public User(MySqlDataReader dr)
        {

            UserEmail = dr.GetStringOrNull(0);

            UserFirstName = dr.GetStringOrNull(1);

            UserLastName = dr.GetStringOrNull(2);

            UserPassword = dr.GetStringOrNull(3);

            UserPhone = dr.GetStringOrNull(4);

            UserPicture = dr.GetStringOrNull(5);

            UserRank = dr.GetInt32(6);

        }
        public User(string UserEmail,string UserPassword)
        {
            this.UserEmail = UserEmail;
            this.UserPassword = UserPassword;
        }

        public bool ValidateUser(bool isFullValidate=true)
        {
            if (string.IsNullOrEmpty(this.UserEmail))
            {
                return false;
            }

            try
            {
                new System.Net.Mail.MailAddress(this.UserEmail);
            }
            catch
            {
                return false;
            }
            if (string.IsNullOrEmpty(this.UserPassword))
            {

                return false;
            }
            if (isFullValidate)
            {
                if (string.IsNullOrEmpty(this.UserFirstName))
                {
                    return false;
                }

                if (string.IsNullOrEmpty(this.UserLastName))
                {
                    return false;
                }

                if (string.IsNullOrEmpty(this.UserPhone))
                {
                    return false;
                }

                if (!Regex.Match(this.UserPhone, @"^\d{10}$").Success)
                {
                    return false;
                }
            }

                return true;
            
        }

        public bool ValidateUser(string token, bool isFullValidate= true)
        {
            if (string.IsNullOrEmpty(token))
            {
               return ValidateUser(isFullValidate);
            }
            return false;
        }



    }
}
