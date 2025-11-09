import { useEffect, useState } from "react";
import API from "../../services/api";

export default function JobHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("http://localhost:8000/applicant/jobs/applied", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching job history:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleWithdraw = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`http://localhost:8000/jobs/${jobId}/application/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Application withdrawn successfully.");
      setMessageType("success")
      setHistory((prev) => prev.filter((job) => job._id !== jobId));
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error withdrawing application:", err);
      setMessage("Failed to withdraw application.");
      setMessageType("error")
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      {message && (
        <div className="fixed top-6 left-1/2 z-[70]">
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[70]">
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
        <h2 className="text-2xl font-semibold mb-6">Your Job Applications</h2>

        <div className="space-y-4 transition-opacity duration-300 min-h-screen">
          {loading ? (
            <p className=" min-h-screen">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500">You haven’t applied to any jobs yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl transition-shadow"
                >
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
                    🏢 {job.company || "Unknown Company"} • 📍 {job.location || "Not Mentioned"}
                  </p>

                  <div className="mt-3 flex gap-3 flex-wrap text-sm text-gray-500">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {job.jobType || "Full-time"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      Experience: {job.experience || "N/A"}
                    </span>
                    {job.salary && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        💰 ₹{job.salary}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleWithdraw(job._id)}
                    className="mt-5 inline-block bg-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition"
                  >
                    Withdraw Application
                  </button>
                </div>
              ))}
            </div>
          )}
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
              <button
                onClick={() => handleWithdraw(selectedJob._id)}
                className="mt-5 inline-block bg-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition"
              >
                Withdraw Application
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
