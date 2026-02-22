import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { Customer, CreateCustomerInput, UpdateBalanceInput } from "../types";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<{ data: Customer[] }, void>({
      query: () => "/customers",
      transformResponse: (res: unknown) =>
        normalizeResponse<Customer>(res),
      providesTags: ["Customer"],
    }),
    getCustomerById: builder.query<{ data: Customer }, string>({
      query: (id) => `/customers/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Customer>(res),
      providesTags: (_result, _error, id) => [{ type: "Customer", id }],
    }),
    searchCustomers: builder.query<{ data: Customer[] }, string>({
      query: (q) => `/customers/search?q=${encodeURIComponent(q)}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<Customer>(res),
      providesTags: ["Customer"],
    }),
    getCustomersWithDue: builder.query<{ data: Customer[] }, void>({
      query: () => "/customers/with-due",
      transformResponse: (res: unknown) =>
        normalizeResponse<Customer>(res),
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation<{ data: Customer }, CreateCustomerInput>({
      query: (data) => ({
        url: "/customers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<
      { data: Customer },
      { id: string; data: Partial<CreateCustomerInput> }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customer", id },
        "Customer",
      ],
    }),
    updateCustomerBalance: builder.mutation<
      { data: Customer },
      { id: string; data: UpdateBalanceInput }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}/balance`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customer", id },
        "Customer",
      ],
    }),
    deleteCustomer: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useSearchCustomersQuery,
  useGetCustomersWithDueQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useUpdateCustomerBalanceMutation,
  useDeleteCustomerMutation,
} = customerApi;
