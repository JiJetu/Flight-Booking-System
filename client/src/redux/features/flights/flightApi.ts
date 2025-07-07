import { baseApi } from "../../api/baseApi";

const flightApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFlights: builder.query({
      query: () => ({
        url: "/flights",
        method: "GET",
      }),
      providesTags: ["Flights"],
    }),
    getSingleFlight: builder.query({
      query: (id) => ({
        url: `/flights/${id}`,
        method: "GET",
      }),
      providesTags: ["Flights"],
    }),
    addFlight: builder.mutation({
      query: (flightData) => ({
        url: "/flights",
        method: "POST",
        body: flightData,
      }),
      invalidatesTags: ["Flights"],
    }),
    deleteFlight: builder.mutation({
      query: (id) => ({
        url: `/flights/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Flights"],
    }),
    updateFlight: builder.mutation({
      query: ({ id, flightData }) => ({
        url: `/flights/${id}`,
        method: "PATCH",
        body: flightData,
      }),
      invalidatesTags: ["Flights"],
    }),
  }),
});

export const {
  useGetAllFlightsQuery,
  useGetSingleFlightQuery,
  useAddFlightMutation,
  useDeleteFlightMutation,
  useUpdateFlightMutation,
} = flightApi;
