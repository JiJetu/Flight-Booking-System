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
import MyBookings from "../pages/dashboard/user/MyBookings";
import AdminRoute from "./AdminRoute";
import ManageBookings from "../pages/dashboard/admin/ManageBookings";
import MyListings from "../pages/dashboard/admin/MyListings";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import Profile from "../pages/dashboard/profile/Profile";

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
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-flight",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AddFlight />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-flights",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <MyListings />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-bookings",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <ManageBookings />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
