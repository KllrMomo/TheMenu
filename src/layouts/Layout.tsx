import { Outlet, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react';

export function Layout() { 
  const accountType = "restaurant"; // This should be dynamically set based on user data
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username') || 'User';
  const pfp = localStorage.getItem('pfp') || 'https://i.imgur.com/4ZQZ4pD.png';

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

  let greeting =
    accountType === 'restaurant'
      ? 'Hello Restaurant Owner!'
      : 'Hello Customer!';

  let greetingPhrase;
  if (accountType === 'restaurant') {
    greetingPhrase = 'Your customers are ready to order';
  } else {
    greetingPhrase = 'What would you like to order?';
  }

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
            <span className="text-white font-semibold text-lg mb-2 drop-shadow">
              {greeting}
            </span>
            <span className="text-white font-bold text-3xl drop-shadow">
              {greetingPhrase}
            </span>
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
            {!isLoggedIn ? (
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
                    <p className="px-4 py-2 text-gray-700 font-semibold border-b">
                      {username}
                    </p>

                    {/* Restaurant options */}
                    {accountType === "restaurant" && (
                      <>
                        <Link
                          to="/restaurant-dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </>
                    )}

                    {/* Shared options */}
                    <Link
                      to="/user"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Settings
                    </Link>

                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
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
