import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { PurchaseReturn, CreatePurchaseReturnInput } from "../types";

export const purchaseReturnApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseReturns: builder.query<{ data: PurchaseReturn[] }, void>({
      query: () => "/purchase-returns",
      transformResponse: (res: unknown) =>
        normalizeResponse<PurchaseReturn>(res),
      providesTags: ["PurchaseReturn"],
    }),
    getPurchaseReturnById: builder.query<{ data: PurchaseReturn }, string>({
      query: (id) => `/purchase-returns/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<PurchaseReturn>(res),
      providesTags: (_result, _error, id) => [{ type: "PurchaseReturn", id }],
    }),
    getReturnsByPurchase: builder.query<{ data: PurchaseReturn[] }, string>({
      query: (purchaseId) => `/purchase-returns/purchase/${purchaseId}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<PurchaseReturn>(res),
      providesTags: ["PurchaseReturn"],
    }),
    createPurchaseReturn: builder.mutation<
      { data: PurchaseReturn },
      CreatePurchaseReturnInput
    >({
      query: (data) => ({
        url: "/purchase-returns",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PurchaseReturn", "Purchase", "Product", "Supplier"],
    }),
  }),
});

export const {
  useGetPurchaseReturnsQuery,
  useGetPurchaseReturnByIdQuery,
  useGetReturnsByPurchaseQuery,
  useCreatePurchaseReturnMutation,
} = purchaseReturnApi;
