import base64
import json
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Depends
from utils.auth import hash_password, verify_password, create_token
from database import db
from fastapi_mail import FastMail, MessageSchema, MessageType
from models.user import ResetPass, OTPRequest, OTPVerification, Subscriber, ProfileResponse
from mail import conf
import random
from bson import ObjectId
from bson.binary import Binary
from pydantic import EmailStr
from typing import Optional, List
from .jobs import get_current_user
from fastapi.responses import StreamingResponse
import io

router = APIRouter()

@router.post("/signup")
async def signup(
    name: str = Form(...),
    email: EmailStr = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    mobileNo: int = Form(...),
    companyName: Optional[str] = Form(None),
    position: Optional[str] = Form(None),
    skills: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
):
    parsed_skills: Optional[List[str]] = json.loads(skills) if skills else None

    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    resume_data = None
    resume_filename = None
    if resume:
        resume_data = base64.b64encode(await resume.read()).decode("utf-8")
        resume_filename = resume.filename

    user_data = {
        "name": name,
        "email": email,
        "password": hash_password(password),
        "role": role,
        "mobileNo": mobileNo,
        "companyName": companyName,
        "position": position,
        "skills": parsed_skills,
        "location": location,
        "resume": {
            "filename": resume_filename,
            "data": resume_data,
            "content_type": resume.content_type if resume else None
        } if resume else None
    }

    if role == "applicant":
        user_data.pop("companyName", None)
    elif role == "employer":
        user_data.pop("position", None)
        user_data.pop("skills", None)
        user_data.pop("location", None)
        user_data.pop("resume", None)

    await db.users.insert_one(user_data)
    return {"message": "User created successfully"}


@router.post("/login")
async def login(data: dict):
    user = await db.users.find_one({"email": data["email"]})
    if not user or not verify_password(data["password"], user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_token({"sub": user["email"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "role": user["role"], "name": user["name"]}


# verify email routes
verify_otp_storage = {}

@router.post("/send-otp")
async def send_otp(request: OTPRequest):
    try:
        otp = str(random.randint(100000, 999999))
        verify_otp_storage[request.email] = otp
        template = f"""
            <html>
            <body>    
            <p>Hii from JobPortal !!!
                <br>Your otp for email verification is - {otp}</p>
            </body>
            </html>
            """
    
        message = MessageSchema(
            subject="OTP for JobPortal Verification",
            recipients=[request.email],  
            body=template,
            subtype=MessageType.html
            )
    
        fm = FastMail(conf)
        await fm.send_message(message)
    
        return {"message": f"OTP sent to {request.email}."}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error sending OTP to {request.email}")


# verify otp
@router.post("/verify-otp")
async def verify_otp(request: OTPVerification):
    if request.email not in verify_otp_storage:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="OTP expired or not requested")
    
    if verify_otp_storage.get(request.email) == request.otp:
        verify_otp_storage.pop(request.email)
        return {"message": "OTP verified successfully !"}
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid otp")


# Password reset routes
reset_pass_otp_storage = {}

@router.post("/send-reset-otp")
async def send_reset_otp(request: OTPRequest): 
    try:
        otp = str(random.randint(100000, 999999))
        reset_pass_otp_storage[request.email] = otp
        template = f"""
            <html>
            <body>    
            <p>Hii from JobPortal !!!
                <br>Your otp for reset the password is - {otp}</p>
            </body>
            </html>
            """
    
        message = MessageSchema(
            subject="OTP for reset password - JobPortal",
            recipients=[request.email],  
            body=template,
            subtype=MessageType.html
            )
    
        fm = FastMail(conf)
        await fm.send_message(message)
    
        return {"message": f"OTP for reset password sent to {request.email}."}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error sending OTP to {request.email}")

@router.post("/verify-reset-otp")
async def verify_reset_otp(request: OTPVerification):
    if request.email not in reset_pass_otp_storage:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="OTP expired or not requested")
    
    if reset_pass_otp_storage.get(request.email) == request.otp:
        reset_pass_otp_storage.pop(request.email)
        return {"message": "OTP verified successfully !"}
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid otp")

@router.post("/reset-password")
async def reset_password(request: ResetPass):
    user = await db.users.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found with this email")
    
    new_pass = request.new_password
    new_pass = hash_password(new_pass)
    result = await db.users.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {"password": new_pass}}
    )

    if result.modified_count == 1:
        return {"message": "Password reset successful"}
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Password reset failed")

