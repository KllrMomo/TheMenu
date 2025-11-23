// Authentication Types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // password is not included in user object
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  owner: User;
  foodItems?: FoodItem[];
}

export interface CreateRestaurantRequest {
  name: string;
  address: string;
}

// Food Item Types
export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  inStock: boolean;
  restaurant?: Restaurant;
}

export interface CreateFoodItemRequest {
  restaurantId: string;
  name: string;
  price: number;
  inStock?: boolean;
}

export interface UpdateFoodItemRequest {
  name?: string;
  price?: number;
  inStock?: boolean;
}

// Shopping Cart Types
export interface CartItem {
  id: string;
  restaurantId: string;
  foodId: string;
  quantity: number;
  userNote?: string;
  restaurant?: Restaurant;
  foodItem?: FoodItem;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  restaurant?: Restaurant;
}

export interface AddCartItemRequest {
  restaurantId: string;
  foodId: string;
  quantity: number;
  userNote?: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  userNote?: string;
}

export interface CheckoutResponse {
  message: string;
}

