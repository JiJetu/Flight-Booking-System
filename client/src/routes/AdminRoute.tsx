import { useAppSelector } from "../redux/hooks";
import { currentUser } from "../redux/features/auth/authSlice";

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector(currentUser);
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
