import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCreateRestaurant, useSignup } from "../../services/query-hooks/mutations";
import { QUERY_KEYS } from "../../services/query-hooks/query-keys";
import { isLoading as checkLoading, handleAuthError, storeAuthData } from "../../services/utils";

export function RestaurantSignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const createRestaurantMutation = useCreateRestaurant();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // First, create the user account
      const authResponse = await signupMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
      });

      storeAuthData(authResponse, "restaurant");

      // Then, create the restaurant
      await createRestaurantMutation.mutateAsync({
        name: restaurantName,
        address,
      });

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RESTAURANTS] });

      // Navigate to restaurant dashboard
      navigate("/restaurant-dashboard");
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

  const isLoading = checkLoading(signupMutation.isPending, createRestaurantMutation.isPending);

  return (
    <div className="px-4 py-6">
      <br />
      <br />
      <h1 className="text-5xl md:text-6xl font-bold text-gray-800 text-center mb-12">
        Hello! Register your
        <br />
        Restaurant.
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-6 center mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer"
        />
        <input
          type="text"
          placeholder="Restaurant Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium cursor-pointer"
        />

        <div className="flex justify-center gap-8 mt-6">
          <Link to="/restaurant-login">
            <button
              type="button"
              className="bg-gray-500 text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-gray-600 transition font-medium cursor-pointer">
              Back to Log In
            </button>
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#920728] text-white px-12 py-4 rounded-2xl text-xl shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Registering..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
