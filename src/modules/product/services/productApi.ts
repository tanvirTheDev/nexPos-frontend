import { api } from "@store/api";
import { normalizeResponse, normalizeSingleResponse } from "@common/utils/normalize";
import type { Product, CreateProductInput } from "../types";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<{ data: Product[] }, void>({
      query: () => "/products",
      transformResponse: (res: unknown) =>
        normalizeResponse<Product>(res),
      providesTags: ["Product"],
    }),
    getProductById: builder.query<{ data: Product }, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (res: unknown) =>
        normalizeSingleResponse<Product>(res),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    searchProducts: builder.query<{ data: Product[] }, string>({
      query: (q) => `/products/search?q=${encodeURIComponent(q)}`,
      transformResponse: (res: unknown) =>
        normalizeResponse<Product>(res),
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<{ data: Product }, CreateProductInput>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<
      { data: Product },
      { id: string; data: Partial<CreateProductInput> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getLowStock: builder.query<{ data: Product[] }, void>({
      query: () => "/products/low-stock",
      transformResponse: (res: unknown) =>
        normalizeResponse<Product>(res),
      providesTags: ["Product"],
    }),
    updateStock: builder.mutation<
      { data: Product },
      { id: string; quantity: number; operation: "add" | "subtract" }
    >({
      query: ({ id, quantity, operation }) => ({
        url: `/products/${id}/stock`,
        method: "PUT",
        body: { quantity, operation },
      }),
      invalidatesTags: ["Product", "Stock"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetLowStockQuery,
  useUpdateStockMutation,
} = productApi;
