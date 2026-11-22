// One Axios instance used everywhere to talk to our backend.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Before every request: attach the saved token so the server knows who we are.
api.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  } catch {
    // ignore broken saved data
  }
  return config;
});

// If the token is rejected (expired), clear it and go to the login page.
// Login/register errors are skipped, because wrong passwords also return 401.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith("/auth");
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Turn any error into a message we can show on screen.
export const getErrorMessage = (error) =>
  error.response?.data?.message ||
  (error.request ? "Cannot reach the server. Is it running?" : "Something went wrong");

export default api;