# adding subscribers
@router.post("/subscribe")
async def subscribe_user(subscriber: Subscriber):
    existing = await db.subscribers.find_one({"email": subscriber.email})
    if existing:
        raise HTTPException(status_code=400, detail="Already subscribed.")
    await db.subscribers.insert_one(subscriber.model_dump())
    return {"message": "Subscription successful!"}

#  profile route
@router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_email = current_user["sub"]
    user = await db.users.find_one({"email": user_email}) 

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = {
        "name": user.get("name"),
        "email": user.get("email"),
        "mobileNo": user.get("mobileNo"),
        "role": user.get("role"),
        "profilePhoto": f"data:image/jpeg;base64,{user.get('profilePhoto')}" if user.get("profilePhoto") else ""
    }

    if user["role"] == "applicant":
        profile.update({
            "position": user.get("position", ""),
            "location": user.get("location", ""),
            "skills": user.get("skills", []),
            "experience": user.get("experience", ""),
        })

    elif user["role"] == "employer":
        profile["companyName"] = user.get("companyName", "")

    return profile


# resume getting and sending route
@router.get("/profile/resume")
async def get_resume(current_user: dict = Depends(get_current_user)):
    user_email = current_user["sub"]
    user = await db.users.find_one({"email": user_email})

    if not user or user["role"] != "applicant":
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_dict = user.get("resume", {})
    if not resume_dict or "data" not in resume_dict:
        raise HTTPException(status_code=404, detail="No resume uploaded")

    base64_data = resume_dict["data"]
    content_type = resume_dict.get("content_type", "application/pdf")

    try:
        raw_binary = base64.b64decode(base64_data.encode("utf-8"))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to decode resume data")

    file_like_object = io.BytesIO(raw_binary)

    return StreamingResponse(file_like_object, media_type=content_type)


# profile edit route
@router.put("/edit-profile")
async def edit_profile(
    name: str = Form(...),
    mobileNo: int = Form(...),
    position: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    skills: Optional[str] = Form(None), 
    experience: Optional[str] = Form(None),
    companyName: Optional[str] = Form(None),
    profilePhoto: Optional[UploadFile] = File(None),
    resume: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    user_email = current_user["sub"]

    if not name or not mobileNo:
        raise HTTPException(status_code=422, detail="Name and mobile number are required.")

    update_data = {
        "name": name,
        "mobileNo": mobileNo,
    }

    resume_data = None
    resume_filename = None
    if resume:
        resume_data = base64.b64encode(await resume.read()).decode("utf-8")
        resume_filename = resume.filename
        update_data["resume"] = {
            "filename": resume_filename,
            "data": resume_data,
            "content_type": resume.content_type if resume else None
        } if resume else None

    if profilePhoto:
        photo_content = await profilePhoto.read()
        encoded_photo = base64.b64encode(photo_content).decode('utf-8')
        update_data["profilePhoto"] = encoded_photo

    if current_user["role"] == "applicant":
        update_data.update({
            "position": position,
            "location": location,
            "experience": experience,
            "skills": [skill.strip() for skill in skills.split(",")] if skills else []
        })
    
    if current_user["role"] == "employer":
        update_data["companyName"] = companyName

    try:
        result = await db.users.update_one(
            {"email": user_email},
            {"$set": update_data}
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED , detail="Document is to large. Use a low size document.")

    if result.modified_count == 0:
        return {"message": "No updates are made."}

    return {"message": "Profile updated successfully"}
