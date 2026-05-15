from pydantic import BaseModel
from typing import Optional

class Job(BaseModel):
    title: str
    jobId: str
    location: str
    description: str
    jobType: str
    skills: str
    salary: Optional[str] = None
    experience: Optional[str] = None
    

