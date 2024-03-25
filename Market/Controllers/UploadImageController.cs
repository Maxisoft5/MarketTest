using Market.UploadImagesDomain;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Market.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadImageController : ControllerBase
    {
        private readonly ILogger<UploadImageController> _logger;

        public UploadImageController(ILogger<UploadImageController> logger)
        {
            _logger = logger;
        }

        [HttpGet("get-image-bytes")]
        public async Task<IActionResult> GetImageBytes([FromBody] ImageInfo imageInfo)
        {
            WebClient client = new();
            byte[] imageData = await client.DownloadDataTaskAsync(new Uri(imageInfo.Url));
            return Ok(imageData);
        }
    }
}
