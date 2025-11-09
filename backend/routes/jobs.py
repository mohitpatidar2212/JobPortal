from fastapi import APIRouter, Depends, HTTPException, Request, status, Body, BackgroundTasks
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import db
from models.job import Job
from config import SECRET_KEY, ALGORITHM
from typing import Dict, Optional
from datetime import datetime
from bson import ObjectId
import base64
from .background_task import send_emails

router = APIRouter()
auth_scheme = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        # print("token decode error:", str(e))
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
def serialize_job(job):
    job["_id"] = str(job["_id"])
    return job


# job posting route
@router.post("/jobs")
async def create_job(background_task: BackgroundTasks, job: Job, user=Depends(get_current_user)):
    job_data: Dict = job.model_dump()

    if user["role"] != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employers can post jobs")
    
    employer = await db.users.find_one({"email": user["sub"]})

    if employer:
        job_data["company"] = employer["companyName"]
    else:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="You are not signed in.")
    
    job_data["created_by"] = user["sub"]
    job_data["created_at"] = str(datetime.now()) 

    background_task.add_task(send_emails, job_data)
    
    try:
        await db.jobs.insert_one(job_data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Unable to post the job try again.")
    return {"message": "Job posted"}

# getting all the jobs for applicant
@router.get("/jobs")
async def get_jobs():
    jobs = await db.jobs.find().to_list(None)
    return [serialize_job(job) for job in jobs]

# getting three jobs for home page
@router.get("/jobs/home-page")
async def get_home_job():
    jobs = await db.jobs.find().to_list(3)
    return [serialize_job(job) for job in jobs]

# jobs created by a particular recruiter
@router.get("/jobs/my")
async def my_jobs(user=Depends(get_current_user)):
    jobs = await db.jobs.find({"created_by": user["sub"]}).to_list(None)
    return [serialize_job(job) for job in jobs]

# getting a particular job for the edit functionality
@router.get("/edit-jobs/data/{job_id}")
async def get_job_by_id(job_id: str, user: dict = Depends(get_current_user)):
    try:
        job = await db.jobs.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        job["_id"] = str(job["_id"])
        return (job)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# edit a particular job 
@router.put("/edit-job/{job_id}")
async def update_job(job_id: str, data: dict = Body(...), user=Depends(get_current_user)):
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job or job["created_by"] != user["sub"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found or unauthorized")
    
    data.pop("_id", None)
    data.pop("id", None)

    await db.jobs.update_one({"_id": ObjectId(job_id)}, {"$set": data})
    return {"message": "Job updated successfully"}

# deleting the job
@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, user=Depends(get_current_user)):
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job or job["created_by"] != user["sub"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found or unauthorized")
    await db.jobs.delete_one({"_id": ObjectId(job_id)})
    return {"message": "Job deleted"}

# route for the apply job
@router.post("/jobs/{job_id}/apply")
async def apply_to_job(job_id: str, user=Depends(get_current_user)):
    if user["role"] != "applicant":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only applicants can apply to jobs")
    
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    # Checking if the user has already applied
    existing_application = await db.applications.find_one({
        "job_id": job_id,
        "applicant_email": user["sub"]
    })
    if existing_application:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already applied to this job.")

    application_data = {
        "job_id": job_id,
        "applicant_email": user["sub"],
        "applied_at": datetime.now()
    }
    await db.applications.insert_one(application_data)
    return {"message": "Application submitted successfully"}
 
# route for getting jobs that are applied by a logged in applicant
@router.get("/applicant/jobs/applied")
async def get_applied_jobs(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "applicant":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only applicants can view applied jobs")

    applicant_email = current_user.get("sub")

    applications_cursor = db.applications.find({"applicant_email": applicant_email})
    applications = await applications_cursor.to_list(length=None)

    job_ids = [ObjectId(app["job_id"]) for app in applications]
    jobs_cursor = db.jobs.find({"_id": {"$in": job_ids}})
    jobs = await jobs_cursor.to_list(length=None)

    # Serialize each job before returning
    return [serialize_job(job) for job in jobs]

# route to delete an job application
@router.delete("/jobs/{job_id}/application/delete")
async def delete_application(job_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.applications.delete_one({
        "job_id": job_id,
        "applicant_email": current_user["sub"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    return {"message": "Application deleted successfully"}

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role"),
        "position": user.get("position"),
        "location": user.get("location"),
        "skills": user.get("skills", []),
    }

# getting all the applicants that applied for a particular employer posted jobs
@router.get("/applicants/applied")
async def get_applied_applicants(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employer":
        raise HTTPException(status_code=403, detail="Only employers can access this route")

    employer_email = current_user["sub"]
    jobs = await db.jobs.find({"created_by": employer_email}).to_list(None)

    if not jobs:
        return []

    response = []

    for job in jobs:
        job_id_str = str(job["_id"])
        applications = await db.applications.find({"job_id": job_id_str}).to_list(None)
        applicant_emails = [app["applicant_email"] for app in applications]

        if not applicant_emails:
            applicants = []
        else:
            applicants = await db.users.find({
                "email": {"$in": applicant_emails},
                "role": "applicant"
            }).to_list(None)

        formatted_applicants = []

        for applicant in applicants:
            applicant.pop("password", None)
            applicant["_id"] = str(applicant["_id"])

            resume = applicant.get("resume")
            if resume:
                resume_data = resume["data"]
                if isinstance(resume_data, bytes):
                    encoded_resume = base64.b64encode(resume_data).decode("utf-8")
                else:
                    encoded_resume = resume_data 

                applicant["resume"] = {
                    "filename": resume.get("filename"),
                    "content_type": resume.get("content_type"),
                    "data": encoded_resume,
                }
            else:
                applicant["resume"] = None

            formatted_applicants.append(applicant)

        response.append({
            "job_title": job["title"],
            "jobId": job["jobId"],
            "job_id": job_id_str,
            "applicants": formatted_applicants
        })

    return response

# jobs filter route for the applicant
@router.get("/jobs/filter")
async def filter_jobs(
    request: Request,
    location: Optional[str] = None,
    type: Optional[str] = None,
    experience: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "applicant":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="you are not allowed to access this")
    query = {}

    if location:
        query["location"] = location
    if type:
        query["jobType"] = type
    if experience:
        query["experience"] = experience

    jobs = await db.jobs.find(query).to_list(None)
    for job in jobs:
        job["_id"] = str(job["_id"])

    return jobs
