import { baseApi } from "../../api/baseApi";

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bookAFlight: builder.mutation({
      query: (bookingInfo) => ({
        url: "/bookings",
        method: "POST",
        body: bookingInfo,
      }),
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: `/flights`,
        method: "GET",
      }),
    }),
  }),
});

export const { useBookAFlightMutation, useGetMyBookingsQuery } = bookingApi;
