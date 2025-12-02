import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCreateRestaurant, useUpdateRestaurant } from "../../services/query-hooks/mutations";
import { useRestaurantByOwner } from "../../services/query-hooks/queries";
import { QUERY_KEYS } from "../../services/query-hooks/query-keys";
import { isLoading as checkLoading, handleAuthError } from "../../services/utils";

export function RestaurantProfile() {
  const { data: userRestaurant, isLoading: isLoadingRestaurant } = useRestaurantByOwner();
  const createRestaurantMutation = useCreateRestaurant();
  const updateRestaurantMutation = useUpdateRestaurant();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isCreating = !userRestaurant;

  // Initialize form with restaurant data
  useEffect(() => {
    if (userRestaurant) {
      setRestaurantName(userRestaurant.name || "");
      setAddress(userRestaurant.address || "");
    }
  }, [userRestaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!restaurantName.trim()) {
      setError("Restaurant name is required.");
      return;
    }

    if (!address.trim()) {
      setError("Address is required.");
      return;
    }

    try {
      if (isCreating) {
        // Create new restaurant
        await createRestaurantMutation.mutateAsync({
          name: restaurantName.trim(),
          address: address.trim(),
        });

        // The mutation hook already sets the query data, but we'll ensure it's refetched
        // Wait a bit to ensure the query cache is updated
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Refetch to ensure data is updated everywhere
        await queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
          exact: true,
        });

        setSuccess("Restaurant created successfully!");
      } else {
        // Update existing restaurant
        await updateRestaurantMutation.mutateAsync({
          restaurantId: userRestaurant.restaurantId,
          name: restaurantName.trim(),
          address: address.trim(),
        });

        // Invalidate restaurant queries to refetch
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RESTAURANT, userRestaurant.restaurantId],
        });

        setSuccess("Restaurant information updated successfully!");
      }

      // Wait a bit longer to ensure query cache is fully updated before navigation
      setTimeout(() => {
        // Force a refetch one more time before navigation to be absolutely sure
        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_RESTAURANT_BY_OWNER],
        });
        navigate("/restaurant-dashboard");
      }, 1500);
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

  const handleCancel = () => {
    navigate("/restaurant-dashboard");
  };

  if (checkLoading(isLoadingRestaurant)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 px-4">
      {/* BACKGROUND IMAGE */}
      <img
        src="src/assets/images/back.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-100 z-0 pointer-events-none select-none"
        style={{ minHeight: "100%" }}
      />

      <div className="w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          {isCreating ? "Create Restaurant" : "Edit Restaurant Profile"}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
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

          {/* Restaurant Name */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Restaurant Name</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
            />
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-6 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-8 py-3 rounded-2xl text-lg shadow-md hover:bg-gray-600 transition font-medium cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRestaurantMutation.isPending || updateRestaurantMutation.isPending}
              className="bg-[#920728] text-white px-8 py-3 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {createRestaurantMutation.isPending || updateRestaurantMutation.isPending
                ? isCreating
                  ? "Creating..."
                  : "Saving..."
                : isCreating
                  ? "Create Restaurant"
                  : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <Link
            to="/restaurant-dashboard"
            className="text-[#920728] underline hover:text-[#6e0520] font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
