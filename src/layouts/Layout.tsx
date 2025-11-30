import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useCurrentUser } from "../services/query-hooks/queries";
import {
  getAccountType,
  getGreeting,
  getGreetingPhrase,
  getUsername,
  handleLogout as handleLogoutUtil,
  isLoggedIn,
} from "../services/utils";

export function Layout() {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const accountType = getAccountType();
  const loggedIn = isLoggedIn();
  const username = getUsername(currentUser);
  const pfp = localStorage.getItem("pfp") || "https://i.imgur.com/4ZQZ4pD.png";
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    handleLogoutUtil(queryClient, navigate);
    setOpenMenu(false);
  };

  const greeting = getGreeting(accountType);
  const greetingPhrase = getGreetingPhrase(accountType);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="w-full bg-[#920728] py-4 relative z-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
          {/* Logo */}
          <Link to="/">
            <img
              src="/src/assets/images/logo.png"
              alt="The Menu Logo"
              className="h-28 w-28 object-contain rounded-full"
            />
          </Link>

          {/* Center Text */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-white font-semibold text-lg mb-2 drop-shadow">{greeting}</span>
            <span className="text-white font-bold text-3xl drop-shadow">{greetingPhrase}</span>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            {/* About Us — SIEMPRE visible */}
            <Link to="/about-us" className="text-white text-lg hover:underline">
              About us
            </Link>

            {/* Divider */}
            <div className="h-6 w-px bg-white"></div>

            {/* If NOT logged in — show login */}
            {!loggedIn ? (
              <>
                <Link to="/user" className="text-white text-lg hover:underline">
                  Log In
                </Link>
              </>
            ) : (
              /* If logged in — show avatar dropdown */
              <div className="relative" ref={dropdownRef}>
                <img
                  src={pfp}
                  className="w-12 h-12 rounded-full border-2 border-white cursor-pointer"
                  onClick={() => setOpenMenu(!openMenu)}
                />

                {openMenu && (
                  <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-lg py-2 animate-fadeIn">
                    <p className="px-4 py-2 text-gray-700 font-semibold border-b">{username}</p>

                    {/* Restaurant options */}
                    {accountType === "restaurant" && (
                      <>
                        <Link
                          to="/restaurant-dashboard"
                          className="block px-4 py-2 hover:bg-gray-100">
                          Dashboard
                        </Link>
                      </>
                    )}

                    {/* Shared options */}
                    <Link to="/restaurant-profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Outlet */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}
