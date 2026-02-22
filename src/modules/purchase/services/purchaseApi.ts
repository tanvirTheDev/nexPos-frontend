import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { Purchase, CreatePurchaseInput, UpdatePurchaseInput } from "../types";

export const purchaseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPurchases: builder.query<{ data: Purchase[] }, void>({
      query: () => "/purchases",
      transformResponse: (res: unknown) =>
        normalizeResponse<Purchase>(res),
      providesTags: ["Purchase"],
    }),
    getPurchaseById: builder.query<{ data: Purchase }, string>({
      query: (id) => `/purchases/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Purchase>(res),
      providesTags: (_result, _error, id) => [{ type: "Purchase", id }],
    }),
    getPurchasesBySupplier: builder.query<{ data: Purchase[] }, string>({
      query: (supplierId) => `/purchases/supplier/${supplierId}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<Purchase>(res),
      providesTags: ["Purchase"],
    }),
    getPurchaseByInvoice: builder.query<{ data: Purchase }, string>({
      query: (invoice) => `/purchases/invoice/${invoice}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Purchase>(res),
      providesTags: ["Purchase"],
    }),
    createPurchase: builder.mutation<{ data: Purchase }, CreatePurchaseInput>({
      query: (data) => ({
        url: "/purchases",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Purchase", "Product", "Supplier"],
    }),
    updatePurchase: builder.mutation<
      { data: Purchase },
      { id: string; data: UpdatePurchaseInput }
    >({
      query: ({ id, data }) => ({
        url: `/purchases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Purchase", id },
        "Purchase",
        "Supplier",
      ],
    }),
    deletePurchase: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/purchases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase", "Product", "Supplier"],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useGetPurchasesBySupplierQuery,
  useGetPurchaseByInvoiceQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
