import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { Supplier, CreateSupplierInput, UpdateBalanceInput } from "../types";

export const supplierApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<{ data: Supplier[] }, void>({
      query: () => "/suppliers",
      transformResponse: (res: unknown) =>
        normalizeResponse<Supplier>(res),
      providesTags: ["Supplier"],
    }),
    getSupplierById: builder.query<{ data: Supplier }, string>({
      query: (id) => `/suppliers/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Supplier>(res),
      providesTags: (_result, _error, id) => [{ type: "Supplier", id }],
    }),
    searchSuppliers: builder.query<{ data: Supplier[] }, string>({
      query: (q) => `/suppliers/search?q=${encodeURIComponent(q)}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<Supplier>(res),
      providesTags: ["Supplier"],
    }),
    getSuppliersWithDue: builder.query<{ data: Supplier[] }, void>({
      query: () => "/suppliers/with-due",
      transformResponse: (res: unknown) =>
        normalizeResponse<Supplier>(res),
      providesTags: ["Supplier"],
    }),
    createSupplier: builder.mutation<{ data: Supplier }, CreateSupplierInput>({
      query: (data) => ({
        url: "/suppliers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),
    updateSupplier: builder.mutation<
      { data: Supplier },
      { id: string; data: Partial<CreateSupplierInput> }
    >({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Supplier", id },
        "Supplier",
      ],
    }),
    updateSupplierBalance: builder.mutation<
      { data: Supplier },
      { id: string; data: UpdateBalanceInput }
    >({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}/balance`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Supplier", id },
        "Supplier",
      ],
    }),
    deleteSupplier: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useSearchSuppliersQuery,
  useGetSuppliersWithDueQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useUpdateSupplierBalanceMutation,
  useDeleteSupplierMutation,
} = supplierApi;
