using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Threading;

namespace RadioEtzionProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BroadcastController : ControllerBase
    {

        [HttpPost("get")]
        public List<Broadcast> showBroadcast([FromBody] User user)
        {

            //To DO: full validate for UserEmail and Users
            if (user.ValidateUser(user.UserToken))
            {
                return null;
            }

            JwtManegment jwtManegment = new JwtManegment();
            if (!jwtManegment.VerifyToken(user.UserEmail, user.UserToken))
            {
                return null;
            }
         
            List<Broadcast> JsonObj1 = new List<Broadcast>();
            // do not forget to install nuget package Newtonsoft.json
            WebClient WC = new WebClient();
            WC.Encoding = Encoding.UTF8;
            string Json = WC.DownloadString("https://be.repoai.com:5443/LiveApp/rest/broadcast/getVodList/0/100?fbclid=IwAR0om-OBpnGAWYwHJiz-1qTwbrUm0ML5l2Wb-S1O6ngvALvgkQv9HIJ9K0Y");
             JsonObj1.AddRange(JsonConvert.DeserializeObject<Broadcast[]>(Json));
            
            return JsonObj1;
        }

    }
}