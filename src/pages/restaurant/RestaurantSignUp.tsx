import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSignup } from "../../services/query-hooks/mutations";
import { isLoading as checkLoading, handleAuthError, storeAuthData } from "../../services/utils";

export function RestaurantSignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signupMutation = useSignup();

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

      // Store auth data (validates token and ensures it's stored before proceeding)
      storeAuthData(authResponse, "restaurant");

      // Verify token is available before making authenticated requests
      // This ensures no race condition occurs
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token was not stored correctly");
      }

      // Navigate to restaurant profile page to create restaurant
      // This avoids asking for restaurant info twice (once in signup, once in create)
      navigate("/restaurant-profile");
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

  const isLoading = checkLoading(signupMutation.isPending);

  return (
    <div className="px-4 py-6">
      <br />
      <br />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
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
