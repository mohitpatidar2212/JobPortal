import { useState,useEffect } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

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

  const handleSendOtp = async () => {
    setIsSending(true);
    setTimer(10);

    try {
        const res = await API.post('/send-reset-otp', { email });
        setOtpSent(true);
        setSuccessMsg(res.data.message || 'OTP for reset password sent successfully');
        setErrorMsg('');
    } catch (err) {
        console.log(err);
        setErrorMsg(err.response?.data?.detail || 'Failed to send OTP');
        setSuccessMsg('');
    } 
  };

  const handleVerifyOtp = async () => {
    try {

        const res = await API.post('/verify-reset-otp', { email, otp });
        setOtpVerified(true);
        setSuccessMsg(res.data.message || 'OTP verified successfully');
        setErrorMsg('');
    } catch (err) {
        setErrorMsg(err.response?.data?.detail || 'Invalid OTP');
        setSuccessMsg('');
    }
  };

  const handleResetPassword = async () => {
    try {
        const res = await API.post('/reset-password', {email: email, new_password: newPassword});
        setSuccessMsg(res.data.message || 'Password reset successful redirecting to login');
        setErrorMsg('');
        navigate('/login');

    } catch (err) {
        setErrorMsg(err.response?.data?.detail || 'Failed to reset password');
        setSuccessMsg('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Forgot Password</h2>

        {/* Messages */}
        {errorMsg && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm text-center">{errorMsg}</div>
        )}
        {successMsg && (
            <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-sm text-center">{successMsg}</div>
        )}

        <div className="space-y-4">
            {/* Email */}
            <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          <button
            onClick={handleSendOtp}
            disabled={isSending || !email}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
          >
            {isSending ? `Resend in ${timer}s` : 'Send OTP'}
          </button>

          {/* OTP Input */}
          {otpSent && (
            <>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button
                    onClick={handleVerifyOtp}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
                    disabled={!otp}
                >
                    Verify OTP
                </button>
            </>
          )}

          {/* New Password Input */}
          {otpVerified && (
            <>
                <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                    onClick={handleResetPassword}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
                    disabled={!newPassword}
                >
                    Reset Password
                </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
