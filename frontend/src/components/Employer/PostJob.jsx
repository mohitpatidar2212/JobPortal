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
        "/jobs",
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
      )}

      <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-2xl shadow-xl relative">

          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Post a New Job
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* JOB TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* JOB ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Job ID</label>
              <input
                type="number"
                name="jobId"
                value={form.jobId}
                onChange={handleChange}
                placeholder="Enter job id"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Remote"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* JOB TYPE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Type</label>
              <input
                type="text"
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                placeholder="e.g., Full-time / Internship"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* SKILLS */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Required Skills</label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* SALARY */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary</label>
              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g., 6 LPA"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience</label>
              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g., 2+ years"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write job responsibilities, requirements, etc."
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm resize-none h-32 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* SUBMIT */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 active:scale-95 transition duration-200"
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
