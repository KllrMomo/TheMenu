import { Link } from "react-router-dom";
import { useCurrentUser, useRestaurants } from "../../services/query-hooks/queries";
import { getUsername, getRecentlyViewedRestaurants, getRecommendedRestaurants, isLoading as checkLoading } from "../../services/utils";

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
            <h2 className="text-xl md:text-4xl font-bold text-gray-800 text-center mb-12">
                Welcome back, <br /> <span className="text-[#920728] md:text-5xl mb-14">{username}</span>
            </h2>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
                <>
                    <h2 className="font-semibold text-lg mb-4 text-gray-800"> Recently Viewed</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                        {recentlyViewed.map((restaurant) => (
                            <Link key={restaurant.restaurantId} to={`/restaurant/${restaurant.restaurantId}`}>
                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                                    <p className="text-gray-700">{restaurant.address}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Recommended For You */}
            {recommendedForYou.length > 0 && (
                <>
                    <h2 className="font-semibold text-lg mb-4 text-gray-800"> Recommended For You</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {recommendedForYou.map((restaurant) => (
                            <Link key={restaurant.restaurantId} to={`/restaurant/${restaurant.restaurantId}`}>
                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                                    <p className="text-gray-700">{restaurant.address}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {restaurants.length === 0 && (
                <div className="text-center text-gray-600 py-10">
                    No restaurants available at the moment.
                </div>
            )}
        </div>
    )
}