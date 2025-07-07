import { Helmet } from "react-helmet-async";
import {
  useDeleteFlightMutation,
  useGetAllFlightsQuery,
} from "../../../redux/features/flights/flightApi";
import { TFlight } from "../../../type";
import Loading from "../../../components/shared/loading/Loading";
import { toast } from "sonner";
import FlightDataRow from "../../../components/tableRow/FlightDataRow";

const MyListings = () => {
  const { data, isLoading } = useGetAllFlightsQuery(undefined);
  const [deleteFlight] = useDeleteFlightMutation();

  const flights = (data || []) as TFlight[];

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting Flight...");

    try {
      await deleteFlight(id);
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
                  {flights?.map((flight) => (
                    <FlightDataRow
                      key={flight._id}
                      flight={flight}
                      handleDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyListings;
