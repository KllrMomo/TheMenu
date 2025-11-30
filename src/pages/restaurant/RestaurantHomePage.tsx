import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import type { Restaurant } from "../../services/api_types";
import { useRestaurantByOwner } from "../../services/query-hooks/queries";
import { QUERY_KEYS } from "../../services/query-hooks/query-keys";
import { isLoading as checkLoading } from "../../services/utils";

export function RestaurantHomePage() {
  const { data: userRestaurant, isLoading: isLoadingRestaurant, refetch } = useRestaurantByOwner();
  const queryClient = useQueryClient();
  const loading = checkLoading(isLoadingRestaurant);

  // Refetch restaurant data when component mounts, but only if we don't have valid data
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      return; // Don't try to fetch if not authenticated
    }

    // Get the current cached data
    const cachedData = queryClient.getQueryData<Restaurant | null>([
      QUERY_KEYS.GET_RESTAURANT_BY_OWNER,
    ]);

    // Only clear cache and refetch if:
    // 1. We have no cached data, OR
    // 2. We have cached null (from a previous 404)
    // If we have valid restaurant data, just do a gentle refetch without clearing
    if (cachedData === null || cachedData === undefined) {
      // Remove the query from cache to clear stale null values
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
        exact: true,
      });

      // Small delay to ensure removal is processed, then refetch
      const timeoutId = setTimeout(() => {
        refetch({ cancelRefetch: false });
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // We have valid data, just do a background refetch without clearing cache
      // This ensures we have fresh data but don't lose what we have
      refetch();
    }
  }, [refetch, queryClient]);

  if (loading) {
    return (
      <div className="px-4 py-6 flex flex-col items-center justify-center">
        <div className="text-center">Loading...</div>
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
