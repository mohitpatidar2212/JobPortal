import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef(null); 
  const buttonRef = useRef(null); 
  const mobileRef = useRef(null);
  const mobileButtonRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, offset: 0, once: true });
  }, []);
  

  useEffect(() => {    
    const updateUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);

      setDropdownVisible(false);
    };

    updateUser();
    window.addEventListener('userChanged', updateUser);

    return () => {
      window.removeEventListener('userChanged', updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  const username = user?.name || user?.email?.split('@')[0] || '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);  
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideMobile = (event) => {
      if (
        mobileRef.current &&
        !mobileRef.current.contains(event.target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutsideMobile);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMobile);
    };
  }, [mobileOpen]);

  return (
<nav className="w-full bg-white shadow px-4 py-3 flex items-center justify-between sticky top-0 z-50">
  {/* Logo */}
  <span className="text-xl font-bold text-indigo-600" data-aos="zoom-in-right">
    JobPortal
  </span>

  {/* Nav Links (hidden on mobile) */}
  <ul className="hidden md:flex space-x-6 text-sm font-medium" data-aos="fade-up">
    {!isHome && (
      <li>
        <NavLink
          to="/"
          className="hover:text-indigo-600 transition-colors duration-300 flex gap-1 items-center"
        >
          <FaArrowLeft size={10} />
          Home
        </NavLink>
      </li>
    )}

    {!user && <p className="font-bold" data-aos="fade-in">Welcome to the JobPortal!</p>}

    {user?.role === "applicant" && (
      <>
        <li>
          <NavLink
            to="/find-jobs"
            className={({ isActive }) =>
              `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300`
            }
          >
            Find Jobs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/job-history"
            className={({ isActive }) =>
              `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300`
            }
          >
            Job History
          </NavLink>
        </li>
      </>
    )}

    {user?.role === "employer" && (
      <>
        <li>
          <NavLink
            to="/job-applicants"
            className={({ isActive }) =>
              `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300`
            }
          >
            Job Applicants
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/post-job"
            className={({ isActive }) =>
              `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300`
            }
          >
            Post Job
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/posted-job"
            className={({ isActive }) =>
              `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300`
            }
          >
            Posted Jobs
          </NavLink>
        </li>
      </>
    )}

    {user?.role === "admin" && (
      <>
        <li>
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300`
            }
          >
            Admin Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-manage-faq"
            className={({ isActive }) =>
              `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300`
            }
          >
            Manage FAQ of Bot
          </NavLink>
        </li>
      </>
    )}
  </ul>

  {/* Right Side Buttons (Desktop) */}
  <ul className="hidden md:flex items-center space-x-4 text-sm font-medium" data-aos="fade-left" ref={buttonRef}>
    {user ? (
      <li className="relative">
        <button
          onClick={() => setDropdownVisible((prev) => !prev)}
          className="flex items-center gap-1 text-indigo-600 font-semibold"
        >
          👋 {username} ▾
        </button>

        {dropdownVisible && (
          <ul ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
            <li>
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </li>
    ) : (
      <>
        <li>
          <NavLink
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 transition hover:underline"
          >
            Login
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/signup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-900 transition"
          >
            Sign Up
          </NavLink>
        </li>
      </>
    )}
  </ul>

  {/* Mobile menu toggle */}
  <button ref={mobileButtonRef} className="md:hidden text-indigo-600 text-2xl" onClick={() => setMobileOpen(prev => !prev)}>
    {mobileOpen ? '✕' : '☰'}
  </button>

  {/* Mobile Drawer */}
  {mobileOpen && (
    <div ref={mobileRef} className="md:hidden absolute top-16 left-0 w-full h-fit bg-white shadow-lg p-4 space-y-4 border-t border-gray-100">
      {/* Links Section */}
      <div className="space-y-3 text-sm font-medium">
        {!isHome && (
          <NavLink
            to="/"
            onClick={() => setMobileOpen(prev => !prev)}
            className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
          >
            ← Home
          </NavLink>
        )}

        {!user && <p className="font-bold block px-4 py-2">Welcome to the JobPortal!</p>}

        {user?.role === "applicant" && (
          <>
            <NavLink
              to="/find-jobs"
              onClick={() => setMobileOpen(prev => !prev)}
              className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
            >
              Find Jobs
            </NavLink>
            <NavLink
              to="/job-history"
              onClick={() => setMobileOpen(prev => !prev)}
              className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
            >
              Job History
            </NavLink>
          </>
        )}

        {user?.role === "employer" && (
          <>
            <NavLink
              to="/job-applicants"
              onClick={() => setMobileOpen(prev => !prev)}
              className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
            >
              Job Applicants
            </NavLink>
            <NavLink
              to="/post-job"
              onClick={() => setMobileOpen(prev => !prev)}
              className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
            >
              Post Job
            </NavLink>
            <NavLink
              to="/posted-job"
              onClick={() => setMobileOpen(prev => !prev)}
              className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
            >
              Posted Jobs
            </NavLink>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <NavLink
              to="/admin-dashboard"
              onClick={() => setMobileOpen(prev => !prev)}
              className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
            >
              Admin Dashboard
            </NavLink>
            <NavLink
              to="/admin-manage-faq"
              onClick={() => setMobileOpen(prev => !prev)}
              className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
            >
              Manage FAQ of Bot
            </NavLink>
          </>
        )}
      </div>

      {/* Mobile Bottom Section (Auth/Profile) */}
      <div className="pt-4 border-t">
        {user ? (
          <>
            <p className="font-semibold text-indigo-600 block px-4 py-2">👋 {username}</p>
            <button
              onClick={() => { navigate("/profile"); setMobileOpen(prev => !prev); }}
              className="block w-full text-left mt-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-800 transition"
            >
              Profile
            </button>
            <button
              onClick={() => { setMobileOpen(prev => !prev); handleLogout(); }}
              className="block w-full text-left mt-2 px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-800 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              onClick={() => setMobileOpen(prev => !prev)}
              className="block w-full text-left px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded transition"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              onClick={() => setMobileOpen(prev => !prev)}
              className="block w-full text-left mt-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition"
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </div>
  )}
</nav>


  );
}
