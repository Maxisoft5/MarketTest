using Market.Domain.Products;
using Microsoft.AspNetCore.Mvc;

namespace Market.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ILogger<ProductsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("price-list")]
    public IEnumerable<Product> Get()
    {
        return new List<Product>() 
        {   new Product()
            {
                Id = 1,
                Name = "Бумага",
                Price = 1000,
                Properties = new
                {
                    Color = "белый",
                    Format = "A4"
                }
            },
            new Product()
            {
                Id = 2,
                Name = "Бумага",
                Price = 2000,
                Properties = new
                {
                    Color = "белый",
                    Format = "А3"
                }
            },
            new Product()
            {
                Id = 3,
                Name = "Бумага",
                Price = 3000,
                Properties = new
                {
                    Color = "белый",
                    Format = "А3"
                }
            },
            new Product()
            {
                Id = 4,
                Name = "Бумага",
                Price = 4000,
                Properties = new
                {
                    Color = "белый",
                    Format = "А3"
                }
            }
        };
    }

}
