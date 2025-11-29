import { useState, useEffect } from "react";
import { useCurrentUser, useRestaurants } from "../../services/query-hooks/queries";
import { findRestaurantByOwner, initializeRestaurantForm, isLoading as checkLoading, createImagePreviewUrl } from "../../services/utils";

export function RestaurantProfile() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useRestaurants();

  const userRestaurant = findRestaurantByOwner(restaurants, currentUser?.userId);

  const [logo, setLogo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Inputs
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Initialize form with restaurant data
  useEffect(() => {
    const formData = initializeRestaurantForm(userRestaurant, currentUser);
    setRestaurantName(formData.restaurantName);
    setAddress(formData.address);
    setEmail(formData.email);
  }, [userRestaurant, currentUser]);

  if (checkLoading(isLoadingUser, isLoadingRestaurants)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogo(createImagePreviewUrl(file));
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">

      <div className="w-full max-w-6xl mt-10">
        <div className="flex flex-col md:flex-row gap-10">

          {/* Image Upload */}
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="w-50 h-50 bg-gray-300 rounded-md overflow-hidden flex items-center justify-center">
              {logo ? (
                <img src={logo} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600">Logo Preview</span>
              )}
            </div>

            <label className="mt-4 w-full">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />

              <div className="cursor-pointer w-full text-center py-2 border rounded-md font-medium bg-[#920728] text-white hover:bg-[#eae4e4] hover:text-[#920728]">
                Upload Logo
              </div>
            </label>
          </div>

          {/* RIGHT SIDE — FORM */}
          <div className="w-full md:w-2/3">

            {/* Restaurant Name */}
            <label className="font-semibold">Restaurant Name:</label>
            <input
              className="w-full mt-1 mb-4 p-2 border rounded-md"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />

            {/* Address */}
            <label className="font-semibold">Address:</label>
            <input
              className="w-full mt-1 mb-4 p-2 border rounded-md"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Phone + Email — side by side */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="font-semibold">Phone Number:</label>
                <input
                  className="w-full mt-1 mb-4 p-2 border rounded-md"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="font-semibold">Email:</label>
                <input
                  className="w-full mt-1 mb-4 p-2 border rounded-md"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <label className="font-semibold">Password:</label>
            <div className="relative">
              <input
                className="w-full mt-1 mb-4 p-2 border rounded-md pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Eye Icon */}
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => {
              // Note: Update restaurant functionality requires a hook that doesn't exist yet
              alert("Update restaurant functionality requires an update restaurant API endpoint and hook. See documentation for missing features.");
            }}
            className="px-6 py-2 border rounded-md font-medium bg-[#920728] text-white hover:bg-[#eae4e4] hover:text-[#920728]"
          >
            Save Changes
          </button>

          <button
            className="px-6 py-2 border rounded-md font-medium bg-[#920728] text-white hover:bg-[#eae4e4] hover:text-[#920728]"
          >
            Cancel Changes
          </button>
        </div>
      </div>
    </div>
  );
}
