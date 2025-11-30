import { useState } from "react";
import { useParams } from "react-router-dom";

import MenuImage from "../assets/images/Menu.png";
import { useFoodItems, useRestaurant } from "../services/query-hooks/queries";
import { isLoading as checkLoading, formatPrice } from "../services/utils";

export function ViewingPage() {
  const { restaurantId } = useParams();
  const [open, setOpen] = useState(false);

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: foodItems = [], isLoading: isLoadingFoodItems } = useFoodItems(restaurantId);

  if (checkLoading(isLoadingRestaurant, isLoadingFoodItems)) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center">Loading restaurant information...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center text-red-600">Restaurant not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Menu image */}
      <div className="col-span-1 flex justify-center">
        <img
          src={MenuImage}
          alt=""
          onClick={() => setOpen(true)}
          className="w-full h-full object-cover rounded-lg cursor-pointer"
        />
        {/* FULLSCREEN MODAL */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            onClick={() => setOpen(false)}>
            <img
              src={MenuImage}
              alt="Full view"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl"
            />
          </div>
        )}
      </div>

      {/* Restaurant details */}
      <div className="col-span-2">
        {/* Restaurant Name */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{restaurant.name}</h1>

        {/* Restaurant Description */}
        <div className="bg-gray-200 h-24 rounded mb-10 items-center flex px-4 py-3">
          <p className="text-gray-700">{restaurant.address}</p>
        </div>

        {/* Food Items */}
        {foodItems.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
            <div className="space-y-3 mb-8">
              {foodItems.map((item) => (
                <div key={item.foodId} className="bg-white shadow p-4 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      {!item.inStock && <span className="text-red-600 text-sm">Out of Stock</span>}
                    </div>
                    <p className="text-gray-700 font-medium">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Reviews Title */}
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {/* Note: Reviews functionality would require a separate reviews API endpoint */}
        <div className="bg-white shadow p-4 rounded mb-4">
          <p className="text-gray-600 text-center py-4">
            Reviews feature coming soon. This will require a reviews/comments API endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}
