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
      const publicEndpoints = ["/api/restaurants"];
      const isPublicEndpoint = publicEndpoints.some((endpoint) => 
        config.url?.includes(endpoint) && config.method?.toLowerCase() === "get"
      );

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
