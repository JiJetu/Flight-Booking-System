import { TbFidgetSpinner } from "react-icons/tb";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  currentUser,
  setUser,
  TUser,
} from "../../redux/features/auth/authSlice";
import { verifyToken } from "../../utils/verifyToken";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";

type TFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();

  const onSubmit = async (data: TFormData) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res: any = await login(data);

      if (res?.error?.status === 404 || res?.error?.status === 401) {
        return toast.error(res?.error?.data?.message, {
          id: toastId,
          duration: 2000,
        });
      }

      const user = verifyToken(res?.data?.accessToken) as TUser;
      user.image = res?.data?.image;
      user.name = res?.data?.name;
      await dispatch(setUser({ user, token: res?.data?.accessToken }));
      toast.success("Login successful", { id: toastId, duration: 2000 });
      user.role === "admin"
        ? navigate("/dashboard")
        : navigate(from, { replace: true });
    } catch (err) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  if (loggedUser) return <Navigate to={"/"} />;

  return (
    <>
      <Helmet>
        <title>Flights | Login</title>
      </Helmet>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-4xl font-bold">Log In</h1>
            <p className="text-sm text-gray-400">
              Sign in to access your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 ng-untouched ng-pristine ng-valid"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email address
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter Your Email Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-500 bg-gray-200 text-gray-900"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm mb-2">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="*******"
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-purple-500 bg-gray-200 text-gray-900"
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
                disabled={isLoading}
                type="submit"
                className="bg-purple-500 w-full rounded-md py-3 text-white"
              >
                {isLoading ? (
                  <TbFidgetSpinner className="animate-spin m-auto" />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="space-y-1">
            <button className="text-xs hover:underline hover:text-purple-500 text-gray-400">
              Forgot password?
            </button>
          </div>

          <p className="px-6 pt-4 text-sm text-center text-gray-400">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/register"
              className="hover:underline hover:text-purple-500 text-gray-600"
            >
              Sign up
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
