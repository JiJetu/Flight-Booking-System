import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TLocalFlight = {
  flightId: string;
  airline: string;
  dateTime: string;
  destination: string;
  totalPrice: number;
  numberOfSeats: number;
};

type TBookingState = {
  flight: null | TLocalFlight;
};

const initialState: TBookingState = {
  flight: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      const {
        flightId,
        destination,
        dateTime,
        airline,
        numberOfSeats,
        totalPrice,
      } = action.payload;
      state.flight = {
        flightId,
        destination,
        airline,
        dateTime,
        numberOfSeats,
        totalPrice,
      };
    },

    removeBooking: (state) => {
      state.flight = null;
    },
  },
});

export const { addBooking, removeBooking } = bookingSlice.actions;

export const currentFlightBooking = (state: RootState) => state.booking.flight;

export default bookingSlice.reducer;
