import { useState } from "react";
import { useCurrentUser, useRestaurants } from "../../services/query-hooks/queries";
import { useCreateFoodItem } from "../../services/query-hooks/mutations";
import { findRestaurantByOwner, validateDishForm, handleAuthError } from "../../services/utils";

export function CreateMenu() { 
    const { data: currentUser } = useCurrentUser();
    const { data: restaurants = [] } = useRestaurants();
    const createFoodItemMutation = useCreateFoodItem();

    const userRestaurant = findRestaurantByOwner(restaurants, currentUser?.userId);

    const [restaurantName, setRestaurantName] = useState(userRestaurant?.name || "");
    const [sectionName, setSectionName] = useState("");
    const [dish, setDish] = useState({name:"", price:"", description:""});
    const [contact, setContact] = useState({phone:"", email:"", address:""});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleAddDish = async () => {
        if (!userRestaurant) {
            setError("You need to create a restaurant first.");
            return;
        }

        const validation = validateDishForm(dish);
        if (!validation.isValid) {
            setError(validation.error || "Please fill in dish name and price.");
            return;
        }

        try {
            await createFoodItemMutation.mutateAsync({
                restaurantId: userRestaurant.restaurantId,
                name: dish.name,
                price: parseFloat(dish.price),
                inStock: true,
            });

            setSuccess(`Dish "${dish.name}" added successfully!`);
            setDish({name:"", price:"", description:""});
            setError(null);
        } catch (err) {
            setError(handleAuthError(err));
        }
    };

    return (
        <div className="px-4 py-6">
            <h1 className="text-3xl font-bold text-center">New Menu</h1>
            <div className="max-w-3xl mx-auto mt-10 bg-white p-10 rounded-lg shadow">
                {/* Restaurant Name */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-3">Restaurant Name</h2>
                    <input 
                        type="text" 
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="Enter restaurant name"
                        disabled={!!userRestaurant}
                        className="w-full border px-4 py-3 rounded disabled:bg-gray-100"
                    />
                    {userRestaurant && (
                        <p className="text-sm text-gray-600 mt-1">This is your registered restaurant.</p>
                    )}
                </div>

                {/*Logo*/}
                <div className="mb-10 text-center">
                    <h3 className="text-xl font-semibold mb-2">Upload Logo</h3>
                    <label className="block border border-gray-300 p-4 rounded cursor-pointer hover:bg-gray-50">
                        Upload logo here
                        <input type="file" className="hidden" />
                    </label>
                </div>

                {/* Menu Section */}
                <div className="mb-10">
                    <h3 className="text-xl font-semibold mb-3 ">New Section</h3>
                    <input 
                        type="text" 
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        placeholder="Enter section name (Starters, Drinks...)"
                        className="w-full border px-4 py-3 rounded"
                    />
                </div>

                {/* Dish Item */}
                <div className="mb-10">
                    <h3 className="text-xl font-semibold mb-3 ">Add Dish</h3>
                    <div className="grid gap-4">
                        <input 
                            type="text"
                            value={dish.name}
                            onChange={(e) => setDish({...dish, name: e.target.value})}
                            placeholder="Enter the dish name"
                            className="border px-4 py-2 rounded w-full"
                        />
                        <input
                            type="number"
                            value={dish.price}
                            onChange={(e) => setDish({...dish, price: e.target.value})}
                            placeholder="Enter the price"
                            className="border px-4 py-2 rounded w-full"
                        />
                        <textarea
                            value={dish.description}
                            onChange={(e) => setDish({...dish, description: e.target.value})}
                            placeholder="Enter a description for the dish"
                            className="border px-4 py-2 rounded w-full"
                        />

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {success}
                            </div>
                        )}
                        <button 
                            type="button"
                            onClick={handleAddDish}
                            disabled={createFoodItemMutation.isPending || !userRestaurant}
                            className="bg-[#920728] text-white px-4 py-2 rounded hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer w-32 disabled:opacity-50 disabled:cursor-not-allowed">
                            {createFoodItemMutation.isPending ? "Adding..." : "Add Dish"}
                        </button>
                    </div>
                </div>

                {/*Add Dish and Section */}
                <div className="flex gap-4 justify-center mb-10">
                    <button className="border px-6 py-2 rounded hover:bg-gray-100">Add Dish</button>
                    <button className="border px-6 py-2 rounded hover:bg-gray-100">Add Section</button>
                </div>

                {/* Background */}
                <div className="text-center mb-12">
                    <button className="border px-6 py-2 rounded mb-4 hover:bg-gray-100">
                        Background Color
                    </button>

                    <label className="block border border-gray-300 p-4 rounded cursor-pointer hover:bg-gray-50">
                        Upload background image here
                        <input type="file" className="hidden" />
                    </label>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 border rounded-lg p-6 mb-10">
                    <h3 className="text-xl font-semibold text-center mb-4">
                        Your Contact Information
                    </h3>

                    <div className="grid gap-4">
                        <input
                        value={contact.phone}
                        onChange={(e) =>
                            setContact({ ...contact, phone: e.target.value })
                        }
                        type="text"
                        placeholder="Number"
                        className="border px-4 py-2 rounded"
                        />

                        <input
                        value={contact.email}
                        onChange={(e) =>
                            setContact({ ...contact, email: e.target.value })
                        }
                        type="email"
                        placeholder="Email"
                        className="border px-4 py-2 rounded"
                        />

                        <input
                        value={contact.address}
                        onChange={(e) =>
                            setContact({ ...contact, address: e.target.value })
                        }
                        type="text"
                        placeholder="Address"
                        className="border px-4 py-2 rounded"
                        />
                    </div>
                </div>

                {/* Save / Download */}
                <div className="flex justify-center gap-4 mb-10">
                    <button className="bg-[#920728] text-white px-6 py-2 rounded hover:bg-[#7a0520]">
                        Save Menu
                    </button>
                    <button className="border px-6 py-2 rounded hover:bg-gray-100">
                        Download Menu
                    </button>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="text-center mt-20 mb-12">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="border px-6 py-2 rounded hover:bg-gray-100 mb-6">
                        Top
                    </button>

                    <div className="mt-4">
                        <a href="/restaurant-dashboard" className="text-[#920728] underline">
                        Back to Homepage
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}