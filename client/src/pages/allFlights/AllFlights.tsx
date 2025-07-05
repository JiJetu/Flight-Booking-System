import { Helmet } from "react-helmet-async";
import Flights from "../../components/flights/Flights";

const AllFlights = () => {
  return (
    <>
      <Helmet>
        <title>Flights | All Flights</title>
      </Helmet>
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Find Your Flight
        </h2>
        {/* flight filter form */}
        {/* <FlightsFilter /> */}

        {/* flight data */}
        <Flights />
      </div>
    </>
  );
};

export default AllFlights;
