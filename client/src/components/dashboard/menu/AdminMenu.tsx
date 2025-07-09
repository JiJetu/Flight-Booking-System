import MenuItem from "./MenuItem";
import { MdOutlineFlight, MdOutlineManageHistory } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { PiSquareHalfLight } from "react-icons/pi";

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={FaUserCog} label="Manage Users" address="manage-users" />
      <MenuItem
        icon={MdOutlineFlight}
        label="Add Flight"
        address="add-flight"
      />
      <MenuItem
        icon={PiSquareHalfLight}
        label="My Listings"
        address="manage-flights"
      />
      <MenuItem
        icon={MdOutlineManageHistory}
        label="Manage Bookings"
        address="manage-bookings"
      />
    </>
  );
};

export default AdminMenu;
