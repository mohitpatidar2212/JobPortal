import { useNavigate } from "react-router-dom";

export default function Footer() {

  const navigate = useNavigate()

    return (
      <footer className="px-6 py-10 bg-gray-900 text-white text-sm">
        <div className="flex justify-between flex-wrap gap-4">
          <div>
            <h4 className="text-lg font-bold">JobPortal</h4>
            <p className="mt-2">© 2025 JobPortal. All rights reserved.</p>
          </div>
          <ul className="flex space-x-4">
            <li> 
              <button className=" hover:underline hover:text-indigo-400" onClick={() => navigate("/")}>
                Home
              </button>
            </li>
            <li>
              <button className=" hover:underline hover:text-indigo-400" onClick={() => navigate("/find-jobs")}>
                Find Jobs
              </button>
            </li>
            <li>
              <button className=" hover:underline hover:text-indigo-500" onClick={() => navigate("/")}>
                About
              </button>
            </li>
            <li>
              <button className=" hover:underline hover:text-indigo-500" onClick={() => navigate("/")}>
                Contact
              </button>
            </li>
          </ul>
          <ul className="flex space-x-4 text-gray-400">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
      </footer>
    );
  }
  