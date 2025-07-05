import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleFlightQuery } from "../../redux/features/flights/flightApi";
import { useEffect, useState } from "react";
import Loading from "../../components/shared/loading/Loading";
import Heading from "../../components/shared/heading/Heading";
import { useForm } from "react-hook-form";
import { TFlight } from "../../constants";
import { useAppDispatch } from "../../redux/hooks";
import {
  addBooking,
  removeBooking,
} from "../../redux/features/bookings/bookingSlice";
import { Helmet } from "react-helmet-async";

type TFormData = {
  seats: number;
};

const FlightDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetSingleFlightQuery(id!, {
    skip: !id,
  });

  const flight = data as TFlight;

  const [totalPrice, setTotalPrice] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TFormData>({
    defaultValues: { seats: 1 },
  });

  const seats = watch("seats");

  useEffect(() => {
    if (flight && seats > 0) {
      setTotalPrice(seats * flight.price);
    }
  }, [seats, flight]);

  const onSubmit = (data: TFormData) => {
    dispatch(removeBooking());
    const bookingData = {
      flightId: flight?._id,
      airline: flight?.airline,
      dateTime: `${flight.date} | ${flight.departureTime} → ${flight.arrivalTime}`,
      destination: `${flight.origin} → ${flight.destination}`,
      numberOfSeats: data.seats,
      totalPrice,
    };

    // persist in local storage
    dispatch(addBooking(bookingData));
    navigate("/flight/booking-confirm");
  };

  if (isLoading) return <Loading />;
  if (isError || !flight) {
    return (
      <div className="h-[calc(100vh-170px)] flex items-center justify-center">
        <Heading
          center={true}
          title="Sorry!"
          subtitle="No flight data found..."
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Flights Details | {flight.airline}</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden">
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img
              src={flight.image}
              alt={flight.airline}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                {flight.airline}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Flight No: {flight.flightNumber}
              </p>
              <p className="text-lg font-medium">
                {flight.origin} → {flight.destination}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {flight.date} | {flight.departureTime} → {flight.arrivalTime} (
                {flight.duration})
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Available Seats:{" "}
                <span className="font-semibold">{flight.availableSeats}</span>
              </p>
              <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                Price per seat: ${flight.price}
              </p>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div>
                <label className="block font-medium mb-1">Seats to Book</label>
                <input
                  type="number"
                  min={1}
                  max={flight.availableSeats}
                  {...register("seats", {
                    required: "Please enter number of seats",
                    min: { value: 1, message: "Minimum 1 seat" },
                    max: {
                      value: flight.availableSeats,
                      message: `Max ${flight.availableSeats} seats available`,
                    },
                    valueAsNumber: true,
                  })}
                  className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
                {errors.seats && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.seats.message}
                  </p>
                )}
              </div>

              <p className="text-xl font-bold">
                Total Price:{" "}
                <span className="text-purple-700 dark:text-purple-300">
                  ${totalPrice}
                </span>
              </p>

              <button
                type="submit"
                disabled={seats < 1 || seats > flight.availableSeats}
                className={`w-full rounded-md py-3 font-semibold transition duration-300 ${
                  seats < 1 || seats > flight.availableSeats
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "border-2 text-purple-600 hover:bg-purple-100"
                }`}
              >
                Continue to Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightDetails;
