import { useForm } from "react-hook-form";
import { currentUser } from "../../redux/features/auth/authSlice";
import { currentFlightBooking } from "../../redux/features/bookings/bookingSlice";
import { useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import Heading from "../../components/shared/heading/Heading";
import { toast } from "sonner";
import { TbFidgetSpinner } from "react-icons/tb";
import { Helmet } from "react-helmet-async";
import { useBookAFlightMutation } from "../../redux/features/bookings/bookingApi";
import { useNavigate } from "react-router-dom";

type TFormData = {
  numberOfSeats: number;
};

const BookingConfirm = () => {
  const navigate = useNavigate();
  const bookingFlight = useAppSelector(currentFlightBooking);
  const user = useAppSelector(currentUser);
  const [bookAFlight, { isLoading }] = useBookAFlightMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TFormData>({
    defaultValues: {
      numberOfSeats: bookingFlight?.numberOfSeats || 1,
    },
  });

  const numberOfSeats = watch("numberOfSeats");
  const [calculatedTotal, setCalculatedTotal] = useState(
    bookingFlight?.totalPrice || 0
  );

  useEffect(() => {
    if (bookingFlight) {
      const unitPrice = bookingFlight.totalPrice / bookingFlight.numberOfSeats;
      setCalculatedTotal(unitPrice * numberOfSeats);
    }
  }, [numberOfSeats, bookingFlight]);

  const onSubmit = async (data: TFormData) => {
    const toastId = toast.loading("Booking Flights....");
    const finalBooking = {
      flightId: bookingFlight?.flightId,
      user: {
        email: user?.email,
      },
      numberOfSeats: data.numberOfSeats,
      totalPrice: calculatedTotal,
    };

    try {
      await bookAFlight(finalBooking);

      toast.success("Please! Wait for Admin Approver", {
        id: toastId,
        duration: 2000,
      });
      navigate(`/${user?.role}/my-bookings`);
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  if (!bookingFlight || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Heading
          title="Oops!"
          subtitle="No booking or user data found. Please go back and try again."
          center
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Flight Confirm | {bookingFlight.airline}</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-5">
          <Heading title="Confirm Your Booking" center />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Airline</label>
              <input
                type="text"
                value={bookingFlight.airline}
                disabled
                className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Date & Time</label>
              <input
                type="text"
                value={bookingFlight.dateTime}
                disabled
                className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Destination</label>
              <input
                type="text"
                value={bookingFlight.destination}
                disabled
                className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Number of Seats</label>
              <input
                type="number"
                min={1}
                {...register("numberOfSeats", {
                  required: "Please enter seat count",
                  min: { value: 1, message: "Minimum 1 seat" },
                })}
                className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              {errors.numberOfSeats && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.numberOfSeats.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Total Price</label>
              <input
                type="text"
                value={`$${calculatedTotal.toFixed(2)}`}
                disabled
                className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-6 rounded transition"
              >
                {isLoading ? (
                  <TbFidgetSpinner className="animate-spin m-auto" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingConfirm;
