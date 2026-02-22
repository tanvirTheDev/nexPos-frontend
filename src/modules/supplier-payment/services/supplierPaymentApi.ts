import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { SupplierPayment, CreateSupplierPaymentInput } from "../types";

export const supplierPaymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierPayments: builder.query<{ data: SupplierPayment[] }, void>({
      query: () => "/supplier-payments",
      transformResponse: (res: unknown) =>
        normalizeResponse<SupplierPayment>(res),
      providesTags: ["SupplierPayment"],
    }),
    getSupplierPaymentById: builder.query<{ data: SupplierPayment }, string>({
      query: (id) => `/supplier-payments/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<SupplierPayment>(res),
      providesTags: (_result, _error, id) => [{ type: "SupplierPayment", id }],
    }),
    getPaymentsBySupplier: builder.query<{ data: SupplierPayment[] }, string>({
      query: (supplierId) => `/supplier-payments/supplier/${supplierId}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<SupplierPayment>(res),
      providesTags: ["SupplierPayment"],
    }),
    createSupplierPayment: builder.mutation<
      { data: SupplierPayment },
      CreateSupplierPaymentInput
    >({
      query: (data) => ({
        url: "/supplier-payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SupplierPayment", "Supplier", "Purchase"],
    }),
  }),
});

export const {
  useGetSupplierPaymentsQuery,
  useGetSupplierPaymentByIdQuery,
  useGetPaymentsBySupplierQuery,
  useCreateSupplierPaymentMutation,
} = supplierPaymentApi;
