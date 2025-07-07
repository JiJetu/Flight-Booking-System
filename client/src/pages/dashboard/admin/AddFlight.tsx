import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddFlightMutation } from "../../../redux/features/flights/flightApi";
import { TFlightFormInputs } from "../../../type";
import { toast } from "sonner";
import { imageUpload } from "../../../utils/createImageUrl";
import AddFlightForm from "../../../components/form/FlightForm";
import { Helmet } from "react-helmet-async";
import Heading from "../../../components/shared/heading/Heading";
import { useForm } from "react-hook-form";

const AddFlight = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageText, setImageText] = useState("Upload Image");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [addFlight, { isLoading }] = useAddFlightMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFlightFormInputs>();

  const handleImage = (file?: File) => {
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageText(file.name);
    }
  };

  const calculateDuration = (start: string, end: string): string | null => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();

    if (diffMs < 0) {
      return null;
    }

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    if (minutes) return `${minutes}m`;
    return "0m";
  };

  const onSubmit = async (data: TFlightFormInputs) => {
    const toastId = toast.loading("Creating Flight...");

    if (!selectedImage)
      return toast.error("Please upload an image", {
        id: toastId,
        duration: 2000,
      });

    const duration = calculateDuration(data.departureTime, data.arrivalTime);
    if (!duration) {
      toast.error("Arrival time must be after departure time", {
        id: toastId,
        duration: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      const imgURL = await imageUpload(selectedImage);
      setLoading(false);

      const flightData = {
        airline: data.airline,
        flightNumber: data.flightNumber,
        origin: data.origin,
        destination: data.destination,
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime,
        duration,
        price: data.price,
        availableSeats: data.availableSeats,
        image: imgURL,
      };
      await addFlight(flightData);

      toast.success("Flight added successfully!", {
        id: toastId,
        duration: 2000,
      });

      reset();
      setSelectedImage(null);
      setImagePreview(null);
      setImageText("Upload Image");

      navigate("/dashboard/my-listings");
    } catch (error) {
      toast.error("Failed to add flight", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Flight | Dashboard</title>
      </Helmet>

      <div className="mb-8 md:hidden">
        <Heading title="Add New Flight" center />
      </div>

      <AddFlightForm
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
        isLoading={isLoading}
        loading={loading}
        imagePreview={imagePreview}
        handleImage={handleImage}
        imageText={imageText}
      />
    </>
  );
};

export default AddFlight;
