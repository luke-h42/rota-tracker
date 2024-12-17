import toast from "react-hot-toast";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom"; // Use NavLink instead of Link
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../../context/userContext";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);
  const buttonRef = useRef(null);
  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setIsLoading(false);
      toast.success("Signed out");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center bg-white sticky top-0 z-10 w-full min-h-16 ">
      <div className="flex w-full px-8 py-2 items-center justify-between  container mx-auto max-w-screen-xl ">
        {/* Logo Section */}
        <div className="flex space-x-12 items-center ">
          <NavLink to="" className="text-xl">
            Logo
          </NavLink>
        </div>
        {/* Mobile menu button  */}

        <button
          type="button"
          className="inline-flex items-center p-2 w-14 h-14 justify-center text-sm text-royal-blue-500 rounded-lg md:hidden hover:text-primary400"
          ref={buttonRef}
          aria-controls="navbar-sticky"
          aria-expanded={mobileMenu ? "true" : "false"}
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
            width="34"
            height="28"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        {/* Mobile Menu */}
        <div
          className={`${
            mobileMenu ? "block" : "hidden"
          } md:hidden fixed top-0 left-0 right-0 bg-royal-blue-500 text-white rounded-lg p-4 m-2 z-50 mt-16`}
          ref={navRef}
        >
          {!user || user.role === null ? (
            <>
              <NavLink
                to="/login"
                className="block text-xl py-2"
                onClick={() => setMobileMenu(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/get-started"
                className="block text-xl py-2"
                onClick={() => setMobileMenu(false)}
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className="block text-xl py-2"
                onClick={() => setMobileMenu(false)}
              >
                Dashboard
              </NavLink>
              {(user.role === "admin" || user.role === "owner") && (
                <>
                  <NavLink
                    to="/admin"
                    className="block text-xl py-2"
                    onClick={() => setMobileMenu(false)}
                  >
                    Admin
                  </NavLink>
                </>
              )}

              {user.role === "owner" && (
                <>
                  <NavLink
                    to="/register-company"
                    className="block text-xl py-2"
                    onClick={() => setMobileMenu(false)}
                  >
                    Register New Company
                  </NavLink>
                  <NavLink
                    to="/register-new-admin"
                    className="block text-xl py-2"
                    onClick={() => setMobileMenu(false)}
                  >
                    Register New Admin
                  </NavLink>
                </>
              )}
              <NavLink
                to="/settings"
                className="block text-xl py-2"
                onClick={() => setMobileMenu(false)}
              >
                Settings
              </NavLink>
              <button
                className="block text-xl py-2"
                onClick={() => {
                  handleSignOut();
                  setMobileMenu(false);
                }}
                disabled={isLoading}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12 items-center">
          {!user || user.role === null ? (
            <>
              <div className="flex space-x-12 items-center ">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:transition after:duration-300 after:origin-center ${
                      isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/get-started"
                  className={({ isActive }) =>
                    `relative bg-royal-blue-500 text-white px-8 py-2 rounded-2xl text-xl w-fit block hover:bg-royal-blue-600 shadow-xl`
                  }
                >
                  Get Started
                </NavLink>
              </div>
              {/* <NavLink
              to="/register"
              className={({ isActive }) =>
                `relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-white after:w-full after:scale-x-0 after:transition after:duration-300 after:origin-center ${
                  isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
                }`
              }
            >
              Register
            </NavLink> */}
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:transition after:duration-300 after:origin-center ${
                    isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
                  }`
                }
              >
                Dashboard
              </NavLink>
              {(user.role === "admin" || user.role === "owner") && (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:transition after:duration-300 after:origin-center ${
                        isActive
                          ? "after:scale-x-100"
                          : "hover:after:scale-x-100"
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                </>
              )}
              {user.role === "owner" && (
                <>
                  <NavLink
                    to="/register-company"
                    className={({ isActive }) =>
                      `relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:transition after:duration-300 after:origin-center ${
                        isActive
                          ? "after:scale-x-100"
                          : "hover:after:scale-x-100"
                      }`
                    }
                  >
                    Register New Company
                  </NavLink>
                  <NavLink
                    to="/register-new-admin"
                    className={({ isActive }) =>
                      `relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:transition after:duration-300 after:origin-center ${
                        isActive
                          ? "after:scale-x-100"
                          : "hover:after:scale-x-100"
                      }`
                    }
                  >
                    Register New Admin
                  </NavLink>
                </>
              )}
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:transition after:duration-300 after:origin-center ${
                    isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
                  }`
                }
              >
                Settings
              </NavLink>
              <button
                className={`relative text-xl  ${
                  isLoading ? "cursor-not-allowed" : ""
                } after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:transition after:duration-300 after:origin-center hover:after:scale-x-100`}
                onClick={() => {
                  handleSignOut();
                  setMobileMenu(false);
                }}
                disabled={isLoading}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
