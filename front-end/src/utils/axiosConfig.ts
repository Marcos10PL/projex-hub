import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

API.interceptors.response.use(
  response => response,
  async error => {
    if (
      error.response?.status === 401 ||
      error.message.includes("Network Error")
    ) {
      const { default: store } = await import("../state/store");
      const { clearCurrentUser } = await import(
        "../state/current-user/currentUserSlice"
      );

      if (error.message.includes("Network Error")) {
        store.dispatch(
          clearCurrentUser(
            "Network Error. Probably too many requests. Try again later."
          )
        );
      } else {
        store.dispatch(
          clearCurrentUser("Session expired. Please log in again.")
        );
      }
    }
    return Promise.reject(error);
  }
);

export default API;
