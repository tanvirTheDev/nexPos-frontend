import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: any,
  apiObj: any,
  extraOptions: any,
) => {
  let result = await baseQuery(args, apiObj, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (apiObj.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        apiObj,
        extraOptions,
      );

      if (refreshResult.data) {
        apiObj.dispatch({
          type: "auth/setCredentials",
          payload: refreshResult.data,
        });
        result = await baseQuery(args, apiObj, extraOptions);
      } else {
        apiObj.dispatch({ type: "auth/logout" });
        window.location.href = "/login";
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Organization",
    "Product",
    "Category",
    "Unit",
    "VAT",
    "Customer",
    "Supplier",
    "Purchase",
    "Sales",
    "PurchaseReturn",
    "SalesReturn",
    "DueCollection",
    "SupplierPayment",
    "Stock",
    "Reports",
  ],
  endpoints: () => ({}),
});
