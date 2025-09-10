using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Hotel_Reserv.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomInventoriesController : ControllerBase
{
    private readonly IRoomInventoryService roomInventoryService;

    public RoomInventoriesController(IRoomInventoryService RoomInventoryService)
    {
        roomInventoryService = RoomInventoryService;
    }

    [HttpGet]
    public async ValueTask<IResult> GetAllRoomInv() =>
        await roomInventoryService.GetAllRoomInvAsync();

    [HttpGet("{id}")]
    public async ValueTask<IResult> GetRoomInvById(int id) =>
        await roomInventoryService.GetRoomInvByIdAsync(id);

    [HttpGet("roomType/{id}")]
    public async ValueTask<IResult> GetRoomInvByRoomTypeId(int id) =>
    await roomInventoryService.GetRoomInvByRoomTypeIdAsync(id);

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async ValueTask<IResult> CreateRoomInv(RoomInventroyCreateDto dto) =>
        await roomInventoryService.CreateRoomInvAsync(dto);
   
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async ValueTask<IResult> UpdateRoomInv(int id, RoomInventroyUpdateDto dto) =>
        await roomInventoryService.UpdateRoomInvAsync(id, dto);

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async ValueTask<IResult> DeleteRoomInv(int id) =>
        await roomInventoryService.DeleteRoomInvAsync(id);
}