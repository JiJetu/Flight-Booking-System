import { BsFillHouseAddFill } from "react-icons/bs";
import MenuItem from "./MenuItem";
import { MdHomeWork, MdOutlineManageHistory } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={FaUserCog} label="Manage Users" address="manage-users" />
      <MenuItem
        icon={BsFillHouseAddFill}
        label="Add Flight"
        address="add-room"
      />
      <MenuItem icon={MdHomeWork} label="My Listings" address="my-listings" />
      <MenuItem
        icon={MdOutlineManageHistory}
        label="Manage Bookings"
        address="manage-bookings"
      />
    </>
  );
};

export default AdminMenu;
