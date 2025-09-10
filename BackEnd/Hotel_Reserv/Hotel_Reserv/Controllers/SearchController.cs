using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hotel_Reserv.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SearchController : ControllerBase
{
    private readonly IOrchestrationService _orchestrationService;

    public SearchController(IOrchestrationService orchestrationService)
    {
        _orchestrationService = orchestrationService;
    }

    [HttpPost("hotels")]
    public async ValueTask<IResult> SearchHotels(HotelSearchRequest request) => 
        await _orchestrationService.SearchAvailableHotelsAsync(request);
}