from pydantic import BaseModel, EmailStr
from typing import List, Optional


class OTPRequest(BaseModel):
    email: str


class OTPVerification(BaseModel):
    email: str
    otp: str


class ResetPass(BaseModel):
    email: EmailStr
    new_password: str


class Subscriber(BaseModel):
    email: EmailStr


class ProfileResponse(BaseModel):
    name: str
    email: str
    mobileNo: Optional[int] = None
    role: Optional[str] = None
    profilePhoto: Optional[str] = None  # New field

    # Applicant-only fields
    position: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = []
    experience: Optional[str] = None

    # Employer-only field
    companyName: Optional[str] = None

