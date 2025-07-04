import { ReactNode } from "react";
import { useAppSelector } from "../../redux/hooks";
import { currentUserToken } from "../../redux/features/auth/authSlice";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const token = useAppSelector(currentUserToken);

  if (!token) {
    return <Navigate to={"/login"} state={location?.pathname} replace />;
  }

  return children;
};

export default ProtectedRoute;
