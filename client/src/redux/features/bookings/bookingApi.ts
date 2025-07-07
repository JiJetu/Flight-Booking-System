import { baseApi } from "../../api/baseApi";

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => ({
        url: `/bookings`,
        method: "GET",
      }),
      providesTags: ["Bookings"],
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: `/flights`,
        method: "GET",
      }),
      providesTags: ["Bookings"],
    }),
    bookAFlight: builder.mutation({
      query: (bookingInfo) => ({
        url: "/bookings",
        method: "POST",
        body: bookingInfo,
      }),
      invalidatesTags: ["Bookings"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => {
        console.log(status);
        return { url: `/bookings/${id}`, method: "PUT", body: { status } };
      },
      invalidatesTags: ["Bookings"],
    }),
    deleteBookingS: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookings"],
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
