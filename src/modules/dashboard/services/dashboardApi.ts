import { api } from "@store/api";
import { normalizeResponse } from "@common/utils/normalize";

interface RecentSale {
  id: string;
  invoiceNumber: string;
  customerId?: { name: string };
  totalAmount: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  saleDate: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/reports/dashboard",
      providesTags: ["Reports"],
    }),
    getRecentSales: builder.query<{ data: RecentSale[] }, void>({
      query: () => "/sales?limit=5&sort=-createdAt",
      transformResponse: (res: unknown) =>
        normalizeResponse<RecentSale>(res),
      providesTags: ["Sales"],
    }),
    getLowStock: builder.query<{ data: LowStockProduct[] }, void>({
      query: () => "/products/low-stock",
      transformResponse: (res: unknown) =>
        normalizeResponse<LowStockProduct>(res),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentSalesQuery,
  useGetLowStockQuery,
} = dashboardApi;
