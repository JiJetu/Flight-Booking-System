import { useForm } from "react-hook-form";
import { flightLocations } from "../flightLocations/flightLocation";

type FilterFormData = {
  origin?: string;
  destination?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  minSeats?: number;
};

type FilterProps = {
  onSearch: (filters: Record<string, string | number>) => void;
};

const FlightFilterBar = ({ onSearch }: FilterProps) => {
  const { register, handleSubmit } = useForm<FilterFormData>({
    defaultValues: {
      origin: "",
      destination: "",
      date: "",
      minPrice: undefined,
      maxPrice: undefined,
      minSeats: undefined,
    },
  });

  const onSubmit = (data: FilterFormData) => {
    const filters: Record<string, string | number> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        filters[key] = value;
      }
    });
    onSearch(filters);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md space-y-4"
    >
      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="origin" className="text-sm font-medium mb-1">
            Origin
          </label>
          <select
            id="origin"
            {...register("origin")}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select Origin</option>
            {flightLocations.map(({ city, country }) => (
              <option key={city} value={`${city}, ${country}`}>
                {city}, {country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="destination" className="text-sm font-medium mb-1">
            Destination
          </label>
          <select
            id="destination"
            {...register("destination")}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select Destination</option>
            {flightLocations.map(({ city, country }) => (
              <option key={city} value={`${city}, ${country}`}>
                {city}, {country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm font-medium mb-1">
            Departure Date
          </label>
          <input
            id="date"
            type="date"
            {...register("date")}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="minPrice" className="text-sm font-medium mb-1">
            Min Price ($)
          </label>
          <input
            id="minPrice"
            type="number"
            {...register("minPrice")}
            placeholder="e.g. 100"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="maxPrice" className="text-sm font-medium mb-1">
            Max Price ($)
          </label>
          <input
            id="maxPrice"
            type="number"
            {...register("maxPrice")}
            placeholder="e.g. 1000"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="minSeats" className="text-sm font-medium mb-1">
            Minimum Seats
          </label>
          <input
            id="minSeats"
            type="number"
            {...register("minSeats")}
            placeholder="e.g. 2"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded transition duration-200"
        >
          Search Flights
        </button>
      </div>
    </form>
  );
};

export default FlightFilterBar;
