import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetAllBookingsQuery,
  useDeleteBookingSMutation,
  useUpdateBookingStatusMutation,
} from "../../../redux/features/bookings/bookingApi";
import Loading from "../../../components/shared/loading/Loading";
import DeleteFlightModal from "../../../components/modal/DeleteFlightModal";
import { TBooking } from "../../../type";
import { TbTrash } from "react-icons/tb";
import Pagination from "../../../components/shared/pagination/Pagination";

const ManageBookings = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useGetAllBookingsQuery({ page, limit });
  const [deleteBooking] = useDeleteBookingSMutation();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const bookings = data?.bookings || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting Booking...");
    try {
      await deleteBooking(id);
      toast.success("Booking deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete booking", { id: toastId });
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Confirm" | "Cancel"
  ) => {
    const toastId = toast.loading("Updating status...");
    try {
      await updateBookingStatus({ id, status: newStatus });
      toast.success(`Booking ${newStatus.toLowerCase()}ed successfully`, {
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Helmet>
        <title>Manage Bookings | Dashboard</title>
      </Helmet>

      <div className="container mx-auto px-4 md:p-2">
        <div className="py-8">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 bg-white border-b text-gray-800 text-left text-sm uppercase font-normal">
                      Booking ID
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-gray-800 text-left text-sm uppercase font-normal">
                      Flight Info
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-gray-800 text-left text-sm uppercase font-normal">
                      Passenger Info
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-gray-800 text-left text-sm uppercase font-normal">
                      Seats
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-gray-800 text-left text-sm uppercase font-normal">
                      Total Price
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-gray-800 text-left text-sm uppercase font-normal">
                      Status
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-gray-800 text-left text-sm uppercase font-normal">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="text-black">
                  {bookings.map((booking: TBooking) => (
                    <tr key={booking._id}>
                      <td className="px-5 py-5 border-b bg-white text-sm">
                        {booking._id}
                      </td>

                      <td className="px-5 py-5 border-b bg-white text-sm">
                        <p className="font-medium">
                          {booking.flightDetails?.airline || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          #{booking.flightDetails?.flightNumber}
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b bg-white text-sm">
                        <p className="font-medium">
                          {booking.userDetails?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.userDetails?.email || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b bg-white text-sm">
                        {booking.numberOfSeats}
                      </td>
                      <td className="px-5 py-5 border-b bg-white text-sm">
                        ${booking.totalPrice}
                      </td>

                      <td className="px-5 py-5 border-b bg-white text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
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

                      <td className="px-5 py-5 bg-white text-sm">
                        {booking.status === "Pending" && (
                          <div className="flex gap-2 mb-2">
                            <button
                              title="Confirm Booking"
                              onClick={() =>
                                handleStatusChange(booking._id, "Confirm")
                              }
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Confirm
                            </button>
                            <button
                              title="Cancel Booking"
                              onClick={() =>
                                handleStatusChange(booking._id, "Cancel")
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <div className="flex justify-center items-center pt-2">
                          <button
                            title="Delete Booking"
                            onClick={() => {
                              setSelectedId(booking._id);
                              setIsOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TbTrash size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                textColor="text-black"
              />
            )}
          </div>
        </div>
      </div>

      <DeleteFlightModal
        id={selectedId as string}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default ManageBookings;
