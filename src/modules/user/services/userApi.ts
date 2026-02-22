import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type {
  UserRecord,
  CreateOrgAdminInput,
  CreateAdminInput,
  UpdateUserInput,
  AssignPermissionsInput,
} from "../types";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ data: UserRecord[] }, void>({
      query: () => "/users",
      transformResponse: (res: unknown) =>
        normalizeResponse<UserRecord>(res),
      providesTags: ["User"],
    }),
    getUserById: builder.query<{ data: UserRecord }, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<UserRecord>(res),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    createOrgAdmin: builder.mutation<{ data: UserRecord }, CreateOrgAdminInput>({
      query: (data) => ({
        url: "/users/org-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    createAdmin: builder.mutation<{ data: UserRecord }, CreateAdminInput>({
      query: (data) => ({
        url: "/users/admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<
      { data: UserRecord },
      { id: string; data: UpdateUserInput }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    assignPermissions: builder.mutation<
      { data: UserRecord },
      { id: string; data: AssignPermissionsInput }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}/permissions`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),
    getUserPermissions: builder.query<
      { data: { permissions: string[] } },
      string
    >({
      query: (id) => `/users/${id}/permissions`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateOrgAdminMutation,
  useCreateAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignPermissionsMutation,
  useGetUserPermissionsQuery,
} = userApi;
