import { useEffect, useState } from "react";
import API from "../../services/api";

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience: "",
  });
  
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }; 
  
  const fetchFilteredJobs = async () => {
    const token = localStorage.getItem("token")
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append("location", filters.location);
      if (filters.type) params.append("type", filters.type);
      if (filters.experience) params.append("experience", filters.experience);
  
      const res = await API.get(`/jobs/filter?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching filtered jobs:", err);
    }
  };  
 
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/jobs/${jobId}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Application submitted successfully!");
      setMessageType("success")
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error applying:", err);
      setMessage(err.response?.data?.detail || "Failed to apply.");
      setMessageType("error")
      setTimeout(() => setMessage(""), 3000);
    }
  };  

  return (
    <>
      {message && (
        <div className="fixed top-6 left-1/2 z-[70]">
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Find Your Dream Job</h2>

        {/* --- FILTER SECTION (Responsive) --- */}
        <div className="mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-end bg-white p-4 rounded-xl shadow-md border w-full">
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Bangalore"
              value={filters.location}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>

          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              placeholder="e.g. 2+ years"
              value={filters.experience}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>

          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* BUTTON MADE RESPONSIVE */}
          <button
            onClick={fetchFilteredJobs}
            className="bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 w-full md:w-auto"
          >
            Apply Filters
          </button>
        </div>

        {/* --- JOB CARDS --- */}
        <div className="space-y-4 transition-opacity duration-300 min-h-screen">
          {loading ? (
            <p className="min-h-screen">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500">No jobs available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id?.$oid || job._id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-2xl font-bold text-indigo-600">{job.title}</h3>

                  <p className="mt-2 text-gray-700 text-sm">
                    {job.description.slice(0, 100)}...
                    <button
                      className="text-blue-500 hover:text-blue-700 ml-2"
                      onClick={() => setSelectedJob(job)}
                    >
                      View More
                    </button>
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    🏢 {job.company || "Unknown Company"} • 📍 {job.location || "Not Mentioned"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {job.jobType || ""}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {job.experience ? `Experience: ${job.experience}` : "Experience: N/A"}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      💰 ₹{job.salary}
                    </span>
                  </div>

                  <button
                    className="mt-5 inline-block bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-900 transition w-full md:w-auto"
                    onClick={() => handleApply(job._id?.$oid || job._id)}
                  >
                    🚀 Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MODAL --- */}
        {selectedJob && (
          <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
              >
                &times;
              </button>

              <p className="text-center font-bold text-lg">Job Information</p>
              <p className="mb-2">Title: {selectedJob.title}</p>
              <p className="mb-2">Job ID: {selectedJob.jobId}</p>
              <p className="mb-2">Company: {selectedJob.company}</p>
              <p className="mb-2">Location: {selectedJob.location}</p>
              <p className="mb-2">Job Type: {selectedJob.jobType}</p>

              <p className="text-center font-bold text-lg mt-4">Job Description</p>
              <p className="text-gray-800 whitespace-pre-wrap mb-4">
                {selectedJob.description}
              </p>

              <button
                className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-900 transition w-full"
                onClick={() => handleApply(selectedJob._id?.$oid || selectedJob._id)}
              >
                🚀 Apply Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
