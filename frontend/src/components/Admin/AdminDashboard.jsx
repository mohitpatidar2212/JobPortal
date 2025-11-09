import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [employers, setEmployers] = useState([]); 
    const [applicants, setApplicants] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [view, setView] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null); 
    }, []);

    const fetchEmployers = async () => {
        try {
        const token = localStorage.getItem("token");
        const res = await API.get("http://localhost:8000/admin/employers", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setEmployers(res.data);
        setView("employers");
        } catch (err) {
        console.error("Error fetching employers:", err);
        }
    };
    const fetchApplicants = async () => {
        try {
        const token = localStorage.getItem("token");
        const res = await API.get("http://localhost:8000/admin/applicants", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setApplicants(res.data);
        setView("applicants");
        } catch (err) {
        console.error("Error fetching applicants:", err);
        }
    };
    const fetchJobs = async () => {
        try {
        const token = localStorage.getItem("token");
        const res = await API.get("http://localhost:8000/admin/jobs", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setJobs(res.data);
        setView("jobs");
        } catch (err) {
        console.error("Error fetching jobs:", err);
        }
    };

    const handleDeleteEmployer = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employer?");
        if (!confirmDelete) return;

        try {
        const token = localStorage.getItem("token");
        await API.delete(`http://localhost:8000/admin/delete-employer/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setEmployers((prev) => prev.filter((emp) => emp._id !== id));
        } catch (err) {
        console.error("Error deleting employer:", err);
        }
    };

    const handleDeleteApplicant = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this applicant?");
        if (!confirmDelete) return;

        try {
        const token = localStorage.getItem("token");
        await API.delete(`http://localhost:8000/admin/delete-applicant/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setApplicants((prev) => prev.filter((applicant) => applicant._id !== id));
        } catch (err) {
        console.error("Error deleting applicant:", err);
        }
    };

    const handleDeleteJob = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
        const token = localStorage.getItem("token");
        await API.delete(`http://localhost:8000/admin/delete-job/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setJobs((prev) => prev.filter((j) => j._id !== id));
        } catch (err) {
        console.error("Error deleting job:", err);
        }
    };


    if (!user || user.role !== "admin") {
        return <p className="text-red-600 text-center mt-10">Access Denied</p>;
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 min-h-[70vh]">
            <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
            <div className="flex gap-4 mb-6">
                <button onClick={fetchEmployers} className="px-4 py-2 bg-indigo-600 text-white rounded">View Employers</button>
                <button onClick={fetchApplicants} className="px-4 py-2 bg-indigo-600 text-white rounded">View Applicants</button>
                <button onClick={fetchJobs} className="px-4 py-2 bg-green-600 text-white rounded">View Jobs</button>
            </div>

            {view === "employers" && (
                <div>
                <h3 className="text-xl font-semibold mb-4">All Employers</h3>
                {employers.map((e) => (
                    <div key={e._id} className="border-b py-2 flex justify-between items-center">
                    <div>
                        <p>{e.name}</p>
                        <p className="text-sm text-gray-600">Email - {e.email}</p>
                    </div>
                    <button
                        onClick={() => handleDeleteEmployer(e._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                    >
                        Delete
                    </button>
                    </div>
                ))}
                </div>
            )}

            {view === "applicants" && (
                <div>
                <h3 className="text-xl font-semibold mb-4">All Applicants</h3>
                {applicants.map((a) => (
                    <div key={a._id} className="border-b py-2 flex justify-between items-center">
                    <div>
                        <p>{a.name}</p>
                        <p className="text-sm text-gray-600">Email - {a.email}</p>
                    </div>
                    <button
                        onClick={() => handleDeleteApplicant(a._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                    >
                        Delete
                    </button>
                    </div>
                ))}
                </div>
            )}

            {view === "jobs" && (
                <div>
                <h3 className="text-xl font-semibold mb-4">All Jobs</h3>
                {jobs.map((j) => (
                    <div key={j._id} className="border-b py-2 flex justify-between items-center">
                    <div>
                        <p>{j.title}</p>
                        <p>Company - {j.company}</p>
                        <p className="text-sm text-gray-600">Posted by - {j.created_by}</p>
                    </div>
                    <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                    >
                        Delete
                    </button>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}
