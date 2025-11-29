import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser, useRestaurants, useFoodItems } from "../../services/query-hooks/queries";
import { findRestaurantByOwner, createImagePreviewUrl, formatPrice } from "../../services/utils";

export function PublishMenu() {
    const { data: currentUser } = useCurrentUser();
    const { data: restaurants = [] } = useRestaurants();

    const userRestaurant = findRestaurantByOwner(restaurants, currentUser?.userId);

    const { data: foodItems = [], isLoading: isLoadingFoodItems } = useFoodItems(userRestaurant?.restaurantId);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreviewImage(createImagePreviewUrl(file));
    };

    return (
        <div className="px-4 py-6 ">
            <h1 className="text-5xl font-bold text-center mb-10">Select the menu you want to publish</h1>

            {/* Menu Cards - Show food items as menu items */}
            {isLoadingFoodItems ? (
                <div className="text-center py-10">Loading menu items...</div>
            ) : foodItems.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-10 mb-6">
                    {foodItems.slice(0, 3).map((item) => (
                        <div key={item.foodId} className="w-60 h-80 bg-white border border-gray-300 rounded p-4 shadow">
                            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                            <p className="text-gray-600 mb-2">{formatPrice(item.price)}</p>
                            {!item.inStock && (
                                <span className="text-red-600 text-sm">Out of Stock</span>
                            )}
                        </div>
                    ))}
                    {foodItems.length === 0 && (
                        <div className="w-60 h-80 bg-gray-300 rounded flex items-center justify-center text-gray-600">
                            No menu items yet
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-10 mb-6">
                    <div className="w-60 h-80 bg-gray-300 rounded flex items-center justify-center text-gray-600">
                        No menu items available. Create some food items first.
                    </div>
                </div>
            )}

            {/* Create New Menu */}
            <div className="text-center mb-16">
                <Link to="/create-menu" className="text-[#920728] underline font-semibold hover:text-[#6e0520]">
                    Create New Menu
                </Link>
            </div>

            {/* Preview Section */}
            <h2 className="text-xl text-center font-semibold mb-4">Preview:</h2>
            <div className="flex flex-col items-center justify-center">
                <label className="w-80 h-80 bg-gray-200 rounded flex items-center justify-center text-gray-700 cursor-pointer hover:bg-gray-300 transition mb-6">
                    {previewImage ? (
                        <img src={previewImage} alt="Menu Preview" className="w-full h-full object-cover rounded" />
                    ) : (
                        <span className="text-center">Upload a <br /> Menu here</span>
                    )}
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                </label>
                <button className="bg-[#920728] text-white px-6 py-3 rounded hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                    Publish Menu
                </button>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="text-center mt-20 mb-12">
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="border px-6 py-2 rounded hover:bg-gray-100 mb-4">
                    Top
                </button>

                <div className="mt-4">
                    <a href="/restaurant-dashboard" className="text-[#920728] underline">
                    Back to Homepage
                    </a>
                </div>
            </div>
        </div>
    )
}