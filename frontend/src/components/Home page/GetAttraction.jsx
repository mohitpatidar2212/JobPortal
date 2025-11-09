import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CallToAction() {

  const navigate = useNavigate();
    let user = null;
  
    useEffect(() => {
        const updateUser = () => {
          const storedUser = localStorage.getItem('user');
          user = storedUser ? JSON.parse(storedUser) : null;
        };
    
        updateUser(); 
        window.addEventListener('userChanged', updateUser);
    
        return () => {
          window.removeEventListener('userChanged', updateUser);
        };
      }, []);
  
      const handleGetStarted = () => {
        if(!user) {
          navigate("/login")
        }
        else if (user.role == "applicant") {
          navigate("/find-jobs")
        }
        else if (user.role == "employer") {
          navigate("/job-applicants")
        }
      }

    return (
      <div className="bg-gradient-to-br from-[#1d1d4c] via-[#0d0d20] to-[#330145] text-white text-center p-10 rounded-b-[50px]">
        <h2 className="text-3xl font-bold mb-4">Millions of jobs. Find the one that’s <span className="text-pink-400">right for you.</span></h2>
        <button className="bg-white text-black px-6 py-2 rounded-full font-semibold" onClick={handleGetStarted}>Get Started Now</button>
      </div>
    );
  }
  