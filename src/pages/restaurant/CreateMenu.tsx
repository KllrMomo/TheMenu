import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCreateFoodItem } from "../../services/query-hooks/mutations";
import { useRestaurantByOwner } from "../../services/query-hooks/queries";
import { isLoading as checkLoading, handleAuthError } from "../../services/utils";

export function CreateMenu() {
  const { data: userRestaurant, isLoading: isLoadingRestaurant } = useRestaurantByOwner();
  const createFoodItemMutation = useCreateFoodItem();
  const navigate = useNavigate();

  const [dish, setDish] = useState({ name: "", price: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userRestaurant) {
      setError("You need to create a restaurant first.");
      return;
    }

    if (!dish.name.trim()) {
      setError("Dish name is required.");
      return;
    }

    if (!dish.price.trim()) {
      setError("Dish price is required.");
      return;
    }

    const price = parseFloat(dish.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price (greater than 0).");
      return;
    }

    try {
      await createFoodItemMutation.mutateAsync({
        restaurantId: userRestaurant.restaurantId,
        name: dish.name.trim(),
        price: price,
        inStock: true,
      });

      setSuccess(`Dish "${dish.name}" added successfully!`);
      setDish({ name: "", price: "" });
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

  if (checkLoading(isLoadingRestaurant)) {
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
        Add Menu Item
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Restaurant: <span className="text-[#920728]">{userRestaurant.name}</span>
          </h2>
        </div>

        <form onSubmit={handleAddDish} className="mb-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Dish Name</label>
            <input
              type="text"
              value={dish.name}
              onChange={(e) => setDish({ ...dish, name: e.target.value })}
              placeholder="Enter the dish name"
              required
              className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={dish.price}
              onChange={(e) => setDish({ ...dish, price: e.target.value })}
              placeholder="Enter the price"
              required
              className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
            />
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <button
              type="button"
              onClick={() => navigate("/restaurant-dashboard")}
              className="bg-gray-500 text-white px-8 py-3 rounded-2xl text-lg shadow-md hover:bg-gray-600 transition font-medium cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createFoodItemMutation.isPending}
              className="bg-[#920728] text-white px-8 py-3 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {createFoodItemMutation.isPending ? "Adding..." : "Add Dish"}
            </button>
          </div>
        </form>

        <div className="text-center pt-6 border-t border-gray-200">
          <Link
            to="/edit-menu"
            className="text-[#920728] underline hover:text-[#6e0520] font-medium">
            View and Edit All Menu Items →
          </Link>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link to="/restaurant-dashboard" className="text-[#920728] underline hover:text-[#6e0520]">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
