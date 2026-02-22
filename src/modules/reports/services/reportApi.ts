import { api } from "@store/api";
import type {
  SalesReport,
  PurchaseReport,
  ProfitLossReport,
  CustomerReport,
  SupplierReport,
  DateRangeParams,
} from "../types";

export const reportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query<{ data: SalesReport }, DateRangeParams>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params.startDate) sp.set("startDate", params.startDate);
        if (params.endDate) sp.set("endDate", params.endDate);
        const qs = sp.toString();
        return `/reports/sales${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Reports"],
    }),
    getPurchaseReport: builder.query<{ data: PurchaseReport }, DateRangeParams>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params.startDate) sp.set("startDate", params.startDate);
        if (params.endDate) sp.set("endDate", params.endDate);
        const qs = sp.toString();
        return `/reports/purchases${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Reports"],
    }),
    getProfitLossReport: builder.query<{ data: ProfitLossReport }, DateRangeParams>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params.startDate) sp.set("startDate", params.startDate);
        if (params.endDate) sp.set("endDate", params.endDate);
        const qs = sp.toString();
        return `/reports/profit-loss${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Reports"],
    }),
    getCustomerReport: builder.query<{ data: CustomerReport }, void>({
      query: () => "/reports/customers",
      providesTags: ["Reports"],
    }),
    getSupplierReport: builder.query<{ data: SupplierReport }, void>({
      query: () => "/reports/suppliers",
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useGetPurchaseReportQuery,
  useGetProfitLossReportQuery,
  useGetCustomerReportQuery,
  useGetSupplierReportQuery,
} = reportApi;
