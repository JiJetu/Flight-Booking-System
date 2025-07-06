import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Registration from "../pages/auth/Registration";
import AllFlights from "../pages/allFlights/AllFlights";
import ProtectedRoute from "./ProtectedRoute";
import FlightDetails from "../pages/flightDetails/FlightDetails";
import BookingConfirm from "../pages/bookingConfirm/BookingConfirm";
import DashboardLayout from "../layout/DashboardLayout";
import Statistics from "../pages/dashboard/statistics/Statistics";
import AddFlight from "../pages/dashboard/admin/AddFlight";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/all-flights",
        element: <AllFlights />,
      },
      {
        path: "/flight/:id",
        element: <FlightDetails />,
      },
      {
        path: "/flight/booking-confirm",
        element: (
          <ProtectedRoute>
            <BookingConfirm />,
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Registration /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-flight",
        element: (
          <ProtectedRoute>
            <AddFlight />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
