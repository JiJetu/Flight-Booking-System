import { TFlight } from "../../type";

type TFilterSidebarProps = {
  setAirline: (val: string) => void;
  setMinSeats: (val: number) => void;
  setSortBy: (val: string) => void;
  flights: TFlight[];
};

const FilterSidebar = ({
  setAirline,
  setMinSeats,
  setSortBy,
  flights,
}: TFilterSidebarProps) => {
  const airlineOptions = [...new Set(flights.map((f) => f.airline))];

  return (
    <div className="bg-white dark:bg-gray-900 shadow p-4 rounded w-full lg:w-[250px]">
      <h3 className="font-semibold mb-2">Filters</h3>

      <label className="block mb-1 text-sm">Airline</label>
      <select
        onChange={(e) => setAirline(e.target.value)}
        className="w-full border rounded px-2 py-1 mb-4"
      >
        <option value="">All</option>
        {airlineOptions.map((airline, i) => (
          <option key={i} value={airline}>
            {airline}
          </option>
        ))}
      </select>

      <label className="block mb-1 text-sm">Minimum Seats</label>
      <input
        type="number"
        min="0"
        placeholder="e.g. 2"
        onChange={(e) => setMinSeats(Number(e.target.value))}
        className="w-full border rounded px-2 py-1 mb-4"
      />

      <label className="block mb-1 text-sm">Sort By</label>
      <select
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full border rounded px-2 py-1"
      >
        <option value="">None</option>
        <option value="price">Price</option>
        <option value="duration">Duration</option>
      </select>
    </div>
  );
};

export default FilterSidebar;
