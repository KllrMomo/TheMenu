import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useRestaurantByOwner } from "../../services/query-hooks/queries";
import { isLoading as checkLoading } from "../../services/utils";

export function CreateMenu() {
  const { data: userRestaurant, isLoading: isLoadingRestaurant } = useRestaurantByOwner();
  const navigate = useNavigate();

  // Redirect to EditMenu which now handles adding items
  useEffect(() => {
    if (!isLoadingRestaurant) {
      navigate("/edit-menu", { replace: true });
    }
  }, [isLoadingRestaurant, navigate]);

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

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Redirecting to menu management...</div>
    </div>
  );
}
