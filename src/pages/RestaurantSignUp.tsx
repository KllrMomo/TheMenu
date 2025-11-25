import { Link } from "react-router-dom";

export function RestaurantSignUp() {
    return (
        <div className="px-4 py-6">
            <br /><br />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 text-center mb-12">
                Hello! Register your<br />Restaurant.
            </h1>
            <form className="w-full max-w-xl flex flex-col gap-6 center mx-auto">
                <input
                    type="text"
                    placeholder="Restaurant Name"
                    className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer" />
                <input
                    type="text"
                    placeholder="Address"
                    className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer" />
                <input
                    type="number"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer" />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer" />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer" />

                <div className="flex justify-center gap-8 mt-6">
                    <Link to="/restaurant-dashboard">
                        <button type="submit" className="bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                            Submit
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    )
}