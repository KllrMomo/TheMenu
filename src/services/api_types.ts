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
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string; // ISO 8601 datetime
  updatedAt?: string; // ISO 8601 datetime
  // password is not included in user object
}

// Restaurant Types
export interface Restaurant {
  restaurantId: string;
  ownerId: string;
  name: string;
  address: string;
  createdAt?: string; // ISO 8601 datetime
  updatedAt?: string; // ISO 8601 datetime
  owner?: User; // Nested owner information
  foodItems?: FoodItem[]; // Nested food items for GET /api/restaurants/:id
}

export interface CreateRestaurantRequest {
  name: string;
  address: string;
}

export interface UpdateRestaurantRequest {
  name?: string;
  address?: string;
}

// Food Item Types
export interface FoodItem {
  foodId: string;
  restaurantId: string;
  name: string;
  price: number;
  inStock: boolean;
  createdAt?: string; // ISO 8601 datetime
  updatedAt?: string; // ISO 8601 datetime
  restaurant?: Restaurant; // Nested restaurant information for GET /api/food-items/:id
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

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Shopping Cart Types
export interface CartItem {
  cartItemId: string;
  cartId: string;
  foodId: string;
  quantity: number;
  userNote?: string | null;
  createdAt?: string; // ISO 8601 datetime
  updatedAt?: string; // ISO 8601 datetime
  foodItem?: FoodItem; // Nested food item information
}

export interface Cart {
  cartId: string;
  userId: string;
  restaurantId: string;
  createdAt?: string; // ISO 8601 datetime
  updatedAt?: string; // ISO 8601 datetime
  restaurant?: Restaurant; // Nested restaurant information
  items: CartItem[]; // Nested cart items
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
