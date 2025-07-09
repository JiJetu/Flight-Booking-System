import { baseApi } from "../../api/baseApi";

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBookings: builder.query({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `/bookings/user/${id}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Bookings"],
    }),
    getAllBookings: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/bookings`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Bookings"],
    }),
    bookAFlight: builder.mutation({
      query: (bookingInfo) => ({
        url: "/bookings",
        method: "POST",
        body: bookingInfo,
      }),
      invalidatesTags: ["Bookings", "Flights"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/bookings/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Bookings", "Flights"],
    }),
    deleteBookingS: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookings", "Flights"],
    }),
  }),
});

export const {
  useBookAFlightMutation,
  useGetMyBookingsQuery,
  useGetAllBookingsQuery,
  useDeleteBookingSMutation,
  useUpdateBookingStatusMutation,
} = bookingApi;
