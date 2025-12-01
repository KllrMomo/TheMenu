import axios from "axios";

function createApi(baseURL: string) {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      // Don't send token for public endpoints that don't require authentication
      // Only match exact endpoint - /api/restaurants (list all restaurants)
      // NOT /api/restaurants/me or /api/restaurants/:id which require auth
      // Check if URL exactly matches /api/restaurants (may have query params)
      const urlPath = config.url?.split("?")[0]; // Remove query params for comparison
      const isPublicEndpoint =
        urlPath === "/api/restaurants" && config.method?.toLowerCase() === "get";

      // Add authentication token if available and endpoint is not public
      if (!isPublicEndpoint) {
        const token = localStorage.getItem("token");
        if (token) {
          // Trim any whitespace from the token
          const trimmedToken = token.trim();
          if (trimmedToken) {
            config.headers.Authorization = `Bearer ${trimmedToken}`;
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
}

const api = createApi(import.meta.env.VITE_BASE_API_URL ?? "");
export default api;
