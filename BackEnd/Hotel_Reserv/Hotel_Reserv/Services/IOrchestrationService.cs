using Hotel_Reserv.Models.Dtos;

namespace Hotel_Reserv.Services
{
    public interface IOrchestrationService
    {
        ValueTask<IResult> SearchAvailableHotelsAsync(HotelSearchRequest request);
    }
}
