import { BiSun } from "react-icons/bi";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import useTheme, { themItem } from "../../../hooks/useTheme";
import { BsMoonStarsFill } from "react-icons/bs";
import ProfileDropDown from "./ProfileDropDown";

const Navbar = () => {
  const { handleMode, mode } = useTheme();
  const navItems = (
    <>
      <li>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "p-2 border-b border-b-purple-600 text-purple-500"
              : "p-2"
          }
          to={"/"}
        >
          Home
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="bg-base-100 shadow-lg dark:bg-black dark:border-b dark:border-b-purple-600 dark:rounded-lg">
      <div className="navbar container mx-auto md:px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {navItems}
            </ul>
          </div>
          <Link
            className="flex items-center gap-2 text-xl text-purple-600 dark:text-purple-400 font-mono"
            to={"/"}
          >
            <MdOutlineFlightTakeoff /> Flights
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>
        <div className="navbar-end flex items-center gap-3 md:gap-5">
          <button
            onClick={handleMode}
            className="text-purple-800 dark:text-white mr-2 dark:mr-0"
          >
            {mode === themItem.Dark ? (
              <BiSun size={25} />
            ) : (
              <BsMoonStarsFill size={20} />
            )}
          </button>

          <ProfileDropDown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
