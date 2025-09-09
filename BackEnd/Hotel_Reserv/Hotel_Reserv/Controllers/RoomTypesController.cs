using Microsoft.AspNetCore.Mvc;
using Hotel_Reserv.Models;
using Hotel_Reserv.Services;

namespace Hotel_Reserv.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomTypesController(IRoomTypeService roomTypeService) : ControllerBase
{
    [HttpGet]
    public async ValueTask<IResult> GetRoomTypes() => await roomTypeService.GetRoomTypes();
    [HttpGet("{id}")]
    public async ValueTask<IResult> GetRoomType(int id) => await roomTypeService.GetRoomType(id);

    // PUT: api/RoomTypes/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async ValueTask<IResult> PutRoomType(int id, RoomType roomType)
    {
        return await roomTypeService.UpdateRoomType(id, roomType);
    }


  
    // DELETE: api/RoomTypes/5
    [HttpDelete("{id}")]
    public async ValueTask<IResult> DeleteRoomType(int id)
    {
        return await roomTypeService.DeleteRoomType(id);
    }
}