export const ENDPOINTS = {
    // Authentication
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',

    // User
    GET_ACCOUNT_INFO: '/api/user/me',
    
    // Restaurants
    GET_RESTAURANTS: '/api/restaurants',
    GET_RESTAURANT_INFO: '/api/restaurants/:id',
    CREATE_RESTAURANT: '/api/restaurants',

    // Food Items
    GET_FOOD_ITEMS: '/api/food-items/restaurant/:restaurantId',
    GET_FOOD_ITEM_INFO: '/api/food-items/:id',
    CREATE_FOOD_ITEM: '/api/food-items',
    UPDATE_FOOD_ITEM: '/api/food-items/:id',

    // Shopping Cart
    GET_CART_ITEMS: '/api/carts',
    CREATE_CART_ITEM: '/api/carts/items',
    UPDATE_CART_ITEM: '/api/carts/items/:itemId',
    DELETE_CART_ITEM: '/api/carts/items/:itemId',
    CHECKOUT_CART: '/api/carts/checkout',
}