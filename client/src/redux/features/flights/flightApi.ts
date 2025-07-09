import { TFlight } from "../../../type";
import { baseApi } from "../../api/baseApi";

const flightApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFlights: builder.query<
      { total: number; flights: TFlight[] },
      { page?: number; limit?: number; availableFlights?: boolean }
    >({
      query: ({ page = 1, limit = 6, availableFlights = true } = {}) => ({
        url: `/flights?page=${page}&limit=${limit}&availableFlights=${availableFlights}`,
        method: "GET",
      }),
      providesTags: ["Flights"],
    }),
    getSearchFlights: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return {
          url: `/flights/search?${query}`,
          method: "GET",
        };
      },
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
        method: "PUT",
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
  useGetSearchFlightsQuery,
  useLazyGetSearchFlightsQuery,
} = flightApi;
