import type {
  AddCartItemRequest,
  AuthResponse,
  Cart,
  CartItem,
  CheckoutResponse,
  CreateFoodItemRequest,
  CreateRestaurantRequest,
  FoodItem,
  LoginRequest,
  RegisterRequest,
  Restaurant,
  UpdateCartItemRequest,
  UpdateFoodItemRequest,
  UpdateRestaurantRequest,
  UpdateUserRequest,
  User,
} from "./api_types";
import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export class Api {
  static async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const body: RegisterRequest = {
      firstName,
      lastName,
      email,
      password,
    };
    const response = await api.post<AuthResponse>(ENDPOINTS.REGISTER, body);
    
    // Validate that token exists in response
    if (!response.data.token) {
      const errorMessage = "Registration failed: No token received from server";
      console.error(errorMessage, { response: response.data });
      throw new Error(errorMessage);
    }

    // Token storage is handled by storeAuthData() in the calling component
    // This ensures proper validation and prevents race conditions
    return response.data;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const body: LoginRequest = {
      email,
      password,
    };
    const response = await api.post<AuthResponse>(ENDPOINTS.LOGIN, body);
    
    // Validate that token exists in response
    if (!response.data.token) {
      const errorMessage = "Login failed: No token received from server";
      console.error(errorMessage, { response: response.data });
      throw new Error(errorMessage);
    }

    // Token storage is handled by storeAuthData() in the calling component
    // This ensures proper validation and prevents race conditions
    return response.data;
  }

  static logout(): void {
    localStorage.removeItem("token");
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(ENDPOINTS.GET_ACCOUNT_INFO);
    return response.data;
  }

  static async updateUser(firstName?: string, lastName?: string, email?: string): Promise<User> {
    const body: UpdateUserRequest = {
      firstName,
      lastName,
      email,
    };
    const response = await api.patch<User>(ENDPOINTS.UPDATE_USER, body);
    return response.data;
  }

  static async listRestaurants(): Promise<Restaurant[]> {
    const response = await api.get<Restaurant[]>(ENDPOINTS.GET_RESTAURANTS);
    return response.data;
  }

  static async getRestaurantById(id: string): Promise<Restaurant> {
    const endpoint = ENDPOINTS.GET_RESTAURANT_INFO.replace(":id", id);
    const response = await api.get<Restaurant>(endpoint);
    return response.data;
  }

  static async createRestaurant(name: string, address: string): Promise<Restaurant> {
    const body: CreateRestaurantRequest = {
      name,
      address,
    };
    const response = await api.post<Restaurant>(ENDPOINTS.CREATE_RESTAURANT, body);
    return response.data;
  }

  static async updateRestaurant(id: string, name?: string, address?: string): Promise<Restaurant> {
    const body: UpdateRestaurantRequest = {
      name,
      address,
    };
    const endpoint = ENDPOINTS.UPDATE_RESTAURANT.replace(":id", id);
    const response = await api.patch<Restaurant>(endpoint, body);
    return response.data;
  }

  static async getRestaurantByOwner(): Promise<Restaurant | null> {
    try {
      const response = await api.get<Restaurant>(ENDPOINTS.GET_RESTAURANT_BY_OWNER);
      return response.data;
    } catch (error) {
      // Handle 404 as null (user doesn't have a restaurant yet)
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 404
      ) {
        return null;
      }
      throw error;
    }
  }

  static async listFoodItemsByRestaurant(restaurantId: string): Promise<FoodItem[]> {
    const endpoint = ENDPOINTS.GET_FOOD_ITEMS.replace(":restaurantId", restaurantId);
    const response = await api.get<FoodItem[]>(endpoint);
    return response.data;
  }

  static async getFoodItemById(id: string): Promise<FoodItem> {
    const endpoint = ENDPOINTS.GET_FOOD_ITEM_INFO.replace(":id", id);
    const response = await api.get<FoodItem>(endpoint);
    return response.data;
  }

  static async createFoodItem(
    restaurantId: string,
    name: string,
    price: number,
    inStock?: boolean
  ): Promise<FoodItem> {
    const body: CreateFoodItemRequest = {
      restaurantId,
      name,
      price,
      inStock,
    };
    const response = await api.post<FoodItem>(ENDPOINTS.CREATE_FOOD_ITEM, body);
    return response.data;
  }

  static async updateFoodItem(
    id: string,
    name?: string,
    price?: number,
    inStock?: boolean
  ): Promise<FoodItem> {
    const body: UpdateFoodItemRequest = {
      name,
      price,
      inStock,
    };
    const endpoint = ENDPOINTS.UPDATE_FOOD_ITEM.replace(":id", id);
    const response = await api.patch<FoodItem>(endpoint, body);
    return response.data;
  }

  static async deleteFoodItem(id: string): Promise<void> {
    const endpoint = ENDPOINTS.DELETE_FOOD_ITEM.replace(":id", id);
    await api.delete(endpoint);
  }

  static async getCart(): Promise<Cart | null> {
    const response = await api.get<Cart | null>(ENDPOINTS.GET_CART_ITEMS);
    return response.data;
  }

  static async addCartItem(
    restaurantId: string,
    foodId: string,
    quantity: number,
    userNote?: string
  ): Promise<CartItem> {
    const body: AddCartItemRequest = {
      restaurantId,
      foodId,
      quantity,
      userNote,
    };
    const response = await api.post<CartItem>(ENDPOINTS.CREATE_CART_ITEM, body);
    return response.data;
  }

  static async updateCartItem(
    itemId: string,
    quantity?: number,
    userNote?: string
  ): Promise<CartItem> {
    const body: UpdateCartItemRequest = {
      quantity,
      userNote,
    };
    const endpoint = ENDPOINTS.UPDATE_CART_ITEM.replace(":itemId", itemId);
    const response = await api.patch<CartItem>(endpoint, body);
    return response.data;
  }

  static async removeCartItem(itemId: string): Promise<void> {
    const endpoint = ENDPOINTS.DELETE_CART_ITEM.replace(":itemId", itemId);
    await api.delete(endpoint);
  }

  static async checkout(): Promise<CheckoutResponse> {
    const response = await api.post<CheckoutResponse>(ENDPOINTS.CHECKOUT_CART);
    return response.data;
  }
}
