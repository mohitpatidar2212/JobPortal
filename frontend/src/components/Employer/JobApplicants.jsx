import { useEffect, useState } from "react";
import API from "../../services/api";

export default function MyApplicants() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/applicants/applied", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setResponse(res.data);
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const downloadResume = async (applicantId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        `/applicants/${applicantId}/resume`, // ✅ corrected route
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = res.headers["content-disposition"];
      let filename = "resume";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download resume:", error);
    }
  };

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">
        Applicants for your posted jobs
      </h2>

      <div className="space-y-4 transition-opacity duration-300 min-h-screen">
        {loading ? (
          <div className="pt-28 flex flex-col items-center justify-center space-y-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse [animation-delay:0.15s]"></div>
              <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse [animation-delay:0.3s]"></div>
              <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse [animation-delay:0.45s]"></div>
              <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse [animation-delay:0.6s]"></div>
            </div>

            <p className="text-gray-600 text-sm font-medium tracking-wide animate-pulse">
              Fetching Applicants...
            </p>
          </div>
        ) : response.length > 0 ? (
          response.map((data) => (
            <div
              key={data.job_id}
              className="mt-5 bg-slate-100 p-5 rounded-2xl w-full"
            >
              <h3 className="text-2xl font-semibold text-black mb-2">
                Job Title: {data.job_title}
              </h3>
              <h3 className="text-2xl font-semibold text-black mb-4">
                Job ID: {data.jobId}
              </h3>

              {data.applicants.length > 0 ? (
                <div className="flex flex-wrap gap-6">
                  {data.applicants.map((applicant) => (
                    <div
                      key={applicant._id}  // ✅ fixed
                      className="w-full sm:w-[48%] md:w-[30%] rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
                    >
                      <h3 className="text-2xl font-bold text-indigo-600">
                        {applicant.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">
                        {applicant.position || "No position provided"} ·{" "}
                        {applicant.location || "Location unknown"}
                      </p>

                      <p className="mt-3 text-sm text-gray-600">
                        {applicant.skills?.length
                          ? `Skills: ${applicant.skills.join(", ")}`
                          : "No skills listed."}
                      </p>

                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-800">
                          Contact Info:
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          📧 {applicant.email}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          📞 {applicant.mobileNo || "Not Available"}
                        </p>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => downloadResume(applicant._id)}
                          className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-200"
                        >
                          Download Resume
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mt-3">
                  No application is found for this role currently.
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No applicants yet for your posted jobs.
          </p>
        )}
      </div>
    </div>
  );
}
