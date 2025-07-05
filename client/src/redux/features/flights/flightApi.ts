import { baseApi } from "../../api/baseApi";

const flightApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFlights: builder.query({
      query: () => ({
        url: "/flights",
        method: "GET",
      }),
    }),
    getSingleFlight: builder.query({
      query: (id) => ({
        url: `/flights/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllFlightsQuery, useGetSingleFlightQuery } = flightApi;
