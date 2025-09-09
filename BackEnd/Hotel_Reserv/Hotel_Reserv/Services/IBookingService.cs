using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;

namespace Hotel_Reserv.Services;

public interface IBookingService
{
    ValueTask<IResult> GetBookings();
    ValueTask<IResult> GetBooking(int id);
    ValueTask<IResult> GetBookingsByUserId(int userId);
    ValueTask<IResult> CreateBooking(BookingDTO bookingDto);
    ValueTask<IResult> UpdateBooking(int id, BookingUpdateDTO bookingUpdateDto);
    ValueTask<IResult> UpdateBookingStatus(int id, BookingStatusUpdateDTO statusDto);
    ValueTask<IResult> DeleteBooking(int id);
}
