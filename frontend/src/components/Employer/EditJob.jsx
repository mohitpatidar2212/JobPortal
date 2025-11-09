import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
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

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchJob = async () => {
    try {
      const res = await API.get(`http://localhost:8000/edit-jobs/data/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm(res.data);
    } catch (err) {
      console.error("Failed to load job", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`http://localhost:8000/edit-job/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data?.message || "Job updated successfully !");
      setMessageType('success')
      setTimeout(() => navigate("/posted-job"), 2000)
    } catch (err) {
      console.error("Failed to update job", err);
      setMessage(err.response?.detail || "Failed to update job");
      setMessageType('error')
    }
  };

  if (loading) return <p className="text-center py-6 text-lg">Loading job data...</p>;

  return (
    <>
      {message && (
        <div className="fixed top-6 left-1/2 z-50">
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-6 py-4 rounded shadow-lg text-center max-w-md w-full ${
              messageType === "success"
                ? "bg-green-100 text-green-800 border border-green-400"
                : "bg-red-100 text-red-800 border border-red-400"
            }`}
          >
            <p>{message}</p>
          </div>
        </div>
      </div>
      )}

      <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-8 rounded-lg shadow-lg relative">
              <h2 className="text-3xl font-bold mb-8 text-center">Edit Job</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Job Title</label>
                      <input
                          type="text"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Job Title</label>
                      <input
                          type="number"
                          name="jobId"
                          value={form.jobId}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                          type="text"
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Type</label>
                    <input
                      type="text"
                      name="jobType"
                      value={form.jobType}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                      <input
                          type="text"
                          name="skills"
                          value={form.skills}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Salary</label>
                      <input
                          type="text"
                          name="salary"
                          value={form.salary}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <input
                          type="text"
                          name="experience"
                          placeholder="e.g. 2+ years"
                          value={form.experience}
                          onChange={handleChange}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Job Description</label>
                      <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          required
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm resize-none h-32 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>

                  <div className="text-center">
                      <button
                          type="submit"
                          className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-800 transition duration-200"
                      >
                          Update Job
                      </button>
                  </div>
              </form>
          </div>
      </div>
    </>
  );
}
