import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { TFlight } from "../../constants";

const FlightCard = ({ flight }: { flight: TFlight }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 transition hover:scale-[1.01] duration-200 border border-gray-200 dark:border-gray-700">
      <img
        src={flight.image}
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
              {flight.date} — {flight.departureTime} → {flight.arrivalTime} (
              {flight.duration})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-emerald-600" />
            <span className="font-medium">${flight.price}</span>
          </div>
          <p className="text-sm text-gray-500">
            Seats Available: {flight.availableSeats}
          </p>
        </div>

        <div className="pt-2">
          <Link to={`/flight/${flight._id}`}>
            <button className="w-full border bg-purple-50 text-purple-700 rounded-md py-2 font-semibold hover:text-purple-800 hover:border-2 transition">
              Flight Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
