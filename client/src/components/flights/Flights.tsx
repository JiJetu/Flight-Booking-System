import { useState } from "react";
import FlightFilterBar from "./FlightFilterBar";
import FlightCard from "./FlightCard";
import Loading from "../shared/loading/Loading";
import Heading from "../shared/heading/Heading";
import {
  useGetAllFlightsQuery,
  useLazyGetSearchFlightsQuery,
} from "../../redux/features/flights/flightApi";
import { calculatePagination } from "../../utils/calculatePagination";
import { TFlight } from "../../type";
import Pagination from "../shared/pagination/Pagination";

const ITEMS_PER_PAGE = 6;

const Flights = () => {
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [page, setPage] = useState(1);

  const { data: allData, isLoading: loadingAll } = useGetAllFlightsQuery(
    { page, limit: ITEMS_PER_PAGE },
    { skip: Object.keys(filters).length > 0 }
  );

  const [triggerSearch, { data: filteredData, isLoading: loadingSearch }] =
    useLazyGetSearchFlightsQuery();

  const flights: TFlight[] = filteredData?.flights || allData?.flights || [];
  const total = filteredData?.total || allData?.total || 0;
  const pages = calculatePagination(total, ITEMS_PER_PAGE);

  const isLoading = loadingAll || loadingSearch;

  const handleFilter = (filters: Record<string, string | number>) => {
    console.log("FILTERS SENT TO SEARCH:", filters);
    setFilters(filters);
    setPage(1);
    triggerSearch({ ...filters, page: 1, limit: ITEMS_PER_PAGE });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    if (Object.keys(filters).length > 0) {
      triggerSearch({ ...filters, page: p, limit: ITEMS_PER_PAGE });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <FlightFilterBar onSearch={handleFilter} />

      {flights.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {flights.map((flight) => (
              <FlightCard key={flight._id} flight={flight} />
            ))}
          </div>

          {pages.length > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pages.length}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="min-h-[300px] flex items-center justify-center">
          <Heading
            center
            title="No Flights Found"
            subtitle="Try changing your filters."
          />
        </div>
      )}
    </div>
  );
};

export default Flights;
