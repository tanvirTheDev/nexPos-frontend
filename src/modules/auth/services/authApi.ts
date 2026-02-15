import { api } from "@store/api";
import type { LoginRequest, LoginResponse } from "../types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: (refreshToken: string) => ({
        url: "/auth/logout",
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;
