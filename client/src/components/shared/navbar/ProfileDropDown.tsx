import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { currentUser, logout } from "../../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../../redux/features/auth/authApi";
import avatarImg from "../../../assets/images/placeholder.jpg";

const ProfileDropDown = () => {
  const user = useAppSelector(currentUser);
  const dispatch = useAppDispatch();
  const [logoutUser, { data, error }] = useLogoutMutation();

  console.log(data, error);

  const handleLogout = async () => {
    dispatch(logout());

    await logoutUser(undefined);
  };

  const ProfileDropDownItems = (
    <>
      <li>
        <Link to={"/profile"}>Profile</Link>
      </li>
      <li>
        <Link to={`/dashboard/${user?.role}`}>Dashboard</Link>
      </li>

      <li className="mt-2 font-bold">
        <button onClick={handleLogout}>Logout</button>
      </li>
    </>
  );
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="User image"
            referrerPolicy="no-referrer"
            src={user && user.image ? user.image : avatarImg}
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        {ProfileDropDownItems}
      </ul>
    </div>
  );
};

export default ProfileDropDown;
