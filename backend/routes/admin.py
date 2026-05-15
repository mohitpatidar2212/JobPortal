from fastapi import APIRouter
from database import db
from bson import ObjectId
from fastapi import Depends, HTTPException
from .jobs import get_current_user

def admin_only(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user

admin_router = APIRouter()

# employer routes
@admin_router.get("/admin/employers")
async def get_all_employers(current_user: dict = Depends(admin_only)):
    employers = await db.users.find({"role": "employer"}).to_list(length=None)
    for employer in employers:
        employer["_id"] = str(employer["_id"])
    return employers

# @admin_router.put("/admin/block-employer/{user_id}")
# async def block_employer(user_id: str, current_user: dict = Depends(admin_only)):
#     result = await db.users.update_one(
#         {"_id": ObjectId(user_id), "role": "employer"},
#         {"$set": {"is_active": False}}
#     )
#     if result.modified_count == 0:
#         raise HTTPException(status_code=404, detail="Employer not found or already blocked")
#     return {"message": "Employer blocked successfully"}

@admin_router.delete("/admin/delete-employer/{user_id}")
async def delete_employer(user_id: str, current_user: dict = Depends(admin_only)):
    result = await db.users.delete_one({"_id": ObjectId(user_id), "role": "employer"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employer not found")
    return {"message": "Employer deleted successfully"}


# applicant routes
@admin_router.get("/admin/applicants")
async def get_all_applicants(current_user: dict = Depends(admin_only)):
    applicants = await db.users.find(
        {"role": "applicant"},
        {"resume": 0}  # exclude the resume field
    ).to_list(length=None)
    for applicant in applicants:
        applicant["_id"] = str(applicant["_id"])
    
    return applicants

@admin_router.delete("/admin/delete-applicant/{user_id}")
async def delete_applicant(user_id: str, current_user: dict = Depends(admin_only)):
    result = await db.users.delete_one({"_id": ObjectId(user_id), "role": "applicant"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return {"message": "Applicant deleted successfully"}

# jobs routes
@admin_router.get("/admin/jobs")
async def get_all_jobs(current_user: dict = Depends(admin_only)):
    jobs = await db.jobs.find().to_list(length=None)
    for job in jobs:
        job["_id"] = str(job["_id"])
    return jobs

@admin_router.delete("/admin/delete-job/{user_id}")
async def delete_job(user_id: str, current_user: dict = Depends(admin_only)):
    result = await db.jobs.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}
