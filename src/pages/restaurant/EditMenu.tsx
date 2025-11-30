import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDeleteFoodItem, useUpdateFoodItem } from "../../services/query-hooks/mutations";
import { useFoodItems, useRestaurantByOwner } from "../../services/query-hooks/queries";
import { QUERY_KEYS } from "../../services/query-hooks/query-keys";
import { isLoading as checkLoading, formatPrice, handleAuthError } from "../../services/utils";

export function EditMenu() {
  const { data: userRestaurant, isLoading: isLoadingRestaurant } = useRestaurantByOwner();
  const { data: foodItems = [], isLoading: isLoadingFoodItems } = useFoodItems(
    userRestaurant?.restaurantId
  );
  const updateFoodItemMutation = useUpdateFoodItem();
  const deleteFoodItemMutation = useDeleteFoodItem();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", inStock: true });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEdit = (item: (typeof foodItems)[0]) => {
    setEditingId(item.foodId);
    setEditForm({
      name: item.name,
      price: item.price.toString(),
      inStock: item.inStock,
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", price: "", inStock: true });
    setError(null);
  };

  const handleSaveEdit = async (foodId: string) => {
    setError(null);
    setSuccess(null);

    if (!editForm.name.trim()) {
      setError("Dish name is required.");
      return;
    }

    if (!editForm.price.trim()) {
      setError("Dish price is required.");
      return;
    }

    const price = parseFloat(editForm.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price (greater than 0).");
      return;
    }

    try {
      await updateFoodItemMutation.mutateAsync({
        id: foodId,
        name: editForm.name.trim(),
        price: price,
        inStock: editForm.inStock,
      });

      // Invalidate food items query to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOOD_ITEMS, userRestaurant?.restaurantId],
      });

      setSuccess(`"${editForm.name}" updated successfully!`);
      setEditingId(null);
      setEditForm({ name: "", price: "", inStock: true });
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

  const handleDelete = async (foodId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await deleteFoodItemMutation.mutateAsync(foodId);

      // Invalidate food items query to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOOD_ITEMS, userRestaurant?.restaurantId],
      });

      setSuccess(`"${name}" deleted successfully!`);
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

  const handleToggleStock = async (item: (typeof foodItems)[0]) => {
    setError(null);
    setSuccess(null);

    try {
      await updateFoodItemMutation.mutateAsync({
        id: item.foodId,
        inStock: !item.inStock,
      });

      // Invalidate food items query to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOOD_ITEMS, userRestaurant?.restaurantId],
      });

      setSuccess(`"${item.name}" marked as ${!item.inStock ? "in stock" : "out of stock"}!`);
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Edit Menu</h1>
        <Link
          to="/create-menu"
          className="bg-[#920728] text-white px-6 py-3 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
          + Add New Item
        </Link>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Restaurant: <span className="text-[#920728]">{userRestaurant.name}</span>
        </h2>
      </div>

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

      {foodItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-6">No menu items yet. Add your first dish!</p>
          <Link
            to="/create-menu"
            className="bg-[#920728] text-white px-6 py-3 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer inline-block">
            Add Menu Item
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {foodItems.map((item) => (
              <div key={item.foodId} className="p-6">
                {editingId === item.foodId ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-full px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`stock-${item.foodId}`}
                        checked={editForm.inStock}
                        onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })}
                        className="w-4 h-4 text-[#920728] border-gray-300 rounded focus:ring-[#920728]"
                      />
                      <label htmlFor={`stock-${item.foodId}`} className="text-gray-700">
                        In Stock
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(item.foodId)}
                        disabled={updateFoodItemMutation.isPending}
                        className="bg-[#920728] text-white px-4 py-2 rounded hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        {updateFoodItemMutation.isPending ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition font-medium cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-gray-700 text-lg mb-2">{formatPrice(item.price)}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStock(item)}
                        disabled={
                          updateFoodItemMutation.isPending || deleteFoodItemMutation.isPending
                        }
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          item.inStock
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}>
                        {item.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        disabled={editingId !== null}
                        className="bg-[#920728] text-white px-4 py-2 rounded hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.foodId, item.name)}
                        disabled={
                          updateFoodItemMutation.isPending ||
                          deleteFoodItemMutation.isPending ||
                          editingId !== null
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <Link to="/restaurant-dashboard" className="text-[#920728] underline hover:text-[#6e0520]">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
