import { Link } from "react-router-dom";

import { useRestaurants } from "../services/query-hooks/queries";
import { RestaurantCard } from "./restaurant/RestaurantCard";

export function HomePage() {
  const { data, isLoading } = useRestaurants();
  const restaurants = Array.isArray(data) ? data : [];

  return (
    <div className="px-4 py-6">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to The Menu</h1>
        <p className="text-gray-600">Discover amazing restaurants and explore their menus.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading restaurants...</div>
      ) : restaurants.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div className="">
                <Link
                  key={restaurant.restaurantId}
                  to={`/restaurant/${restaurant.restaurantId}`}
                  className="shrink-0">
                  <RestaurantCard name={restaurant.name} address={restaurant.address} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-10">
          No restaurants available at the moment.
        </div>
      )}
    </div>
  );
}
