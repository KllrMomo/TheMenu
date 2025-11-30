import { Link } from "react-router-dom";

import { useCurrentUser, useRestaurants } from "../../services/query-hooks/queries";
import {
  isLoading as checkLoading,
  getRecentlyViewedRestaurants,
  getRecommendedRestaurants,
  getUsername,
} from "../../services/utils";
import { RestaurantCard } from "../restaurant/RestaurantCard";

export function CustomerHomePage() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useRestaurants();

  const username = getUsername(currentUser);
  const recentlyViewed = getRecentlyViewedRestaurants(restaurants, 3);
  const recommendedForYou = getRecommendedRestaurants(restaurants, 3, 3);

  if (checkLoading(isLoadingUser, isLoadingRestaurants)) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 text-center mb-12">
        Welcome back, <br />{" "}
        <span className="text-[#920728] text-2xl md:text-4xl mb-14">{username}</span>
      </h2>

      {isLoadingRestaurants ? (
        <div className="text-center text-gray-600 py-10">Loading...</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          No restaurants available at the moment.
        </div>
      ) : (
        <>
          {/* Recently Viewed */}
          <div>
            <h2 className="font-semibold text-lg mb-4 text-gray-800"> Recently Viewed</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 mb-12 scrollbar-hide">
              {recentlyViewed.map((restaurant) => (
                <Link
                  key={restaurant.restaurantId}
                  to={`/restaurant/${restaurant.restaurantId}`}
                  className="shrink-0 min-w-[280px]">
                  <RestaurantCard name={restaurant.name} address={restaurant.address} />
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended For You */}
          <div>
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Recommended For You</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {recommendedForYou.map((restaurant) => (
                <Link
                  key={restaurant.restaurantId}
                  to={`/restaurant/${restaurant.restaurantId}`}
                  className="shrink-0">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer min-w-[280px]">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                    <p className="text-gray-700">{restaurant.address}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
