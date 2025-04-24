import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

API.interceptors.response.use(
  response => response,
  async error => {
    const isLoginAttempt = error.config?.url?.includes("auth/login");

    if (error.response?.status === 401 && !isLoginAttempt) {
      const { default: store } = await import("../state/store");
      const { clearCurrentUser } = await import(
        "../state/current-user/currentUserSlice"
      );

      store.dispatch(clearCurrentUser("Session expired. Please log in again."));
    }

    if (error.message.includes("Network Error")) {
      const { default: store } = await import("../state/store");
      const { clearCurrentUser } = await import(
        "../state/current-user/currentUserSlice"
      );

      store.dispatch(
        clearCurrentUser(
          "Network Error. Probably too many requests. Try again later."
        )
      );
    }

    return Promise.reject(error);
  }
);

export default API;
