import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  useCreateFoodItem,
  useDeleteFoodItem,
  useUpdateFoodItem,
} from "../../services/query-hooks/mutations";
import { useFoodItems, useRestaurantByOwner } from "../../services/query-hooks/queries";
import { QUERY_KEYS } from "../../services/query-hooks/query-keys";
import { isLoading as checkLoading, formatPrice, handleAuthError } from "../../services/utils";

export function EditMenu() {
  const { data: userRestaurant, isLoading: isLoadingRestaurant } = useRestaurantByOwner();
  const { data: foodItems = [], isLoading: isLoadingFoodItems } = useFoodItems(
    userRestaurant?.restaurantId
  );
  const createFoodItemMutation = useCreateFoodItem();
  const updateFoodItemMutation = useUpdateFoodItem();
  const deleteFoodItemMutation = useDeleteFoodItem();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", inStock: true });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", price: "" });
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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userRestaurant) {
      setError("You need to create a restaurant first.");
      return;
    }

    if (!addForm.name.trim()) {
      setError("Dish name is required.");
      return;
    }

    if (!addForm.price.trim()) {
      setError("Dish price is required.");
      return;
    }

    const price = parseFloat(addForm.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price (greater than 0).");
      return;
    }

    try {
      await createFoodItemMutation.mutateAsync({
        restaurantId: userRestaurant.restaurantId,
        name: addForm.name.trim(),
        price: price,
        inStock: true,
      });

      setSuccess(`"${addForm.name}" added successfully!`);
      setAddForm({ name: "", price: "" });
      setShowAddForm(false);
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setAddForm({ name: "", price: "" });
    setError(null);
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-yellow-800 font-semibold mb-2">No Restaurant Found</p>
            <p className="text-yellow-700 text-sm mb-4">
              You need to create a restaurant before you can manage your menu.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/restaurant-profile")}
              className="bg-[#920728] text-white px-6 py-3 rounded-2xl hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium">
              Create Restaurant
            </button>
            <button
              onClick={() => navigate("/restaurant-dashboard")}
              className="bg-gray-500 text-white px-6 py-3 rounded-2xl hover:bg-gray-600 transition font-medium">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Manage Menu</h1>
          <p className="text-gray-600">
            Restaurant: <span className="text-[#920728] font-semibold">{userRestaurant.name}</span>
          </p>
        </div>
        <div className="flex gap-4">
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#920728] text-white px-6 py-3 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
              + Add Item
            </button>
          )}
          <Link
            to="/publish-menu"
            className="bg-green-600 text-white px-6 py-3 rounded-2xl text-lg shadow-md hover:bg-green-700 transition font-medium cursor-pointer">
            Preview Menu
          </Link>
        </div>
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

      {/* Add New Item Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-2 border-[#920728]">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Menu Item</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Dish Name</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="Enter the dish name"
                required
                className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={addForm.price}
                onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                placeholder="Enter the price"
                required
                className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createFoodItemMutation.isPending}
                className="bg-[#920728] text-white px-6 py-3 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {createFoodItemMutation.isPending ? "Adding..." : "Add Item"}
              </button>
              <button
                type="button"
                onClick={handleCancelAdd}
                className="bg-gray-500 text-white px-6 py-3 rounded-2xl text-lg shadow-md hover:bg-gray-600 transition font-medium cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {foodItems.length === 0 && !showAddForm ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-6 text-lg">No menu items yet. Add your first dish!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#920728] text-white px-8 py-4 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
            + Add Your First Menu Item
          </button>
        </div>
      ) : (
        foodItems.length > 0 && (
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
        )
      )}

      <div className="text-center mt-8">
        <Link
          to="/restaurant-dashboard"
          className="text-[#920728] underline hover:text-[#6e0520] font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
