import { Helmet } from "react-helmet-async";
import { useAppSelector } from "../../../redux/hooks";
import { currentUser } from "../../../redux/features/auth/authSlice";

const Profile = () => {
  const user = useAppSelector(currentUser);

  return (
    <>
      <Helmet>
        <title>My Profile</title>
      </Helmet>

      <Helmet>
        <title>My Profile</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-8 py-10">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          My Profile
        </h1>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow">
              <img
                src={user?.image || "/default-profile.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full">
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  {user?.name || "N/A"}
                </h2>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  {user?.email || "N/A"}
                </h2>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white capitalize">
                  {user?.role || "User"}
                </h2>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  User ID
                </p>
                <h2 className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                  {user?.userId || "N/A"}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
