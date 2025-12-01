import { Link } from "react-router-dom";

import { useRestaurantByOwner } from "../../services/query-hooks/queries";
import { isLoading as checkLoading } from "../../services/utils";

export function RestaurantHomePage() {
  const {
    data: userRestaurant,
    isLoading: isLoadingRestaurant,
    error: restaurantError,
    isError,
  } = useRestaurantByOwner();
  const loading = checkLoading(isLoadingRestaurant);

  if (loading) {
    return (
      <div className="px-4 py-6 flex flex-col items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Show error state if there's an error
  if (isError && restaurantError) {
    // Check if it's a 401 error (authentication issue)
    const is401 =
      restaurantError &&
      typeof restaurantError === "object" &&
      "response" in restaurantError &&
      (restaurantError as { response?: { status?: number } }).response?.status === 401;

    if (is401) {
      return (
        <div className="px-4 py-6 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <p className="text-red-800 font-semibold mb-2">Authentication Error</p>
              <p className="text-red-700 text-sm mb-4">
                Your session may have expired or your token is invalid. Please log in again.
              </p>
              <p className="text-red-600 text-xs mb-4">
                Status: 401 Unauthorized - The backend rejected your authentication token.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/restaurant-login"
                className="bg-[#920728] text-white px-6 py-3 rounded-2xl hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium text-center">
                Log In Again
              </Link>
              <button
                onClick={() => {
                  // Clear token and reload
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="bg-gray-500 text-white px-6 py-3 rounded-2xl hover:bg-gray-600 transition font-medium">
                Clear Session & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Other errors
    const errorMessage =
      restaurantError && typeof restaurantError === "object" && "message" in restaurantError
        ? (restaurantError as { message?: string }).message
        : "An error occurred while loading your restaurant";

    return (
      <div className="px-4 py-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-800 font-semibold mb-2">Error Loading Restaurant</p>
            <p className="text-red-700 text-sm mb-4">{errorMessage}</p>
            <p className="text-red-600 text-xs">
              Check the browser console for more details. This might be a backend issue.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#920728] text-white px-6 py-3 rounded-2xl hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 flex flex-col items-center justify-center relative overflow-hidden">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
        Restaurant Dashboard
      </h1>
      {userRestaurant && (
        <div className="mb-8 text-center">
          <h2 className="text-5xl font-semibold text-gray-700 mb-4">{userRestaurant.name}</h2>
          <p className="text-gray-600">{userRestaurant.address}</p>
        </div>
      )}
      <div className="flex flex-col gap-4 w-full max-w-md">
        {userRestaurant ? (
          <>
            <Link to="/edit-menu">
              <button className="w-full bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                Manage Menu
              </button>
            </Link>
            <Link to="/publish-menu">
              <button className="w-full bg-green-600 text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-green-700 transition font-medium cursor-pointer">
                Preview Menu
              </button>
            </Link>
            <Link to="/restaurant-profile">
              <button className="w-full bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                Edit Restaurant Profile
              </button>
            </Link>
            <Link to="/reviews-comments">
              <button className="w-full bg-[#920728] text-white px-4 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                Reviews & Comments
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-yellow-800 font-semibold">
                  You need to create a restaurant to get started.
                </p>
              </div>
              <p className="text-yellow-700 text-sm">
                Create your restaurant profile to start managing your menu and accepting orders.
              </p>
            </div>
            <Link to="/restaurant-profile">
              <button className="w-full bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                Create Restaurant
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
