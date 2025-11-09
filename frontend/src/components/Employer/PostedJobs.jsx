import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const time = new Date();

  const fetchJobs = async () => {
    console.log(time.getMilliseconds());
    try {
      const res = await API.get("http://localhost:8000/jobs/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
      console.log(time.getMilliseconds());
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    try {
      await API.delete(`http://localhost:8000/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-6">Your Posted Jobs</h2>
        
        <div className="space-y-4 transition-opacity duration-300 min-h-screen">
          {loading ? (
            <p className="min-h-screen">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500">You haven’t posted any jobs yet.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md mb-4 transition-shadow hover:shadow-xl"
              >
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-600">{job.title}</h3>

                    <p className="mt-2 text-gray-700 text-sm">
                      {job.description.slice(0, 100)}...
                      <button
                        className="text-blue-500 hover:text-blue-700 hover:font-bold ml-2"
                        onClick={() => setSelectedJob(job)}
                      >
                        View More
                      </button>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Experience: {job.experience || "N/A"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      📅 Posted on: {new Date(job.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="text-sm font-medium text-indigo-600 hover:underline"
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm font-medium text-red-600 hover:underline"
                      onClick={() => deleteJob(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Modal */} 
      {selectedJob && (
        <div className=" fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto scroll-smooth">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-3xl"
            >
              &times;
            </button>
            <p className=" text-center font-bold text-lg">Job Information</p>
            <p className="mb-2">Title: {selectedJob.title}</p>
            <p className=" mb-2">Job Identification: {selectedJob.jobId}</p>
            <p className=" mb-2">Company: {selectedJob.company}</p>
            <p className=" mb-2">Location: {selectedJob.location}</p>
            <p className=" mb-2">Job Type: {selectedJob.jobType}</p>
            <p className=" text-center font-bold text-lg">Job Description</p>
            <p className="text-gray-800 whitespace-pre-wrap mb-4">{selectedJob.description}</p>
            <div className="flex gap-3">
              <button
                className="text-sm font-medium text-indigo-600 hover:underline"
                onClick={() => navigate(`/edit-job/${selectedJob._id}`)}
              >
                Edit
              </button>
              <button
                className="text-sm font-medium text-red-600 hover:underline"
                onClick={() => deleteJob(selectedJob._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
