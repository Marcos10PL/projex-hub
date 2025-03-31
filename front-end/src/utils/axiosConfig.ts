import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

API.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 || error.response?.status === 429) {
      const { default: store } = await import("../state/store"); 
      const { clearCurrentUser } = await import("../state/current-user/currentUserSlice");
      store.dispatch(clearCurrentUser()); 
    }
    return Promise.reject(error);
  }
);


export default API;
