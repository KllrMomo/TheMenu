import { Link } from "react-router-dom";

import { useCurrentUser, useRestaurants } from "../../services/query-hooks/queries";
import { isLoading as checkLoading, findRestaurantByOwner } from "../../services/utils";

export function RestaurantHomePage() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useRestaurants();

  const userRestaurant = findRestaurantByOwner(restaurants, currentUser?.userId);
  const loading = checkLoading(isLoadingUser, isLoadingRestaurants);

  if (loading) {
    return (
      <div className="px-4 py-6 flex flex-col items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 flex flex-col items-center justify-center relative overflow-hidden">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-800 text-center mb-12">
        Restaurant Dashboard
      </h1>
      {userRestaurant && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">{userRestaurant.name}</h2>
          <p className="text-gray-600">{userRestaurant.address}</p>
        </div>
      )}
      <Link to="/create-menu">
        <button className="mb-6 bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
          Create Menu
        </button>
      </Link>
      <Link to="/publish-menu">
        <button className="mb-6 bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
          Publish Menu
        </button>
      </Link>
      <Link to="/reviews-comments">
        <button className="bg-[#920728] text-white px-4 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
          Reviews & Comments
        </button>
      </Link>
      {!userRestaurant && (
        <div className="mt-6 text-center text-yellow-600">
          Note: You need to create a restaurant first. Please complete your registration.
        </div>
      )}
    </div>
  );
}
