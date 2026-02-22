import { api } from "@store/api";
import type { ProductStock, StockMovement, StockValuation } from "../types";

export const stockApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentStock: builder.query<{ data: ProductStock[] }, void>({
      query: () => "/stock/current",
      providesTags: ["Stock"],
    }),
    getLowStockProducts: builder.query<{ data: ProductStock[] }, void>({
      query: () => "/stock/low-stock",
      providesTags: ["Stock"],
    }),
    getStockValuation: builder.query<{ data: StockValuation }, void>({
      query: () => "/stock/valuation",
      providesTags: ["Stock"],
    }),
    getStockMovements: builder.query<
      { data: StockMovement[] },
      { productId?: string; type?: string; startDate?: string; endDate?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.productId) searchParams.set("productId", params.productId);
        if (params.type) searchParams.set("type", params.type);
        if (params.startDate) searchParams.set("startDate", params.startDate);
        if (params.endDate) searchParams.set("endDate", params.endDate);
        const qs = searchParams.toString();
        return `/stock/movements${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Stock"],
    }),
  }),
});

export const {
  useGetCurrentStockQuery,
  useGetLowStockProductsQuery,
  useGetStockValuationQuery,
  useGetStockMovementsQuery,
} = stockApi;
