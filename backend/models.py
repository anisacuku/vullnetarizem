from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional, Any


# Authentication models
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    user_type: Optional[str] = None


# User models
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str
    user_type: str  # "volunteer" or "organization"


class User(UserBase):
    id: int
    user_type: str

    class Config:
        orm_mode = True


# Volunteer models
class VolunteerProfile(BaseModel):
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    availability: Optional[Dict[str, bool]] = {}


class VolunteerCreate(UserCreate, VolunteerProfile):
    user_type: str = "volunteer"


class Volunteer(User, VolunteerProfile):
    user_type: str = "volunteer"

    class Config:
        orm_mode = True


# Organization models
class OrganizationBase(BaseModel):
    description: Optional[str] = None
    website: Optional[str] = None
    contact: Optional[str] = None


class OrganizationCreate(UserCreate, OrganizationBase):
    user_type: str = "organization"


class Organization(User, OrganizationBase):
    user_type: str = "organization"

    class Config:
        orm_mode = True


# Opportunity models
class OpportunityBase(BaseModel):
    title: str
    description: str
    organization_id: int
    location: str
    date: str
    duration: str


class OpportunityCreate(OpportunityBase):
    skills_required: List[str]
    interests: Optional[List[str]] = []
    time_requirements: Optional[Dict[str, bool]] = {}


class Opportunity(OpportunityBase):
    id: int
    skills_required: List[str]
    interests: List[str]
    time_requirements: Dict[str, bool]

    class Config:
        orm_mode = True


class OpportunityOut(Opportunity):
    organization_name: Optional[str] = None