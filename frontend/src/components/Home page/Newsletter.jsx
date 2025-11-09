import { useState } from 'react';
import API from '../../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    try {
      const res = await API.post('http://localhost:8000/subscribe', { email });
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
    <div className="flex flex-wrap items-center justify-between bg-white p-12 rounded-xl shadow-md gap-5">

      <div className="max-w-md">
        <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-2">
          Subscribe <br /> Newsletter
        </h2>
        <p className="text-gray-500">Help you to get the job faster. Get notified with a new openings.</p>
      </div>

      <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center space-x-4">
        <input
          type="email"
          placeholder="Enter your email address.."
          className="flex-1 outline-none text-gray-700 bg-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSubscribe}
          className="bg-[#222022] text-white text-sm px-6 py-2 rounded-full hover:bg-[#000000]"
        >
          Subscribe
        </button>
      </div>
      
    </div>
  );
}
