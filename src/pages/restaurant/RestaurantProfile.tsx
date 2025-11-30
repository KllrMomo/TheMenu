import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUpdateRestaurant } from "../../services/query-hooks/mutations";
import { useRestaurantByOwner } from "../../services/query-hooks/queries";
import { isLoading as checkLoading, handleAuthError } from "../../services/utils";

export function RestaurantProfile() {
  const { data: userRestaurant, isLoading: isLoadingRestaurant } = useRestaurantByOwner();
  const updateRestaurantMutation = useUpdateRestaurant();
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

    if (!userRestaurant) {
      setError("Restaurant not found. Please create a restaurant first.");
      return;
    }

    try {
      await updateRestaurantMutation.mutateAsync({
        restaurantId: userRestaurant.restaurantId,
        name: restaurantName,
        address: address,
      });

      setSuccess("Restaurant information updated successfully!");
      setTimeout(() => {
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
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Edit Restaurant Profile
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
              disabled={updateRestaurantMutation.isPending}
              className="bg-[#920728] text-white px-8 py-3 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {updateRestaurantMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/restaurant-dashboard")}
            className="text-[#920728] underline hover:text-[#6e0520]">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
