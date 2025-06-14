import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { clearCurrentUser } from "../state/current-user/currentUserSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "/api",
  credentials: "include",
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const originalUrl = typeof args === "string" ? args : args.url;

    const isLoginAttempt = originalUrl?.includes("auth/login");

    if (status === 401 && !isLoginAttempt) {
      api.dispatch(clearCurrentUser("Session expired. Please log in again."));
    }

    if (status === "FETCH_ERROR") {
      api.dispatch(
        clearCurrentUser(
          "Network Error. Probably too many requests. Try again later."
        )
      );
    }
  }

  return result;
};

export default baseQueryWithErrorHandling;
