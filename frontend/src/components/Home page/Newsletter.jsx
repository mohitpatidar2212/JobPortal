import { useState } from 'react';
import API from '../../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    try {
      const res = await API.post('/subscribe', { email });
      setMessage(res.data.message);
      setTimeout(() => {
        setMessage("")
        setEmail("")
      }, 2000)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Subscription failed.');
      setTimeout(() => {
        setMessage("")
        setEmail("")
      }, 2000)
    }
  };

  return (
    <>
      {message && (
          <div className="fixed top-6 left-1/2 z-50 w-full px-4">
            <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
              <div
                className= "px-6 py-4 rounded-lg shadow-lg text-center max-w-md w-full bg-green-100 text-green-800 border border-green-400">
                <p className="text-sm sm:text-base break-words">{message}</p>
              </div>
            </div>
          </div>
        )}
      <div className="flex flex-wrap items-center justify-between bg-white p-12 rounded-xl shadow-md gap-5 mt-12">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-2">
              Subscribe <br /> Newsletter
            </h2>
            <p className="text-gray-500">
              Help you to get the job faster. Get notified with new openings.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-3 w-full sm:flex-row sm:space-x-4 sm:space-y-0 sm:items-center sm:max-w-lg mx-auto">
            <input
                type="email"
                placeholder="Enter your email address.."
                className="flex-1 w-full outline-none text-gray-700 bg-gray-100 p-3 rounded-full placeholder:text-gray-500 transition duration-300 sm:bg-transparent sm:p-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                onClick={handleSubscribe}
                className="bg-[#222022] text-white text-sm w-full sm:w-auto px-6 py-3 rounded-full hover:bg-black transition duration-200 shadow-md"
            >
                Subscribe
            </button>
          </div>
        </div>
      </>
  );
}
