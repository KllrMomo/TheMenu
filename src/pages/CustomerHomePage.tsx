import { Link } from "react-router-dom";

export function CustomerHomePage() {
    const recentlyViewed = [
        { id: 1, name: "The Bear", description: "Italian Cuisine" },
        { id: 2, name: "Restaurant B", description: "Sushi and More" },
        { id: 3, name: "Restaurant C", description: "Vegan Delights" },
    ];

    const recommendedForYou = [
        { id: 4, name: "Restaurant D", description: "Mexican Flavors" },
        { id: 5, name: "Restaurant E", description: "French Bistro" },
        { id: 6, name: "Restaurant F", description: "BBQ Specials" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="text-xl md:text-4xl font-bold text-gray-800 text-center mb-12">
                Welcome back, <br /> <span className="text-[#920728] md:text-5xl mb-14">USERNAME</span>
            </h2>

            {/* Recently Viewed */}
            <h2 className="font-semibold text-lg mb-4 text-gray-800"> Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {recentlyViewed.map((restaurant) => (
                    <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                            <p className="text-gray-700">{restaurant.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recommended For You */}
            <h2 className="font-semibold text-lg mb-4 text-gray-800"> Recommended For You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recommendedForYou.map((restaurant) => (
                    <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                            <p className="text-gray-700">{restaurant.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}