import { Helmet } from "react-helmet-async";
import Hero from "../../components/hero/Hero";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Flights</title>
      </Helmet>

      <Hero />
    </>
  );
};

export default Home;
