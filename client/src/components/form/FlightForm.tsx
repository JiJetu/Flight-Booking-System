import { TFlightFormInputs } from "../../type";
import { TbFidgetSpinner } from "react-icons/tb";
import { flightLocations } from "../flightLocations/flightLocation";
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import Heading from "../shared/heading/Heading";

type TAddFlightFormProps = {
  onSubmit: SubmitHandler<TFlightFormInputs>;
  handleSubmit: UseFormHandleSubmit<TFlightFormInputs>;
  register: UseFormRegister<TFlightFormInputs>;
  errors: FieldErrors<TFlightFormInputs>;
  isLoading: boolean;
  loading: boolean;
  imagePreview: string | null;
  handleImage: (file?: File) => void;
  imageText: string;
  isUpdate?: boolean;
};
const AddFlightForm = ({
  onSubmit,
  handleSubmit,
  register,
  errors,
  isLoading,
  loading,
  imagePreview,
  handleImage,
  imageText,
  isUpdate = false,
}: TAddFlightFormProps) => {
  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50 p-6">
      {isUpdate && <Heading title={"Update Flight Info"} center />}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Origin</label>
              <select
                {...register("origin", { required: "Origin is required" })}
                className="w-full px-4 py-3 border bg-white dark:bg-purple-300 border-purple-300 focus:outline-purple-500 rounded-md"
              >
                <option value="">Select origin</option>
                {flightLocations.map((location) => (
                  <option
                    value={`${location.city}, ${location.country}`}
                    key={`${location.city}-${location.country}`}
                  >
                    {location.city}, {location.country}
                  </option>
                ))}
              </select>
              {errors.origin && (
                <p className="text-red-500">{errors.origin.message}</p>
              )}
            </div>

            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Destination</label>
              <select
                {...register("destination", {
                  required: "Destination is required",
                })}
                className="w-full px-4 py-3 border bg-white dark:bg-purple-300 border-purple-300 focus:outline-purple-500 rounded-md"
              >
                <option value="">Select destination</option>
                {flightLocations.map((location) => (
                  <option
                    value={`${location.city}, ${location.country}`}
                    key={`${location.city}-${location.country}`}
                  >
                    {location.city}, {location.country}
                  </option>
                ))}
              </select>
              {errors.destination && (
                <p className="text-red-500">{errors.destination.message}</p>
              )}
            </div>

            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Departure Time</label>
              <input
                type="datetime-local"
                {...register("departureTime", {
                  required: "Departure time is required",
                })}
                className="w-full px-4 py-3 bg-purple-500 dark:bg-purple-300 text-white border border-purple-300 focus:outline-purple-500 rounded-md"
              />
              {errors.departureTime && (
                <p className="text-red-500">{errors.departureTime.message}</p>
              )}
            </div>

            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Arrival Time</label>
              <input
                type="datetime-local"
                {...register("arrivalTime", {
                  required: "Arrival time is required",
                })}
                className="w-full px-4 py-3 bg-purple-500 dark:bg-purple-300 text-white border border-purple-300 focus:outline-purple-500 rounded-md"
              />
              {errors.arrivalTime && (
                <p className="text-red-500">{errors.arrivalTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Airline</label>
              <input
                {...register("airline", { required: "Airline is required" })}
                className="w-full px-4 py-3 border bg-white dark:bg-purple-300 border-purple-300 rounded-md focus:outline-purple-500"
                placeholder="Airline"
              />
              {errors.airline && (
                <p className="text-red-500">{errors.airline.message}</p>
              )}
            </div>

            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Flight Number</label>
              <input
                {...register("flightNumber", { required: "Required" })}
                className="w-full px-4 py-3 border bg-white dark:bg-purple-300 border-purple-300 rounded-md focus:outline-purple-500"
                placeholder="e.g. EK202"
              />
              {errors.flightNumber && (
                <p className="text-red-500">{errors.flightNumber.message}</p>
              )}
            </div>

            <div className="p-4 bg-white rounded-lg md:flex items-center justify-between gap-4">
              <div className="w-full text-center border-2 border-dotted border-gray-300 rounded-md p-3">
                <label>
                  <input
                    {...register("image", { required: "Image is required" })}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e.target.files?.[0])}
                  />
                  <span className="cursor-pointer px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                    {imageText.length > 20
                      ? imageText.split(".")[0].slice(0, 15) +
                        "..." +
                        imageText.split(".")[1]
                      : imageText || "Upload Image"}
                  </span>
                </label>
                {errors.image && (
                  <p className="text-red-500 mt-2">{errors.image.message}</p>
                )}
              </div>

              <div className="h-16 w-full mt-4 md:mt-0 md:w-16 overflow-hidden rounded-md border border-gray-300">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="space-y-1 text-sm w-full">
                <label className="block text-gray-600">Price</label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 50, message: "Minimum price must be $50" },
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-3 border bg-white dark:bg-purple-300 border-purple-300 focus:outline-purple-500 rounded-md"
                  placeholder="$"
                />
                {errors.price && (
                  <p className="text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-1 text-sm w-full">
                <label className="block text-gray-600">Available Seats</label>
                <input
                  type="number"
                  {...register("availableSeats", {
                    required: "Seat count is required",
                    min: {
                      value: 15,
                      message: "Minimum 15 seats are required",
                    },
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-3 border bg-white dark:bg-purple-300 border-purple-300 focus:outline-purple-500 rounded-md"
                  placeholder="Seats"
                />
                {errors.availableSeats && (
                  <p className="text-red-500">
                    {errors.availableSeats.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          disabled={isLoading || loading}
          type="submit"
          className="w-full p-3 mt-6 text-center font-medium text-white transition duration-200 rounded shadow-md bg-purple-700 hover:bg-purple-800"
        >
          {isLoading || loading ? (
            <TbFidgetSpinner className="animate-spin mx-auto" />
          ) : (
            "Save"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddFlightForm;
