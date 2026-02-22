import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { SalesReturn, CreateSalesReturnInput } from "../types";

export const salesReturnApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReturns: builder.query<{ data: SalesReturn[] }, void>({
      query: () => "/sales-returns",
      transformResponse: (res: unknown) =>
        normalizeResponse<SalesReturn>(res),
      providesTags: ["SalesReturn"],
    }),
    getSalesReturnById: builder.query<{ data: SalesReturn }, string>({
      query: (id) => `/sales-returns/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<SalesReturn>(res),
      providesTags: (_result, _error, id) => [{ type: "SalesReturn", id }],
    }),
    getReturnsBySale: builder.query<{ data: SalesReturn[] }, string>({
      query: (saleId) => `/sales-returns/sale/${saleId}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<SalesReturn>(res),
      providesTags: ["SalesReturn"],
    }),
    createSalesReturn: builder.mutation<
      { data: SalesReturn },
      CreateSalesReturnInput
    >({
      query: (data) => ({
        url: "/sales-returns",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SalesReturn", "Sales", "Product", "Customer"],
    }),
  }),
});

export const {
  useGetSalesReturnsQuery,
  useGetSalesReturnByIdQuery,
  useGetReturnsBySaleQuery,
  useCreateSalesReturnMutation,
} = salesReturnApi;
