import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    profilePhoto: "",
    position: "",
    location: "",
    skills: "",
    resume: "",
    experience: "",
    role: "",
    companyName: "",
  });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate()

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const data = res.data;
    
        setFormData({
          name: data.name || "",
          mobileNo: data.mobileNo || "",
          profilePhoto: data.profilePhoto || "",
          position: data.position || "",
          location: data.location || "",
          skills: (data.skills || []).join(", "),
          resume: data.resume || "",
          experience: data.experience || "",
          companyName: data.companyName || "",
          role: data.role || "",
        });
    
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (err.response?.data?.detail) {
          setErrorMessage(`Failed to load profile: ${err.response.data.detail}`);
        } else {
          setErrorMessage("Failed to load profile. Please try again.");
        }
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if ((name === "profilePhoto" || name === "resume") && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setMessage("");
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("mobileNo", formData.mobileNo);
    formData.position && formDataToSend.append("position", formData.position);
    formData.location && formDataToSend.append("location", formData.location);
    formData.experience && formDataToSend.append("experience", formData.experience);
    formData.companyName && formDataToSend.append("companyName", formData.companyName);
    formData.skills && formDataToSend.append("skills", formData.skills);

    if (formData.profilePhoto instanceof File) {
      formDataToSend.append("profilePhoto", formData.profilePhoto);
    }
  
    if (formData.resume instanceof File) {
      formDataToSend.append("resume", formData.resume);
    }
  
    // for (let pair of formDataToSend.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }
    
    try {
      const res = await API.put("/edit-profile", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      setMessage("Profile updated successfully!");
      setTimeout(() => navigate('/profile'), 2000)
      
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail);
      } else {
        setErrorMessage("Something went wrong while updating profile.");
      }
    }
  };
  

  return ( 
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full p-8 rounded-lg shadow-lg relative">
        <h2 className="text-3xl font-bold mb-8 text-center">Edit Profile</h2>

        {message && (
          <div className="mb-4 text-center text-sm text-green-600">{message}</div>
        )}

        {errorMessage && (
          <div className="mb-4 text-center text-sm text-red-600">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="number"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 file:border-0 file:px-4 file:py-2 file:bg-indigo-600 file:text-white file:rounded-xl file:cursor-pointer file:hover:bg-indigo-800"
            />
          </div>

          {formData.role === "employer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {formData.role === "applicant" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., HTML, CSS, React"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resume (PDF or Image)</label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 file:border-0 file:px-4 file:py-2 file:bg-indigo-600 file:text-white file:rounded-xl file:cursor-pointer file:hover:bg-indigo-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Mention your work experience here..."
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                />
              </div>
            </>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-800 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
