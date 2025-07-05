import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Registration from "../pages/auth/Registration";
import AllFlights from "../pages/allFlights/AllFlights";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import FlightDetails from "../pages/flightDetails/FlightDetails";
import BookingConfirm from "../pages/bookingConfirm/BookingConfirm";

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
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Registration />,
  },
]);

export default router;
