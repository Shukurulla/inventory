import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";

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

  // Check if we got 401 error (token expired)
  if (result.error && result.error.status === 401) {
    console.log("Token expired, attempting refresh...");

    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      // Try to refresh the token
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

        // Store new access token
        localStorage.setItem("accessToken", access);
        console.log("Token refreshed successfully");

        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Refresh token failed, redirecting to login");
        handleLogout();
      }
    } else {
      console.log("No refresh token available, redirecting to login");
      handleLogout();
    }
  }

  return result;
};

function handleLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.setItem("active_nav", "Главная страница");

  toast.error("Сессия истекла. Пожалуйста, войдите снова.");

  // Redirect to login page
  window.location.href = "/login";
}
