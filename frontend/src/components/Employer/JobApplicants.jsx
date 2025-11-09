import { useEffect, useState } from "react";
import API from "../../services/api";

export default function MyApplicants() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const time = new Date();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        console.log(time.getMilliseconds());
        const token = localStorage.getItem("token");
        const res = await API.get("http://localhost:8000/applicants/applied", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResponse(res.data);
        console.log(time.getMilliseconds());
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const downloadResume = (resume) => {
    if (!resume?.data) return;
  
    const link = document.createElement("a");
    link.href = `data:${resume.content_type};base64,${resume.data}`;
    link.download = resume.filename || "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Applicants for your posted jobs</h2>

      <div className="space-y-4 transition-opacity duration-300 min-h-screen">
        {loading ? (
          <p className="min-h-screen">Loading jobs...</p>
        ): response.length > 0 ? (
          response.map((data) => (
            <div key={data.job_id} className=" mt-5 bg-slate-100 p-5 rounded-2xl w-full">
              <h3 className="text-2xl font-semibold text-black mb-4"> Job Title: {data.job_title}</h3>
              <h3 className="text-2xl font-semibold text-black mb-4"> Job ID: {data.jobId}</h3>
              {data.applicants != 0 ? <div className="flex flex-wrap gap-6">
                {data.applicants.map((applicant, index) => (
                  <div
                    key={applicant.id}
                    className="w-full sm:w-[48%] md:w-[30%] rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
                  >
                    <h3 className="text-2xl font-bold text-indigo-600">{applicant.name}</h3>

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
                      <h4 className="text-sm font-semibold text-gray-800">Contact Info:</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        📧 {applicant.email}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        📞 {applicant.mobileNo || "Not Available"}
                      </p>
                    </div>

                    <div className="mt-4"> 
                      {applicant.resume && applicant.resume.data ? (
                        <button
                        onClick={() => downloadResume(applicant.resume)}
                          className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-200"
                        >
                          Download Resume
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">No resume available currently</span>
                      )}
                    </div>

                  </div>
                ))}
              </div> : "No application is found for this role currently."}
              
            </div>
          ))
        ) : (
          <p className="text-gray-500">No applicants yet for your posted jobs.</p>
        )}
      </div>
    </div>
  );
}
