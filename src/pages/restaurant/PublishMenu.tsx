import { Link, useNavigate } from "react-router-dom";

import { useFoodItems, useRestaurantByOwner } from "../../services/query-hooks/queries";
import { isLoading as checkLoading, formatPrice } from "../../services/utils";

export function PublishMenu() {
  const { data: userRestaurant, isLoading: isLoadingRestaurant } = useRestaurantByOwner();
  const { data: foodItems = [], isLoading: isLoadingFoodItems } = useFoodItems(
    userRestaurant?.restaurantId
  );
  const navigate = useNavigate();

  if (checkLoading(isLoadingRestaurant, isLoadingFoodItems)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!userRestaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-gray-700 mb-6">You don't have a restaurant yet.</p>
          <button
            onClick={() => navigate("/restaurant-dashboard")}
            className="bg-[#920728] text-white px-6 py-3 rounded-2xl hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const inStockItems = foodItems.filter((item) => item.inStock);
  const outOfStockItems = foodItems.filter((item) => !item.inStock);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Menu Preview</h1>
        <p className="text-gray-600 text-lg">This is how customers will see your menu</p>
        <div className="mt-4">
          <span className="text-gray-700 font-semibold">Restaurant: </span>
          <span className="text-[#920728] font-bold text-xl">{userRestaurant.name}</span>
        </div>
      </div>

      {/* Status Banner */}
      {foodItems.length > 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-green-800 font-semibold">
              Your menu is live! Customers can now view and order from your menu.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
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
              Your menu is empty. Add items to make your menu visible to customers.
            </p>
          </div>
        </div>
      )}

      {/* Menu Items Preview */}
      {foodItems.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-6 text-lg">No menu items yet.</p>
          <Link
            to="/edit-menu"
            className="bg-[#920728] text-white px-8 py-4 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer inline-block">
            Add Menu Items
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* In Stock Items */}
          {inStockItems.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Items</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {inStockItems.map((item) => (
                    <div key={item.foodId} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                          <p className="text-[#920728] text-lg font-semibold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          In Stock
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Out of Stock Items */}
          {outOfStockItems.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Currently Unavailable</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
                <div className="divide-y divide-gray-200">
                  {outOfStockItems.map((item) => (
                    <div key={item.foodId} className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-600 mb-1 line-through">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-lg">{formatPrice(item.price)}</p>
                        </div>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          Out of Stock
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Menu Stats */}
          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Menu Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#920728]">{foodItems.length}</p>
                <p className="text-gray-600 text-sm">Total Items</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{inStockItems.length}</p>
                <p className="text-gray-600 text-sm">Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{outOfStockItems.length}</p>
                <p className="text-gray-600 text-sm">Unavailable</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">
                  {foodItems.length > 0
                    ? formatPrice(
                        foodItems.reduce((sum, item) => sum + item.price, 0) / foodItems.length
                      )
                    : "$0.00"}
                </p>
                <p className="text-gray-600 text-sm">Avg. Price</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Link
          to="/edit-menu"
          className="bg-[#920728] text-white px-8 py-4 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer text-center">
          Manage Menu
        </Link>
        <Link
          to="/restaurant-dashboard"
          className="bg-gray-500 text-white px-8 py-4 rounded-2xl text-lg shadow-md hover:bg-gray-600 transition font-medium cursor-pointer text-center">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
