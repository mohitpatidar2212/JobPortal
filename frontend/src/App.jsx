import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from './components/Home page/Navbar';
import Footer from './components/Home page/Footer';
import HomePage from './components/Home page/HomePage';

import Login from './components/Login & Signup/Login';
import Signup from './components/Login & Signup/Signup';
import ForgotPassword from './components/Login & Signup/ForgotPassword';

import JobApplicants from './components/Employer/JobApplicants';
import PostJob from './components/Employer/PostJob';
import PostedJobs from './components/Employer/PostedJobs';
import EditJob from './components/Employer/EditJob';

import FindJobs from './components/Applicant/FindJobs';
import JobHistory from './components/Applicant/JobHistory';

import AdminDashboard from './components/Admin/AdminDashboard';
import AdminFAQManager from './components/Admin/AdminFAQManager';

import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Applicant/Profile';
import EditProfile from './components/Applicant/EditProfile';
import Chatbot from './components/Chatbot';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateUser(); 
    window.addEventListener('userChanged', updateUser);

    return () => {
      window.removeEventListener('userChanged', updateUser);
    };
  }, []);
  

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HomePage />
          </>
        } />

        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </>
        )}

        <Route element={<ProtectedRoute />}>

          {user && (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              {user.role === "applicant" && (
                <>
                  <Route path="/find-jobs" element={<FindJobs />} />
                  <Route path="/job-history" element={<JobHistory />} />
                </>
              )}

              {user.role === "employer" && (
                <>
                  <Route path="/job-applicants" element={<JobApplicants />} />
                  <Route path="/post-job" element={<PostJob />} />
                  <Route path="/posted-job" element={<PostedJobs />} />
                  <Route path="/edit-job/:id" element={<EditJob />} />
                </>
              )}

              {user.role === "admin" && (
                <>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin-manage-faq" element={<AdminFAQManager />} />
                </>
              )}
            </>
          )}

          <Route path="*" element={<Navigate to={"/"} />} />

        </Route>
      </Routes>
      <Chatbot />
      <Footer />
    </Router>
  );
}
