import { MdOutlineFlightTakeoff } from "react-icons/md";
import { TbFidgetSpinner } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { imageUpload } from "../../utils/createImageUrl";
import { toast } from "sonner";

const Registration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: FieldValues) => {
    e.preventDefault();
    setLoading(true);
    const tostId = toast.loading("Registering....");
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const image = form.image.files[0];

    try {
      // uploading image in imgBB to get image URL
      const image_url = await imageUpload(image);
      setLoading(false);

      const userInfo = {
        name,
        email,
        password,
        image: image_url,
      };

      await register(userInfo);
      toast.success("User created successfully", {
        id: tostId,
        duration: 2000,
      });
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong", { id: tostId, duration: 2000 });
    }
  };

  return (
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 text-sm">
                Select Image:
              </label>
              <input
                required
                type="file"
                id="image"
                name="image"
                accept="image/*"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter Your Email Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm mb-2">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                id="password"
                required
                placeholder="*******"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
              />
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
  );
};

export default Registration;
