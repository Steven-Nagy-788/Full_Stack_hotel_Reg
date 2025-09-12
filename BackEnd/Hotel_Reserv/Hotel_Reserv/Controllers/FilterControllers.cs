
//using Azure.Core;
//using Hotel_Reserv.Data;
//using Hotel_Reserv.Models;
//using Hotel_Reserv.Models.Dtos;
//using Hotel_Reserv.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace Hotel_Reserv.FilterControllers;

//[Route("api/[controller]")]
//[ApiController]
//public class FilterControllers(IOrchestrationService orchestrationService) : ControllerBase
//{
//    [HttpPost("Filter-to-book")]
//    public async ValueTask<IResult> PostUser(FilterRecord request) =>
//        await orchestrationService.FilterAsync(request);

//}