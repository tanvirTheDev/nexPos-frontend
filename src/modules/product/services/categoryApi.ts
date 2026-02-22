import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { Category, CreateCategoryInput } from "../types";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{ data: Category[] }, void>({
      query: () => "/categories",
      transformResponse: (res: unknown) =>
        normalizeResponse<Category>(res),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<{ data: Category }, string>({
      query: (id) => `/categories/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Category>(res),
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<{ data: Category }, CreateCategoryInput>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      { data: Category },
      { id: string; data: Partial<CreateCategoryInput> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
