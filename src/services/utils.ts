import { Api } from "./api";
import type { AuthResponse, Restaurant, User } from "./api_types";

/**
 * Find a restaurant owned by a specific user
 */
export function findRestaurantByOwner(
  restaurants: Restaurant[],
  userId: string | undefined
): Restaurant | null {
  if (!userId || !restaurants.length) return null;
  return restaurants.find((r) => r.ownerId === userId) || null;
}

/**
 * Get username from User object or fallback to localStorage
 */
export function getUsername(user: User | undefined): string {
  if (user) {
    return `${user.firstName} ${user.lastName}`;
  }
  return localStorage.getItem("username") || "User";
}

/**
 * Get account type from localStorage
 */
export function getAccountType(): "restaurant" | "customer" {
  return (localStorage.getItem("accountType") as "restaurant" | "customer") || "customer";
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return !!Api.getToken();
}

/**
 * Handle user logout - clears all auth data and queries
 */
export function handleLogout(
  queryClient: { clear: () => void },
  navigate: (path: string) => void
): void {
  Api.logout();
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("accountType");
  localStorage.removeItem("pfp");
  queryClient.clear();
  navigate("/");
}

/**
 * Validate token before storing
 * Checks if token is non-empty, not just whitespace, and optionally validates JWT format
 */
export function validateToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return false;
  }

  // Basic JWT format validation (3 parts separated by dots)
  // This is optional but helps catch malformed tokens early
  const jwtParts = trimmedToken.split(".");
  if (jwtParts.length !== 3) {
    // Not a JWT, but might still be valid - log warning but allow
    console.warn("Token does not appear to be in JWT format");
  }

  return true;
}

/**
 * Store authentication data in localStorage after login/signup
 * Validates token before storing and throws error if token is missing or invalid
 */
export function storeAuthData(
  authResponse: AuthResponse,
  accountType?: "restaurant" | "customer"
): void {
  // Validate token before storing
  if (!validateToken(authResponse.token)) {
    const errorMessage = "Authentication failed: No valid token received from server";
    console.error(errorMessage, { authResponse });
    throw new Error(errorMessage);
  }

  // Store user data
  localStorage.setItem("username", `${authResponse.user.firstName} ${authResponse.user.lastName}`);
  localStorage.setItem("userId", authResponse.user.userId);

  // Trim and store the token to avoid whitespace issues
  // We know it's valid at this point due to validation above
  const trimmedToken = authResponse.token.trim();
  localStorage.setItem("token", trimmedToken);

  // Verify token was stored successfully (synchronous check)
  const storedToken = localStorage.getItem("token");
  if (!storedToken || storedToken !== trimmedToken) {
    const errorMessage = "Failed to store authentication token";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (accountType) {
    localStorage.setItem("accountType", accountType);
  }
}

/**
 * Get recently viewed restaurants (currently returns first N restaurants)
 * In a real app, this would track user browsing history
 */
export function getRecentlyViewedRestaurants(
  restaurants: Restaurant[],
  count: number = 3
): Restaurant[] {
  return restaurants.slice(0, count);
}

/**
 * Get recommended restaurants (currently returns next N restaurants)
 * In a real app, this would use a recommendation algorithm
 */
export function getRecommendedRestaurants(
  restaurants: Restaurant[],
  startIndex: number = 3,
  count: number = 3
): Restaurant[] {
  return restaurants.slice(startIndex, startIndex + count);
}

/**
 * Create image preview URL from file input
 */
export function createImagePreviewUrl(file: File | null | undefined): string | null {
  if (!file) return null;
  return URL.createObjectURL(file);
}

/**
 * Validate dish form data
 */
export interface DishFormData {
  name: string;
  price: string;
  description?: string;
}

export interface DishValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateDishForm(dish: DishFormData): DishValidationResult {
  if (!dish.name || !dish.name.trim()) {
    return {
      isValid: false,
      error: "Dish name is required.",
    };
  }

  if (!dish.price || !dish.price.trim()) {
    return {
      isValid: false,
      error: "Dish price is required.",
    };
  }

  const price = parseFloat(dish.price);
  if (isNaN(price) || price <= 0) {
    return {
      isValid: false,
      error: "Please enter a valid price (greater than 0).",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Format price for display
 * Handles both number and string inputs
 */
export function formatPrice(price: number | string): string {
  // Convert to number if it's a string
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  
  // Check if it's a valid number
  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return "$0.00";
  }
  
  return `$${numPrice.toFixed(2)}`;
}

/**
 * Initialize restaurant form data from restaurant and user objects
 */
export interface RestaurantFormData {
  restaurantName: string;
  address: string;
  email: string;
}

export function initializeRestaurantForm(
  restaurant: Restaurant | null,
  user: User | undefined
): RestaurantFormData {
  return {
    restaurantName: restaurant?.name || "",
    address: restaurant?.address || "",
    email: user?.email || "",
  };
}

/**
 * Get greeting text based on account type
 */
export function getGreeting(accountType: "restaurant" | "customer"): string {
  return accountType === "restaurant" ? "Hello Restaurant Owner!" : "Hello Customer!";
}

/**
 * Get greeting phrase based on account type
 */
export function getGreetingPhrase(accountType: "restaurant" | "customer"): string {
  return accountType === "restaurant"
    ? "Your customers are ready to order"
    : "What would you like to order?";
}

/**
 * Check if loading state should be shown
 */
export function isLoading(...loadingStates: boolean[]): boolean {
  return loadingStates.some((state) => state === true);
}

/**
 * Handle authentication error and return user-friendly message
 */
export function handleAuthError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }

    if (axiosError.response && "statusText" in axiosError.response) {
      const statusText = (axiosError.response as { statusText?: string }).statusText;
      const status = (axiosError.response as { status?: number }).status;
      return statusText || `Error ${status}: Please check your input and try again.`;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}
