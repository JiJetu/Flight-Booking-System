import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { TFlight } from "../../type";
import cardDefImage from "../../assets/images/banner.gif";

const FlightCard = ({ flight }: { flight: TFlight }) => {
  const isSoldOut = flight.availableSeats < 1;

  const departureDate = new Date(flight?.departureTime).toLocaleDateString();
  const departureTime = new Date(flight?.departureTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const arrivalDate = new Date(flight?.arrivalTime).toLocaleDateString();
  const arrivalTime = new Date(flight?.arrivalTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition duration-200 border 
        ${
          isSoldOut
            ? "bg-gray-200 dark:bg-gray-800 opacity-70 grayscale"
            : "bg-white dark:bg-gray-900"
        }
        border-gray-200 dark:border-gray-700 hover:scale-[1.01]`}
    >
      <img
        src={flight.image ? flight.image : cardDefImage}
        alt={flight.airline}
        className="h-48 w-full object-cover"
      />

      <div className="p-4 space-y-2">
        <div className="text-xl font-semibold text-gray-800 dark:text-white">
          {flight.airline}{" "}
          <span className="text-sm text-gray-500">({flight.flightNumber})</span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FaPlaneDeparture className="text-blue-600" />
            <span>{flight.origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPlaneArrival className="text-green-600" />
            <span>{flight.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-yellow-600" />
            <span>
              {departureDate} | {departureTime} →{" "}
              {departureDate === arrivalDate ? "" : `${arrivalDate} |`}{" "}
              {arrivalTime} ({flight?.duration})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-emerald-600" />
            <span className="font-medium">${flight.price}</span>
          </div>
          <p className="text-sm text-gray-500">
            Seats Available:{" "}
            <span className={isSoldOut ? "text-red-600 font-semibold" : ""}>
              {flight.availableSeats > 0 ? flight.availableSeats : "Sold Out"}
            </span>
          </p>
        </div>

        <div className="pt-2">
          <Link to={`/flight/${flight._id}`}>
            <button
              className={`w-full rounded-md py-2 font-semibold transition ${
                isSoldOut
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "border bg-purple-50 text-purple-700 hover:text-purple-800 hover:border-2"
              }`}
              disabled={isSoldOut}
            >
              {isSoldOut ? "Sold Out" : "Flight Details"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
