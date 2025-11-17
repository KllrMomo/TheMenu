import { Link } from "react-router-dom";

export function User() {
  return (
    <div className="px-4 py-6">
        {/* BACKGROUND IMAGE */}
        <img src="src/assets/images/back.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-100 z-0 pointer-events-none select-none" style={{ minHeight: '100%' }} />

        <br /><br /><br /><br /><br /><br /><br />

        {/* BUTTONS */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
            
            <Link to="/customer-login" className="text-white text-lg hover:underline">
                <button className="w-64 py-3 mb-6 bg-[#920728] text-white text-lg rounded-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                    Customer Log-In
                </button>
            </Link>
            
            <Link to="/restaurant-login" className="text-white text-lg hover:underline">
                <button className="w-64 py-3 mb-6 bg-[#920728] text-white text-lg rounded-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer">
                    Restaurant Log-In
                </button>
            </Link>

        </div>
    </div>
  )
}