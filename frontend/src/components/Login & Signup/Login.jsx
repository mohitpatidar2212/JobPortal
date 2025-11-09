import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from '../../services/api'; 

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => { 
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await API.post('/login', formData);
      setSuccessMsg('Login successful!');
      
      // Store token or user info 
      localStorage.setItem('user', JSON.stringify(response.data));
      const user = response.data;
      localStorage.setItem('token', response.data.access_token); 
      window.dispatchEvent(new Event('userChanged')); 

      setTimeout(() => navigate('/'), 1000);

    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Login failed');
      setTimeout(() => {
        setErrorMsg('');
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Login to JobPortal</h2>

        {/* Feedback messages */}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center text-sm">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-center text-sm">
            {successMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}  
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
            </div>
          </div>

          <div className="text-right text-sm mt-1">
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:underline hover:text-indigo-800"
            >
              Forgot Password?
            </Link>
          </div>


          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-600 hover:underline hover:text-indigo-800"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
