using Microsoft.AspNetCore.Mvc;
using Hotel_Reserv.Models;
using Hotel_Reserv.Services;
using Hotel_Reserv.Models.Dtos;

namespace Hotel_Reserv.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomTypesController(IRoomTypeService roomTypeService) : ControllerBase
{
    [HttpGet("hetallrooms")]
    public async ValueTask<IResult> GetRoomTypes() => await roomTypeService.GetRoomTypes();
    
    
    [HttpGet("get room by id{id}")]
    public async ValueTask<IResult> GetRoomType(int id) => await roomTypeService.GetRoomType(id);
    
    [HttpPost("create new room")]
    public async ValueTask<IResult> PostRoomType(RoomTypeDTO roomType) => await roomTypeService.CreateRoomType(roomType);
    
    // PUT: api/RoomTypes/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("update {id}")]
    public async ValueTask<IResult> PutRoomType(int id, RoomType roomType)
    {
        return await roomTypeService.UpdateRoomType(id, roomType);
    }
    // DELETE: api/RoomTypes/5
    [HttpDelete("delete  {id}")]
    public async ValueTask<IResult> DeleteRoomType(int id)
    {
        return await roomTypeService.DeleteRoomType(id);
    }
}