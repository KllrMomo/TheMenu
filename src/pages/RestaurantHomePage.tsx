import { Link } from "react-router-dom";

export function RestaurantHomePage() { 
    return (
        <div className="px-4 py-6 flex flex-col items-center justify-center relative overflow-hidden">
            <Link to="/create-menu">
                <button className="mb-6 bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                    Create Menu
                </button>
            </Link>
            <Link to="/publish-menu">
                <button className="mb-6 bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                    Publish Menu
                </button>
            </Link>
            <Link to="/reviews-comments">
                <button className="bg-[#920728] text-white px-4 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                    Reviews & Comments
                </button>
            </Link>
        </div>
    )
}