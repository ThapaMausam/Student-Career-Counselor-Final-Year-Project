import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useApp } from "../contexts/AppContext";

const Navbar = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  const { user, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ne" : "en");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-2xl sticky top-0 z-50 border-b-4 border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="ml-3 hidden sm:block">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {language === "en"
                    ? "Student Career Counsellor"
                    : "विद्यार्थी करियर परामर्शक"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:block ml-12">
              <div className="flex space-x-2">
                <Link
                  to="/"
                  className="text-white hover:bg-blue-400 hover:bg-opacity-20 px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 hover:scale-105"
                >
                  {t("navbar.home")}
                </Link>
                {/* Analytics and Data Viewer links removed for privacy/defense requirements */}
                <Link
                  to="/model-info"
                  className="text-white hover:bg-blue-400 hover:bg-opacity-20 px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 hover:scale-105"
                >
                  {t("navbar.modelInfo")}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-5 py-2.5 rounded-lg bg-black text-white text-base font-semibold hover:bg-opacity-30 transition-all duration-200 border-2 border-white border-opacity-30 hover:border-opacity-50 hover:scale-105 backdrop-blur-sm"
              title={
                language === "en"
                  ? "Switch to Nepali"
                  : "अंग्रेजीमा स्विच गर्नुहोस्"
              }
            >
              <span className="flex items-center space-x-2">
                <span>{language === "en" ? "नेपाली" : "English"}</span>
              </span>
            </button>

            {/* Login/Dashboard Button */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 text-base font-bold hover:shadow-2xl transition-all duration-200 hover:scale-105 transform hover:-translate-y-0.5 items-center space-x-2"
                >
                  <span>{t("navbar.dashboard")}</span>
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {t("navbar.logout")}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex px-6 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-base font-bold hover:shadow-2xl transition-all duration-200 hover:scale-105 transform hover:-translate-y-0.5 items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t("navbar.login")}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-3 rounded-lg text-base font-semibold transition-colors"
              >
                {t("navbar.home")}
              </Link>
              {/* Analytics and Data Viewer menu items removed */}
              <Link
                to="/model-info"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-3 rounded-lg text-base font-semibold transition-colors"
              >
                {t("navbar.modelInfo")}
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="sm:hidden text-center px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-base font-bold hover:shadow-lg transition-all"
              >
                {t("navbar.login")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
