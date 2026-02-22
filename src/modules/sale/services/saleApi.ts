import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { Sale, CreateSaleInput, UpdateSaleInput } from "../types";

export const saleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<{ data: Sale[] }, void>({
      query: () => "/sales",
      transformResponse: (res: unknown) =>
        normalizeResponse<Sale>(res),
      providesTags: ["Sales"],
    }),
    getSaleById: builder.query<{ data: Sale }, string>({
      query: (id) => `/sales/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Sale>(res),
      providesTags: (_result, _error, id) => [{ type: "Sales", id }],
    }),
    getSalesByCustomer: builder.query<{ data: Sale[] }, string>({
      query: (customerId) => `/sales/customer/${customerId}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<Sale>(res),
      providesTags: ["Sales"],
    }),
    getSaleByInvoice: builder.query<{ data: Sale }, string>({
      query: (invoice) => `/sales/invoice/${invoice}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Sale>(res),
      providesTags: ["Sales"],
    }),
    createSale: builder.mutation<{ data: Sale }, CreateSaleInput>({
      query: (data) => ({
        url: "/sales",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sales", "Product", "Customer"],
    }),
    updateSale: builder.mutation<
      { data: Sale },
      { id: string; data: UpdateSaleInput }
    >({
      query: ({ id, data }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Sales", id },
        "Sales",
        "Customer",
      ],
    }),
    deleteSale: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales", "Product", "Customer"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetSaleByIdQuery,
  useGetSalesByCustomerQuery,
  useGetSaleByInvoiceQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} = saleApi;
