import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { DueCollection, CreateDueCollectionInput } from "../types";

export const dueCollectionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDueCollections: builder.query<{ data: DueCollection[] }, void>({
      query: () => "/due-collections",
      transformResponse: (res: unknown) =>
        normalizeResponse<DueCollection>(res),
      providesTags: ["DueCollection"],
    }),
    getDueCollectionById: builder.query<{ data: DueCollection }, string>({
      query: (id) => `/due-collections/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<DueCollection>(res),
      providesTags: (_result, _error, id) => [{ type: "DueCollection", id }],
    }),
    getCollectionsByCustomer: builder.query<{ data: DueCollection[] }, string>({
      query: (customerId) => `/due-collections/customer/${customerId}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<DueCollection>(res),
      providesTags: ["DueCollection"],
    }),
    createDueCollection: builder.mutation<
      { data: DueCollection },
      CreateDueCollectionInput
    >({
      query: (data) => ({
        url: "/due-collections",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DueCollection", "Customer", "Sales"],
    }),
  }),
});

export const {
  useGetDueCollectionsQuery,
  useGetDueCollectionByIdQuery,
  useGetCollectionsByCustomerQuery,
  useCreateDueCollectionMutation,
} = dueCollectionApi;
