import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from '../../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [role, setRole] = useState('applicant');
  const [showPassword, setShowPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);
 
  const [resume, setResume] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    position: '',
    location: '',
    skills: '',
    mobileNo: '',
  });

  const handleOtpChange = (e) => {
    setOtp(e.target.value);  
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSending(true);
    setTimer(10);

    const payload = { email: formData.email }

    try {
      const response = await API.post('/send-otp', payload);

      setMessage('Otp is sent to your email');
      setMessageType('success')
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Error in sending otp :', err.response?.data || err.message);
      setMessage('Error in sending otp. Try again');
      setMessageType('error')
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsSending(false);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');

    const payload = { email: formData.email, otp: otp }
    try {
      const response = await API.post('/verify-otp', payload);
      setMessage(response.data?.message || "Otp verified successfully !");
      setMessageType('success')
      setEmailVerified(true)
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error('Error in sending otp :', err.response?.data || err.message);
      setMessage(err.response?.detail || "Otp not verified");
      setMessageType('error')
      setTimeout(() => setMessage(""), 3000);
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    let skills = null;
    if (role === 'applicant' && formData.skills) {
      skills = formData.skills.split(',').map(s => s.trim());
    }

    const payload = {
      role,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      companyName: role === 'employer' ? formData.companyName : null,
      position: role === 'applicant' ? formData.position : null,
      location: role === 'applicant' ? formData.location : null,
      skills: skills ? JSON.stringify(skills) : null,
      mobileNo: formData.mobileNo,
      resume: role === 'applicant' ? resume : null,
    };

    console.log(payload)

    try {
      const response = await API.post('/signup', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Signup successful! Redirecting to homepage...');
      setMessageType('success')
      setTimeout(() => {
        navigate('/');
        setMessage('')
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setMessage(
        err.response?.data?.detail || 'Signup failed. Please try again.'
      );
      setMessageType('error')
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <>
      {message && (
        <div className="fixed top-6 left-1/2 z-50">
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className={`px-6 py-4 rounded shadow-lg text-center max-w-md w-full ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border border-green-400"
                  : "bg-red-100 text-red-800 border border-red-400"
              }`}
            >
              <p>{message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="bg-white rounded-2xl p-8 shadow-md w-full max-w-md mt-5 mb-5">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Sign Up</h2>

          <div className="flex justify-center mb-6 space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                role === 'applicant'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setRole('applicant')}
            >
              Applicant
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                role === 'employer'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setRole('employer')}
            >
              Employer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {role === 'employer' && (
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            )}

            {role === 'applicant' && (
              <>
                <input
                  type="text"
                  name="position"
                  placeholder="Job Role / Position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                <input
                  type="text"
                  name="skills"
                  placeholder="Skills (comma separated)"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Upload Resume (PDF only)</span>
                  <input
                    type="file"
                    name="resume"
                    accept="application/pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                    required
                    className="mt-2 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                              file:rounded-lg file:border-0 file:text-sm file:font-semibold
                              file:bg-indigo-600 file:text-white
                              hover:file:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
              </>              
            )}
            
            <input
              type="tel"
              name="mobileNo"
              placeholder="Enter Mobile Number"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <div className=" flex items-center space-x-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className=" flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <button 
                onClick={handleSendOtp} 
                disabled={isSending}
                className=" max-w-fit bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {isSending ? `Resend in ${timer}s` : 'Send OTP'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <button 
                onClick={handleVerifyOtp} 
                className="max-w-fit bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Verify OTP
              </button>
            </div>

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
            
            {emailVerified ? <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
            >
              Create Account
            </button> : <p className=" text-center font-semibold">Verify your email to signup</p>
            }
            
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline hover:text-indigo-800"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
