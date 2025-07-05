import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import queryString from "query-string";
import banner from "../../assets/images/banner.gif";

type TSearchFields = {
  origin: string;
  destination: string;
  date: string;
};

const Hero = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSearchFields>();

  const onSubmit = (data: TSearchFields) => {
    const query = queryString.stringify(data);
    navigate(`/all-flights?${query}`);
  };

  return (
    <div className="text-gray-800 dark:text-white">
      <div
        className="bg-cover bg-center h-[400px] md:h-[calc(100vh-130px)] relative flex items-center justify-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="bg-black bg-opacity-60 w-full h-full absolute" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Find Your Next Flight
          </h1>
          <p className="text-white text-lg mb-6">
            Search & book flights around the world.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-4 gap-2 max-w-4xl mx-auto text-left"
          >
            <div>
              <input
                {...register("origin", { required: "Origin is required" })}
                type="text"
                placeholder="Origin"
                className={`rounded px-4 py-2 w-full border ${
                  errors.origin ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.origin && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.origin.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("destination", {
                  required: "Destination is required",
                })}
                type="text"
                placeholder="Destination"
                className={`rounded px-4 py-2 w-full border ${
                  errors.destination ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.destination.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("date", {
                  required: "Date is required",
                  validate: (value) =>
                    new Date(value) >= new Date() ||
                    "Date cannot be in the past",
                })}
                type="date"
                className={`rounded px-4 py-2 w-full border ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-purple-700 text-white rounded h-[45px] w-full hover:bg-purple-800 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
