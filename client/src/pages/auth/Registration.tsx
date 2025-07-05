import { MdOutlineFlightTakeoff } from "react-icons/md";
import { TbFidgetSpinner } from "react-icons/tb";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { imageUpload } from "../../utils/createImageUrl";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { useAppSelector } from "../../redux/hooks";
import { currentUser } from "../../redux/features/auth/authSlice";

type TFormData = {
  name: string;
  email: string;
  password: string;
  image: FileList;
};

const Registration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const loggedUser = useAppSelector(currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TFormData>();

  const onSubmit = async (data: TFormData) => {
    setLoading(true);
    const toastId = toast.loading("Registering...");
    try {
      const imageFile = data.image[0];
      const image_url = await imageUpload(imageFile);
      setLoading(false);

      const userInfo = {
        name: data.name,
        email: data.email,
        password: data.password,
        image: image_url,
      };

      await registerUser(userInfo);
      toast.success("User created successfully", {
        id: toastId,
        duration: 2000,
      });
      reset();
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  if (loggedUser) return <Navigate to={"/"} />;

  return (
    <>
      <Helmet>
        <title>Flights | Registration</title>
      </Helmet>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              Welcome to
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-mono">
                <MdOutlineFlightTakeoff /> Flights
              </span>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block mb-2 text-sm">
                  Select Image:
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  {...register("image", { required: "Image is required" })}
                />
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter Your Email Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="text-sm mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="*******"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                disabled={loading || isLoading}
                type="submit"
                className="bg-rose-500 w-full rounded-md py-3 text-white"
              >
                {isLoading || loading ? (
                  <TbFidgetSpinner className="animate-spin m-auto" />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>

          <p className="px-6 pt-4 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="hover:underline hover:text-rose-500 text-gray-600"
            >
              Login
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default Registration;
