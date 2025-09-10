using Microsoft.AspNetCore.Mvc;
using Hotel_Reserv.Models;
using Hotel_Reserv.Services;
using Hotel_Reserv.Models.Dtos;
namespace Hotel_Reserv.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomTypesController(IRoomTypeService roomTypeService) : ControllerBase
{
    [HttpGet("getallrooms")]
    public async ValueTask<IResult> GetRoomTypes() => 
        await roomTypeService.GetRoomTypes();
    
    [HttpGet("get room by id{id}")]
    public async ValueTask<IResult> GetRoomType(int id) =>
        await roomTypeService.GetRoomType(id);
    
    [HttpPost("create new room")]
    public async ValueTask<IResult> PostRoomType(RoomTypeDto roomType) => 
        await roomTypeService.CreateRoomType(roomType);
   
    [HttpPut("update {id}")]
    public async ValueTask<IResult> PutRoomType(int id, RoomType roomType) =>
         await roomTypeService.UpdateRoomType(id, roomType);
   
    [HttpDelete("delete  {id}")]
    public async ValueTask<IResult> DeleteRoomType(int id) =>
        await roomTypeService.DeleteRoomType(id);
    
}