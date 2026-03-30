import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContextValue";
function Navbar() {
  const useAuth = () => useContext(AuthContext);
  const { isAuthenticated, logout, username, userEmail } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const isHomePage = location.pathname === "/";
  const showSolidNavbar = scrolled || !isHomePage;
  const profileName = username || userEmail || "User";
  const profileSubText = userEmail || username || "Member";
  const profileInitial = profileName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //closes the mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "About", path: "/about" },
  ];
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        showSolidNavbar ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold transition-transform hover:scale-105"
          >
            <span className="text-blue-600">Drive</span>
            <span className={showSolidNavbar ? "text-gray-900" : "text-white"}>
              Luxe
            </span>
          </Link>
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={`font-medium transition-all duration-200 hover:text-blue-600 ${
                  location.pathname === link.path
                    ? "text-blue-600"
                    : showSolidNavbar
                    ? "text-gray-800"
                    : "text-white"
                }`}
              >
                {link.name}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className={`flex items-center gap-3 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                    showSolidNavbar
                      ? "border border-gray-200 bg-white"
                      : "border border-white/25 bg-white/10 backdrop-blur-md"
                  }`}
                  type="button"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {profileInitial}
                  </div>
                  <div className="text-left leading-tight max-w-[170px]">
                    <p className={`text-sm font-semibold truncate ${showSolidNavbar ? "text-gray-900" : "text-white"}`}>{profileName}</p>
                    <p className={`text-xs truncate ${showSolidNavbar ? "text-gray-500" : "text-blue-100"}`}>{profileSubText}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showSolidNavbar ? "text-gray-500" : "text-blue-100"
                    } ${isProfileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <div
                  className={`absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl shadow-xl p-2 z-50 origin-top-right transform transition-all duration-200 ${
                    isProfileOpen
                      ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                      : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                  }`}
                >
                  
                  <Link
                    to="/mybookings"
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/booking"
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Book Now
                  </Link>
                  <div className="my-1 h-px bg-gray-100"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <NavLink
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1"
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
          {/* Mobile toggle menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden focus:outline-none cursor-pointer p-2 rounded-md transition-colors ${
              showSolidNavbar ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/15"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 ${showSolidNavbar ? "text-gray-900" : "text-white"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-3 bg-white p-3 sm:p-4 transition-all duration-500 ease-in rounded-xl shadow-lg border border-gray-100 slide-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`font-medium px-4 py-2.5 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {profileInitial}
                    </div>
                    <div className="leading-tight min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{profileName}</p>
                      <p className="text-xs text-gray-500 truncate">{profileSubText}</p>
                    </div>
                  </div>
                  <NavLink
                    to="/mybookings"
                    className="block w-full text-center bg-gray-100 text-gray-800 px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-gray-200"
                  >
                    My Bookings
                  </NavLink>
                  <NavLink
                    to="/booking"
                    className="block w-full text-center bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-blue-700"
                  >
                    Book Now
                  </NavLink>
                  <button
                    onClick={logout}
                    className="w-full bg-red-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-red-700 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <NavLink
                    to="/login"
                    className="block w-full text-center bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-blue-700"
                  >
                    Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
