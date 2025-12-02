import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUpdateUser } from "../../services/query-hooks/mutations";
import { useCurrentUser } from "../../services/query-hooks/queries";
import { isLoading as checkLoading, handleAuthError } from "../../services/utils";

export function EditCustomerInfo() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const updateUserMutation = useUpdateUser();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateUserMutation.mutateAsync({
        firstName,
        lastName,
        email,
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate("/customer-dashboard");
      }, 1500);
    } catch (err) {
      setError(handleAuthError(err));
    }
  };

  const handleCancel = () => {
    navigate("/customer-dashboard");
  };

  if (checkLoading(isLoadingUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* BACKGROUND IMAGE */}
      <img
        src="src\\assets\\images\\background.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-100 z-0 pointer-events-none select-none"
        style={{ minHeight: "100%" }}
      />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#920728] transition font-medium"
          />
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-8 py-3 rounded-2xl text-lg shadow-md hover:bg-gray-600 transition font-medium cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="bg-[#920728] text-white px-8 py-3 rounded-2xl text-lg shadow-md hover:bg-[#eae4e4] hover:text-[#920728] transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="text-center mt-6">
        <Link to="/customer-dashboard" className="text-[#920728] underline hover:text-[#6e0520]">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
