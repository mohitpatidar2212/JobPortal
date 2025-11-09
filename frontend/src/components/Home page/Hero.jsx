import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Hero() {

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

    const handleFindJob = () => {
      if(!user) {
        navigate("/login")
      }
      else if (user.role == "applicant") {
        navigate("/find-jobs")
      }
    }
    
    return (
      <section className="bg-gradient-to-br from-[#1d1d4c] via-[#0d0d20] to-[#330145] font-poppins text-white p-10 rounded-b-[50px] relative overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Get a <span className="text-purple-400">Job</span> that’s Perfect <br />
          for <span className="text-purple-500">You</span>
        </h1>
        <button className="bg-white text-black px-6 py-2 rounded-full font-semibold" onClick={handleFindJob}>Find Job</button>
        <p className="mt-4 text-gray-300 max-w-lg">
          Be found! Put your CV in front of great employers.
        </p>
        <div className="absolute top-10 right-10">
          {/* You can add hero images here with <img src="" /> */}
        </div>
      </section>
    );
  }
  