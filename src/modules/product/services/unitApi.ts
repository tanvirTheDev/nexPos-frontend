import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { Unit, CreateUnitInput } from "../types";

export const unitApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUnits: builder.query<{ data: Unit[] }, void>({
      query: () => "/units",
      transformResponse: (res: unknown) =>
        normalizeResponse<Unit>(res),
      providesTags: ["Unit"],
    }),
    getUnitById: builder.query<{ data: Unit }, string>({
      query: (id) => `/units/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Unit>(res),
      providesTags: (_result, _error, id) => [{ type: "Unit", id }],
    }),
    createUnit: builder.mutation<{ data: Unit }, CreateUnitInput>({
      query: (data) => ({
        url: "/units",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Unit"],
    }),
    updateUnit: builder.mutation<
      { data: Unit },
      { id: string; data: Partial<CreateUnitInput> }
    >({
      query: ({ id, data }) => ({
        url: `/units/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Unit", id },
        "Unit",
      ],
    }),
    deleteUnit: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Unit"],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
