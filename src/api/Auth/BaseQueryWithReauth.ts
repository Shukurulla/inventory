import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "https://invenmaster.pythonanywhere.com",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/api/token/refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { access } = refreshResult.data as TokenRefreshResponse;
        localStorage.setItem("accessToken", access);

        result = await baseQuery(args, api, extraOptions);
      } else {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }

  return result;
};

function handleLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // window.location.href = "/login";
}
