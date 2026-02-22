import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { Organization, CreateOrganizationInput } from "../types";

export const organizationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<{ data: Organization[] }, void>({
      query: () => "/organizations",
      transformResponse: (res: unknown) =>
        normalizeResponse<Organization>(res),
      providesTags: ["Organization"],
    }),
    getOrganizationById: builder.query<{ data: Organization }, string>({
      query: (id) => `/organizations/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Organization>(res),
      providesTags: (_result, _error, id) => [{ type: "Organization", id }],
    }),
    createOrganization: builder.mutation<
      { data: Organization },
      CreateOrganizationInput
    >({
      query: (data) => ({
        url: "/organizations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),
    updateOrganization: builder.mutation<
      { data: Organization },
      { id: string; data: Partial<CreateOrganizationInput> }
    >({
      query: ({ id, data }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Organization", id },
        "Organization",
      ],
    }),
    deleteOrganization: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;
