import { useState } from "react";
import API from "../../services/api";

export default function PostJob() {
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    skills: "",
    salary: "",
    experience: "",
    jobType: "",
    jobId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = { ...form };

      const response = await API.post(
        "http://localhost:8000/jobs",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertMsg("Job posted successfully!");
      setAlertType("success");

      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
        skills: "",
        salary: "",
        experience: "",
        jobType: "",
        jobId: "",
      });

      setTimeout(() => setAlertMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setAlertMsg("Failed to post job. Make sure you're logged in as an employer.");
      setAlertType("error");

      setTimeout(() => setAlertMsg(""), 4000);
    }
  };

  return (
    <>
      {alertMsg && (
        <div className="fixed top-6 left-1/2 z-50">
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-6 py-4 rounded shadow-lg text-center max-w-md w-full ${
              alertType === "success"
                ? "bg-green-100 text-green-800 border border-green-400"
                : "bg-red-100 text-red-800 border border-red-400"
            }`}
          >
            <p>{alertMsg}</p>
          </div>
        </div>
      </div>
      )}
      <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white max-w-2xl w-full p-8 rounded-lg shadow-lg relative">


          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Post a New Job
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job ID
              </label>
              <input
                type="number"
                id="title"
                name="jobId"
                value={form.jobId}
                onChange={handleChange}
                placeholder="Enter the job id"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g., OpenAI"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div> */}

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Remote"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="job-type" className="block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <input
                type="text"
                id="job-type"
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                placeholder="e.g., Part-time, Full-time, Internship"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Required Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g., 6 LPA"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g., 2+ years"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write job responsibilities, requirements, etc."
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm resize-none h-32 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-800 transition duration-200"
              >
                Submit Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
