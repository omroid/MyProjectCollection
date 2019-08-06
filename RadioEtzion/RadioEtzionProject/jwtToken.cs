using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace RadioEtzionProject
{
    public class jwtToken
    {
        public string tokenValue { get; set; }
        public DateTime? tokenExpires { get; set; }
        public jwtToken(string token,DateTime? tokenExpires)
        {
            this.tokenValue = token;
            this.tokenExpires = tokenExpires;
        }


        public bool IsTokenExpires()
        {
            return (DateTime.UtcNow > this.tokenExpires);
        }

    }


}
