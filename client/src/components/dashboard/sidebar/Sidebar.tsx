import { useState } from "react";
import { GrLogout } from "react-icons/gr";
import { FcSettings } from "react-icons/fc";
import { AiOutlineBars } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { Link } from "react-router-dom";
import UserMenu from "../menu/UserMenu";
import MenuItem from "../menu/MenuItem";
import AdminMenu from "../menu/AdminMenu";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { currentUser, logout } from "../../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../../redux/features/auth/authApi";
import { removeBooking } from "../../../redux/features/bookings/bookingSlice";
import { MdOutlineFlightTakeoff } from "react-icons/md";

const Sidebar = () => {
  const [isActive, setActive] = useState(false);

  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive);
  };

  const user = useAppSelector(currentUser);
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    // remove local storage data
    dispatch(logout());
    dispatch(removeBooking());

    await logoutUser(undefined);
  };

  return (
    <>
      {/* Small Screen Navbar */}
      <div className="bg-gray-100 text-gray-800 flex justify-between md:hidden">
        <div>
          <div className="block cursor-pointer p-4 font-bold">
            <Link
              className="flex items-center gap-2 text-xl text-purple-600 dark:text-purple-400 font-bold font-mono"
              to={"/"}
            >
              <MdOutlineFlightTakeoff /> Flights
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-gray-100 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${
          isActive && "-translate-x-full"
        }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div>
          <div>
            <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-purple-200 mx-auto">
              <Link
                className="flex items-center gap-2 text-xl text-purple-600 dark:text-purple-400 font-bold font-mono"
                to={"/"}
              >
                <MdOutlineFlightTakeoff /> Flights
              </Link>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col justify-between flex-1 mt-6">
            {/*  Menu Items */}
            <nav>
              {/* Statistics */}
              <MenuItem
                label="Statistics"
                address="/dashboard"
                icon={BsGraphUp}
              />
              {user?.role === "user" && <UserMenu />}

              {user?.role === "admin" && <AdminMenu />}
            </nav>
          </div>
        </div>

        <div>
          <hr />

          {/* Profile Menu */}
          <MenuItem
            label="Profile"
            address="/dashboard/profile"
            icon={FcSettings}
          />

          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300   hover:text-gray-700 transition-colors duration-300 transform"
          >
            <GrLogout className="w-5 h-5" />

            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
