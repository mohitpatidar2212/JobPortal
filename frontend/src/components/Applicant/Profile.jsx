import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeError, setResumeError] = useState("");

  const token = localStorage.getItem("token"); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("http://localhost:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const fetchResume = async () => {
    try {
      const res = await API.get("http://localhost:8000/profile/resume", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // the response is treated as a binary file
      });

      const url = URL.createObjectURL(res.data);
      setResumeUrl(url);
      window.open(url, "_blank");
    } catch (err) {
      setResumeError("Failed to load resume.");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-1/2 mt-5 mb-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">My Profile</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <img
            src={profile.profilePhoto || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full border"
          />
          <div>
            <h3 className="text-xl font-bold">{profile.name}</h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        {profile.role == "employer" && (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileField label="Company" value={profile.companyName} />
            <ProfileField label="Mobile No" value={profile.mobileNo} />
            </div>
          </>
        )}

        {profile.role === "applicant" && (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField label="Role" value={profile.role} />
              <ProfileField label="Mobile No" value={profile.mobileNo} />
              {profile.position && <ProfileField label="Position" value={profile.position} />}
              {profile.location && <ProfileField label="Location" value={profile.location} />}
              {profile.companyName && <ProfileField label="Company" value={profile.companyName} />}
              {profile.skills?.length > 0 && <ProfileField label="Skills" value={profile.skills.join(", ")} />}
            </div>

            {profile.experience?.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-base font-medium">{profile.experience}</p>
              </div>
            ) : (
              <div className="mt-6">
                <p className="font-bold">Add Experience by clicking on the Edit Profile</p>
              </div>
            )}
          </>
        )}

        {profile.role === "applicant" && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Resume</h4>
            {resumeUrl ? (
              <button
                onClick={() => window.open(resumeUrl, "_blank")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                View Resume
              </button>
            ) : (
              <button
                onClick={fetchResume}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Fetch Resume
              </button>
            )}
            {resumeError && <p className="text-red-500">{resumeError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
}
