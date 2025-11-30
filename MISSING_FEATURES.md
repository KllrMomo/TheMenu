# Missing Features and Hooks Documentation

This document outlines the missing hooks, services, and API endpoints that would be needed for optimal functionality of the application.

## Missing API Endpoints and Hooks

### 1. Update Restaurant Profile
**Location:** `RestaurantProfile.tsx`

**Status:** Partially implemented - form exists but save functionality is not connected

**What's Needed:**
- API Endpoint: `PATCH /api/restaurants/:id` or `PUT /api/restaurants/:id`
- Hook: `useUpdateRestaurant` mutation hook
- Functionality: Update restaurant name, address, and other profile details

**Implementation Requirements:**
```typescript
// Hook would need:
interface UpdateRestaurantParams {
  restaurantId: string;
  name?: string;
  address?: string;
  // Other restaurant fields
}

export const useUpdateRestaurant = () => {
  // Mutation hook implementation
};
```

### 2. Get Restaurant by Owner ID
**Location:** `RestaurantHomePage.tsx`, `RestaurantProfile.tsx`, `CreateMenu.tsx`, `PublishMenu.tsx`

**Status:** Currently using workaround - fetching all restaurants and filtering by ownerId

**What's Needed:**
- API Endpoint: `GET /api/restaurants/me` or `GET /api/restaurants/owner/:ownerId`
- Hook: `useRestaurantByOwner` or enhance `useRestaurant` to accept ownerId
- Functionality: Directly fetch the restaurant owned by the current logged-in user

**Current Workaround:**
The application currently uses `useRestaurants()` and filters results client-side, which is inefficient and could be problematic with many restaurants.

**Implementation Requirements:**
```typescript
// Hook would need:
export const useRestaurantByOwner = (ownerId: string | undefined) => {
  return useQuery<Restaurant | null, Error>({
    queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER, ownerId],
    queryFn: () => Api.getRestaurantByOwner(ownerId),
    enabled: !!ownerId,
  });
};
```

### 3. Reviews and Comments System
**Location:** `ReviewsComments.tsx`, `ViewingPage.tsx`

**Status:** UI exists but uses mock data - no backend integration

**What's Needed:**
- API Endpoints:
  - `GET /api/restaurants/:restaurantId/reviews` - Get reviews for a restaurant
  - `POST /api/restaurants/:restaurantId/reviews` - Create a new review
  - `POST /api/reviews/:reviewId/replies` - Reply to a review (restaurant owner)
  - `DELETE /api/reviews/:reviewId` - Delete a review (if needed)
  - `POST /api/reviews/:reviewId/report` - Report a harmful review
- Hooks:
  - `useReviews(restaurantId)` - Query hook to fetch reviews
  - `useCreateReview()` - Mutation hook to create a review
  - `useCreateReviewReply()` - Mutation hook to reply to a review
  - `useReportReview()` - Mutation hook to report a review

**Implementation Requirements:**
```typescript
// Review types would need:
interface Review {
  reviewId: string;
  restaurantId: string;
  userId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  user?: User;
  replies?: ReviewReply[];
}

interface ReviewReply {
  replyId: string;
  reviewId: string;
  userId: string;
  message: string;
  createdAt: string;
  user?: User;
}
```

### 4. Menu Image Upload/Management
**Location:** `CreateMenu.tsx`, `PublishMenu.tsx`

**Status:** UI exists but no backend integration

**What's Needed:**
- API Endpoints:
  - `POST /api/restaurants/:restaurantId/menu-image` - Upload menu image
  - `GET /api/restaurants/:restaurantId/menu-image` - Get menu image URL
  - `DELETE /api/restaurants/:restaurantId/menu-image` - Delete menu image
- Hooks:
  - `useUploadMenuImage()` - Mutation hook to upload menu image
  - `useMenuImage(restaurantId)` - Query hook to fetch menu image

**Implementation Requirements:**
These would typically use FormData and handle file uploads.

### 5. Restaurant Logo Upload
**Location:** `RestaurantProfile.tsx`

**Status:** UI exists but no backend integration

**What's Needed:**
- API Endpoints:
  - `POST /api/restaurants/:restaurantId/logo` - Upload restaurant logo
  - `GET /api/restaurants/:restaurantId/logo` - Get restaurant logo URL
- Hooks:
  - `useUploadRestaurantLogo()` - Mutation hook for logo upload

### 6. Recently Viewed Restaurants
**Location:** `CustomerHomePage.tsx`

**Status:** Currently showing first 3 restaurants - not actual browsing history

**What's Needed:**
- API Endpoints:
  - `GET /api/user/recently-viewed` - Get user's recently viewed restaurants
  - `POST /api/user/recently-viewed` - Track a restaurant view
- Hooks:
  - `useRecentlyViewedRestaurants()` - Query hook to fetch recently viewed
  - `useTrackRestaurantView()` - Mutation hook to track a view

### 7. Restaurant Recommendations
**Location:** `CustomerHomePage.tsx`

**Status:** Currently showing restaurants 4-6 - not actual recommendations

**What's Needed:**
- API Endpoint: `GET /api/user/recommendations`
- Hook: `useRestaurantRecommendations()` - Query hook for recommendations

**Note:** This would require a recommendation algorithm on the backend.

### 8. User Profile Update
**Location:** Potential future feature

**What's Needed:**
- API Endpoint: `PATCH /api/user/me`
- Hook: `useUpdateUser()` - Mutation hook to update user profile

### 9. Delete Food Item
**Location:** Potential future feature in menu management

**What's Needed:**
- API Endpoint: `DELETE /api/food-items/:id`
- Hook: `useDeleteFoodItem()` - Mutation hook to delete a food item

### 10. Search Restaurants
**Location:** Potential feature for homepage

**What's Needed:**
- API Endpoint: `GET /api/restaurants?search=query&filters=...`
- Hook: `useSearchRestaurants(searchQuery, filters)` - Query hook with search functionality

### 11. Cart Functionality Integration
**Location:** Not yet implemented in UI

**Status:** Hooks exist but no UI components use them

**What's Needed:**
- UI Components for:
  - Adding items to cart (`useAddCartItem`)
  - Viewing cart (`useCart`)
  - Updating cart items (`useUpdateCartItem`)
  - Removing cart items (`useRemoveCartItem`)
  - Checkout (`useCheckout`)

**Current Hooks Available:**
- ✅ `useCart()` - Query hook
- ✅ `useAddCartItem()` - Mutation hook
- ✅ `useUpdateCartItem()` - Mutation hook
- ✅ `useRemoveCartItem()` - Mutation hook
- ✅ `useCheckout()` - Mutation hook

## Summary

### Critical Missing Features (High Priority)
1. **Update Restaurant Profile** - Restaurant owners cannot update their restaurant information
2. **Get Restaurant by Owner** - Inefficient workaround currently in use
3. **Reviews System** - Core feature completely missing backend support

### Important Missing Features (Medium Priority)
4. **Menu Image Management** - Menu display functionality incomplete
5. **Recently Viewed** - Personalization feature missing
6. **Restaurant Recommendations** - Personalization feature missing

### Nice-to-Have Features (Low Priority)
7. User profile updates
8. Delete food items
9. Restaurant search
10. Cart UI components

## Implementation Priority

1. **Update Restaurant Profile** - Should be implemented first as it's a core feature for restaurant owners
2. **Get Restaurant by Owner** - Performance improvement for existing functionality
3. **Reviews System** - Major user-facing feature that's partially implemented in UI
4. **Menu Image Management** - Completes the menu creation/publishing flow
5. **Recently Viewed & Recommendations** - Enhances user experience

