import { api } from "@store/api";
import { normalizeResponse } from "@common/utils/normalize";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/reports/dashboard",
      providesTags: ["Reports"],
    }),
    getRecentSales: builder.query({
      query: () => "/sales?limit=5&sort=-createdAt",
      transformResponse: (res: unknown) =>
        normalizeResponse(res),
      providesTags: ["Sales"],
    }),
    getLowStock: builder.query({
      query: () => "/products/low-stock",
      transformResponse: (res: unknown) =>
        normalizeResponse(res),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentSalesQuery,
  useGetLowStockQuery,
} = dashboardApi;
