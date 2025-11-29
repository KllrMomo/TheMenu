export const QUERY_KEYS = {
  // Authentication
  POST_LOGIN: "postLogin",
  POST_REGISTER: "postRegister",

  // User
  GET_CURRENT_USER: "getCurrentUser",

  // Restaurants
  GET_RESTAURANTS: "getRestaurants",
  GET_RESTAURANT: "getRestaurant",
  POST_CREATE_RESTAURANT: "postCreateRestaurant",

  // Food Items
  GET_FOOD_ITEMS: "getFoodItems",
  GET_FOOD_ITEM: "getFoodItem",
  POST_CREATE_FOOD_ITEM: "postCreateFoodItem",
  PATCH_UPDATE_FOOD_ITEM: "patchUpdateFoodItem",

  // Shopping Cart
  GET_CART: "getCart",
  POST_ADD_CART_ITEM: "postAddCartItem",
  PATCH_UPDATE_CART_ITEM: "patchUpdateCartItem",
  DELETE_REMOVE_CART_ITEM: "deleteRemoveCartItem",
  POST_CHECKOUT: "postCheckout",
} as const;
