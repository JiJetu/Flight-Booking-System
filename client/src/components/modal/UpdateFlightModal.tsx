import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { imageUpload } from "../../utils/createImageUrl";
import { toast } from "sonner";
import AddFlightForm from "../form/FlightForm";
import { TFlight, TFlightFormInputs } from "../../type";
import { useUpdateFlightMutation } from "../../redux/features/flights/flightApi";

interface UpdateFlightModalProps {
  isOpen: boolean;
  closeModal: () => void;
  flight: TFlight;
}

const UpdateFlightModal = ({
  isOpen,
  closeModal,
  flight,
}: UpdateFlightModalProps) => {
  const [updateFlight, { isLoading }] = useUpdateFlightMutation();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(flight.image);
  const [imageText, setImageText] = useState("Change Image");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFlightFormInputs>({
    defaultValues: {
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      availableSeats: flight.availableSeats,
    },
  });

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

    if (diffMs < 0) return null;

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    if (minutes) return `${minutes}m`;
    return "0m";
  };

  const onSubmit = async (data: TFlightFormInputs) => {
    const toastId = toast.loading("Updating Flight...");

    const duration = calculateDuration(data.departureTime, data.arrivalTime);
    if (!duration) {
      toast.error("Arrival time must be after departure time", {
        id: toastId,
        duration: 2000,
      });
      return;
    }

    try {
      let imageUrl = flight.image;

      if (selectedImage) {
        setLoading(true);
        imageUrl = await imageUpload(selectedImage);
        setLoading(false);
      }

      const updatedData = {
        ...data,
        duration,
        image: imageUrl,
      };

      await updateFlight({ id: flight._id, data: updatedData });

      toast.success("Flight updated successfully!", {
        id: toastId,
        duration: 2000,
      });

      closeModal();
    } catch (error) {
      toast.error("Failed to update flight", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
                <div className="mt-2 w-full">
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
                    isUpdate
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateFlightModal;
