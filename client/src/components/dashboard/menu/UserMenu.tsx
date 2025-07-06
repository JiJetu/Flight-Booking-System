import { BsFingerprint } from "react-icons/bs";
import MenuItem from "./MenuItem";

const UserMenu = () => {
  return (
    <MenuItem icon={BsFingerprint} label="My Bookings" address="my-bookings" />
  );
};

export default UserMenu;
