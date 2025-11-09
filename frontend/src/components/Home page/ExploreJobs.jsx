import { useEffect, useState } from "react";
import API from "../../services/api";
import Marquee from "react-fast-marquee"

export default function ExploreJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("http://localhost:8000/jobs/home-page");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="px-6 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Explore Jobs</h2>
      <div className="grid md:grid-cols-3 gap-6">
      {/* <Marquee pauseOnHover={true}> */}
        {jobs.map((job, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-lg font-semibold">{job.company}</h3>
            <p className="text-gray-600">{job.title}</p>
            <p className="text-sm text-gray-400">{job.location}</p>
            {/* <p className="text-xs mt-2 text-indigo-500">
              {job.appliedCount || 0} applied of {job.vacancy || "N/A"} vacancy
            </p> */}
          </div>
        ))}
      {/* </Marquee> */}
      </div>
    </section>
  );
}
