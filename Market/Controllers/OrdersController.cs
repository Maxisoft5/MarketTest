using Market.OrdersDomain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Test.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {

        [HttpPost("save-personal-data")]
        public IActionResult SavePersonalData([FromBody] PersonalDataDto personalData)
        {
            Thread.Sleep(4000);// simulate work
            return Ok(new AcceptOrderResult());
        }

        [HttpPost("save-snils-data")]
        public IActionResult SaveSnils()
        {
            var form = this.HttpContext.Request.Form;
            Thread.Sleep(6000); // simulate work
            return Ok(new AcceptOrderResult());
        }

        [HttpPost("save-send-details")]
        public IActionResult SaveSendData([FromBody] SendDetailsDto personalData)
        {
            Thread.Sleep(8000);// simulate work
            return Ok(new AcceptOrderResult());
        }


    }
}
