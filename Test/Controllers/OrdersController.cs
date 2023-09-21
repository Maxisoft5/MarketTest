using Microsoft.AspNetCore.Mvc;
using Test.OrdersDomain.DTOs;

namespace Test.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {

        [HttpPost("save-personal-data")]
        public IActionResult SavePersonalData([FromBody] PersonalDataDto personalData)
        {
            Thread.Sleep(5000);
            return Ok(new AcceptOrderResult());
        }

        [HttpPost("save-snils-data")]
        public IActionResult SaveSnils()
        {
            var form = this.HttpContext.Request.Form;
            Thread.Sleep(9000);
            return Ok(new AcceptOrderResult());
        }

        [HttpPost("save-send-details")]
        public IActionResult SaveSendData([FromBody] SendDetailsDto personalData)
        {
            Thread.Sleep(12000);
            return Ok(new AcceptOrderResult());
        }


    }
}
