import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const displayName =
    user?.user_metadata?.user_name || user?.email || "User";

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            Post<span className="text-purple-500">ly</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to="/create"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Create Post
                </Link>

                <Link
                  to="/communities"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Communities
                </Link>

                <Link
                  to="/community/create"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Create Community
                </Link>
              </>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <span className="text-gray-300">{displayName}</span>

                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">

            <Link
              to="/"
              onClick={closeMenu}
              className="block px-3 py-2 text-gray-300 hover:text-white"
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to="/create"
                  onClick={closeMenu}
                  className="block px-3 py-2 text-gray-300 hover:text-white"
                >
                  Create Post
                </Link>

                <Link
                  to="/communities"
                  onClick={closeMenu}
                  className="block px-3 py-2 text-gray-300 hover:text-white"
                >
                  Communities
                </Link>

                <Link
                  to="/community/create"
                  onClick={closeMenu}
                  className="block px-3 py-2 text-gray-300 hover:text-white"
                >
                  Create Community
                </Link>
              </>
            )}

            {user ? (
              <button
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
                className="block w-full text-left px-3 py-2 text-red-400"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block px-3 py-2 text-blue-400"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;