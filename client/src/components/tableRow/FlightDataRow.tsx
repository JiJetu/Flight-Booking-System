import { useState } from "react";
import DeleteFlightModal from "../modal/DeleteFlightModal";
import { TFlight } from "../../type";
import UpdateFlightModal from "../modal/UpdateFlightModal";
import { BiEdit, BiTrash } from "react-icons/bi";

type TFlightDataRowProps = {
  flight: TFlight;
  handleDelete: (id: string) => void;
};

const FlightDataRow = ({ flight, handleDelete }: TFlightDataRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <tr className="text-black text-sm">
      <td className="px-5 py-5 border-b bg-white">
        <img
          src={flight.image}
          alt={flight.airline}
          className="w-16 h-10 rounded object-cover"
        />
      </td>
      <td className="px-5 py-5 border-b bg-white">{flight.airline}</td>
      <td className="px-5 py-5 border-b bg-white">{flight.origin}</td>
      <td className="px-5 py-5 border-b bg-white">{flight.destination}</td>
      <td className="px-5 py-5 border-b bg-white">${flight.price}</td>
      <td className="px-5 py-5 border-b bg-white">{flight.availableSeats}</td>
      <td className="px-5 py-5 border-b bg-white">
        <div className="space-y-1">
          <div className="text-xs text-gray-600">
            Departure: {new Date(flight.departureTime).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">
            Arrival: {new Date(flight.arrivalTime).toLocaleString()}
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b bg-white text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="text-red-700 hover:underline"
        >
          <BiTrash size={18} />
        </button>
        <DeleteFlightModal
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
          handleDelete={handleDelete}
          id={flight._id}
        />
      </td>
      <td className="px-5 py-5 border-b bg-white text-sm text-center">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-green-700 hover:underline"
        >
          <BiEdit size={18} />
        </button>
        <UpdateFlightModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          flight={flight}
        />
      </td>
    </tr>
  );
};

export default FlightDataRow;
