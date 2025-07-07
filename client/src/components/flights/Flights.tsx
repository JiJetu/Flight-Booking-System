import { TFlight } from "../../type";
import { useGetAllFlightsQuery } from "../../redux/features/flights/flightApi";
import Heading from "../shared/heading/Heading";
import Loading from "../shared/loading/Loading";
import FlightCard from "./FlightCard";

const Flights = () => {
  const { data, isLoading } = useGetAllFlightsQuery(undefined);

  const flights = (data || []) as TFlight[];

  if (isLoading) return <Loading />;

  return (
    <>
      {flights.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights?.map((flight) => (
            <FlightCard key={flight._id} flight={flight} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
          <Heading
            center={true}
            title="Sorry!"
            subtitle="No flights data found..."
          />
        </div>
      )}
    </>
  );
};

export default Flights;
