import { Helmet } from "react-helmet-async";
import {
  useDeleteFlightMutation,
  useGetAllFlightsQuery,
} from "../../../redux/features/flights/flightApi";
import Loading from "../../../components/shared/loading/Loading";
import { toast } from "sonner";
import FlightDataRow from "../../../components/tableRow/FlightDataRow";
import { useState } from "react";
import Pagination from "../../../components/shared/pagination/Pagination";

const ITEMS_PER_PAGE = 5;

const MyListings = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllFlightsQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });
  const [deleteFlight] = useDeleteFlightMutation();

  const flights = data?.flights || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting Flight...");

    try {
      await deleteFlight(id).unwrap();
      toast.success("Flight deleted successfully!", {
        id: toastId,
        duration: 2000,
      });
    } catch (error) {
      toast.error("Failed to delete flight", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Helmet>
        <title>My Listings | Dashboard</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      Image
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      Airline
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      From
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      To
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      Price
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      Seats
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      Time
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      Delete
                    </th>
                    <th className="px-5 py-3 bg-white border-b text-left text-sm font-medium text-gray-600">
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight) => (
                    <FlightDataRow
                      key={flight._id}
                      flight={flight}
                      handleDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              textColor="text-black"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyListings;
