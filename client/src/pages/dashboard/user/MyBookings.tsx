import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { currentUser } from "../../../redux/features/auth/authSlice";
import {
  useGetMyBookingsQuery,
  useUpdateBookingStatusMutation,
} from "../../../redux/features/bookings/bookingApi";
import { TBooking } from "../../../type";
import Loading from "../../../components/shared/loading/Loading";
import { toast } from "sonner";
import Pagination from "../../../components/shared/pagination/Pagination";
import Heading from "../../../components/shared/heading/Heading";

const MyBookings = () => {
  const user = useAppSelector(currentUser);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useGetMyBookingsQuery({
    id: user?.userId,
    page,
    limit,
  });
  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  const bookings = data?.bookings || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleCancel = async (id: string) => {
    const toastId = toast.loading("Cancelling booking...");
    try {
      const res = await updateBookingStatus({ id, status: "Cancel" });
      toast.success(res?.data?.message || "Booking cancelled", { id: toastId });
    } catch (error) {
      toast.error("Failed to cancel booking", { id: toastId });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Helmet>
        <title>My Bookings</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-8 py-6">
        <h1 className="text-2xl font-semibold mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-black">
            <Heading title="No bookings found." />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
              <thead className="bg-gray-50 text-gray-700 uppercase text-left">
                <tr>
                  <th className="px-6 py-3">Flight</th>
                  <th className="px-6 py-3 text-center">Seats</th>
                  <th className="px-6 py-3 text-center">Price</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking: TBooking) => (
                  <tr
                    key={booking._id}
                    title={
                      booking.status === "Pending"
                        ? "Booking can be cancelled within 2 hours"
                        : undefined
                    }
                    className="hover:bg-gray-50 text-black"
                  >
                    <td className="px-6 py-4 flex-1 text-start">
                      <div className="font-medium">
                        {booking.flightId?.airline || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        #{booking.flightId?.flightNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex-1">
                      {booking.numberOfSeats}
                    </td>
                    <td className="px-6 py-4 flex-1">${booking.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white ${
                          booking.status === "Confirm"
                            ? "bg-green-500"
                            : booking.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {booking.status === "Pending" ? (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded transition"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          N/A
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            textColor="text-black"
          />
        )}
      </div>
    </>
  );
};

export default MyBookings;
