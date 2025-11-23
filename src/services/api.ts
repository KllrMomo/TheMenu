import api from "./axios";
import { ENDPOINTS } from "./endpoints";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
  Restaurant,
  CreateRestaurantRequest,
  FoodItem,
  CreateFoodItemRequest,
  UpdateFoodItemRequest,
  Cart,
  AddCartItemRequest,
  UpdateCartItemRequest,
  CheckoutResponse,
} from "./api_types";

export class Api {
  static async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const body: RegisterRequest = {
      firstName,
      lastName,
      email,
      password,
    };
    const response = await api.post<AuthResponse>(ENDPOINTS.REGISTER, body);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  }

  static async login(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const body: LoginRequest = {
      email,
      password,
    };
    const response = await api.post<AuthResponse>(ENDPOINTS.LOGIN, body);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
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

  static async listRestaurants(): Promise<Restaurant[]> {
    const response = await api.get<Restaurant[]>(ENDPOINTS.GET_RESTAURANTS);
    return response.data;
  }

  static async getRestaurantById(id: string): Promise<Restaurant> {
    const endpoint = ENDPOINTS.GET_RESTAURANT_INFO.replace(":id", id);
    const response = await api.get<Restaurant>(endpoint);
    return response.data;
  }

  static async createRestaurant(
    name: string,
    address: string,
  ): Promise<Restaurant> {
    const body: CreateRestaurantRequest = {
      name,
      address,
    };
    const response = await api.post<Restaurant>(ENDPOINTS.CREATE_RESTAURANT, body);
    return response.data;
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
    inStock?: boolean,
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
    inStock?: boolean,
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

  static async getCart(): Promise<Cart | null> {
    const response = await api.get<Cart | null>(ENDPOINTS.GET_CART_ITEMS);
    return response.data;
  }

  static async addCartItem(
    restaurantId: string,
    foodId: string,
    quantity: number,
    userNote?: string,
  ): Promise<Cart> {
    const body: AddCartItemRequest = {
      restaurantId,
      foodId,
      quantity,
      userNote,
    };
    const response = await api.post<Cart>(ENDPOINTS.CREATE_CART_ITEM, body);
    return response.data;
  }

  static async updateCartItem(
    itemId: string,
    quantity?: number,
    userNote?: string,
  ): Promise<Cart> {
    const body: UpdateCartItemRequest = {
      quantity,
      userNote,
    };
    const endpoint = ENDPOINTS.UPDATE_CART_ITEM.replace(":itemId", itemId);
    const response = await api.patch<Cart>(endpoint, body);
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
