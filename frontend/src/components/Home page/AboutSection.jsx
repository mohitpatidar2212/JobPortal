import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/about section img.jpg"

export default function AboutSection() {

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
      <section className="px-6 py-16 flex flex-col md:flex-row items-center gap-8 bg-white">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">Find a new job and build career</h3>
          <p className="text-gray-600 mb-4">
            Some of the companies we’ve helped recruit excellent applicants over the years.
          </p>

          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-3 w-full sm:flex-row sm:space-x-4 sm:space-y-0 sm:items-center sm:max-w-lg mx-auto">
            <input
              className="flex-1 w-full outline-none text-gray-700 bg-gray-100 p-3 rounded-full placeholder:text-gray-500 transition duration-300 sm:bg-transparent sm:p-0"
              placeholder="Search here..."
            />

            <button
              onClick={handleFindJob}
              className="bg-[#222022] text-white text-sm px-6 py-2 rounded-2xl hover:bg-black shadow-xl"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={img}
            alt="Career"
            className="rounded-xl object-cover w-full max-w-md h-60 md:h-56"
          />
        </div>
      </section>
    );
  }
  