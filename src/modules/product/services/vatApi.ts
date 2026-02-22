import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { VAT, CreateVATInput } from "../types";

export const vatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVATs: builder.query<{ data: VAT[] }, void>({
      query: () => "/vat",
      transformResponse: (res: unknown) =>
        normalizeResponse<VAT>(res),
      providesTags: ["VAT"],
    }),
    getVATById: builder.query<{ data: VAT }, string>({
      query: (id) => `/vat/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<VAT>(res),
      providesTags: (_result, _error, id) => [{ type: "VAT", id }],
    }),
    createVAT: builder.mutation<{ data: VAT }, CreateVATInput>({
      query: (data) => ({
        url: "/vat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VAT"],
    }),
    updateVAT: builder.mutation<
      { data: VAT },
      { id: string; data: Partial<CreateVATInput> }
    >({
      query: ({ id, data }) => ({
        url: `/vat/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "VAT", id },
        "VAT",
      ],
    }),
    deleteVAT: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/vat/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VAT"],
    }),
  }),
});

export const {
  useGetVATsQuery,
  useGetVATByIdQuery,
  useCreateVATMutation,
  useUpdateVATMutation,
  useDeleteVATMutation,
} = vatApi;
