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

  const dropdownRef = useRef(null); 
  const buttonRef = useRef(null); 

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

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow overflow-visible ">
      <span className="text-xl font-bold text-indigo-600" data-aos="zoom-in-right">JobPortal</span>
      
      <ul className="flex space-x-6 text-sm font-medium" data-aos="fade-up">
        {!isHome && (
          <li>
            <NavLink to="/" className="hover:text-indigo-600 transition-colors duration-300 flex gap-1 items-center">
              <FaArrowLeft size={10} /> 
              Home
            </NavLink>
          </li>
        )}
        {!user && (
          <p className="font-bold" data-aos="fade-in"> Welcome to the JobPortal! </p>
        )}

        {user?.role === 'applicant' && (
          <>
            <li>
                <NavLink to="/find-jobs" className={({isActive}) => `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300 `}>
                Find Jobs
              </NavLink>
            </li>
            <li>
              <NavLink to="/job-history" className={({isActive}) => `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300 `}>
                Job History
              </NavLink>
            </li>
          </>
        )}

        {user?.role === 'employer' && (
          <>
            <li>
              <NavLink to="/job-applicants" className={({isActive}) => `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300 `}>
                Job Applicants
              </NavLink>
            </li>
            <li>
              <NavLink to="/post-job" className={({isActive}) => `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300 `}>
                Post Job
              </NavLink>
            </li>
            <li>
              <NavLink to="/posted-job" className={({isActive}) => `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300 `}>
                Posted Jobs
              </NavLink>
            </li>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <li>
              <NavLink to="/admin-dashboard" className={({isActive}) => `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300 `}>
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin-manage-faq" className={({isActive}) => `${isActive ? "text-indigo-600" : ""} hover:text-indigo-600 transition-colors duration-300 `}>
                Manage FAQ of Bot
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <ul className="flex items-center space-x-4 text-sm font-medium z-50" data-aos="fade-left" ref={buttonRef}>
        {user ? (
          <>
            <li className="relative">
              <button 
                onClick={() => {
                  setDropdownVisible(prev => !prev);
                }}
                className="flex items-center gap-1 text-indigo-600 font-semibold focus:outline-none"
              >
                👋 {username} ▾
              </button>
              {dropdownVisible && (
                <ul ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                  <li>
                    <button
                      onClick={() => navigate('/profile')}
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
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className="text-indigo-600 hover:text-indigo-800 transition hover:underline">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-900 transition">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
