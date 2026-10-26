from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class IdeaCreate(BaseModel):
    idea_name: str = Field(min_length=2, max_length=160)
    industry: str = Field(min_length=2, max_length=100)
    target_audience: str = Field(min_length=2, max_length=500)
    budget: str = Field(min_length=1, max_length=100)
    geography: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=30, max_length=5000)

class AnalysisOut(BaseModel):
    id: int
    idea_name: str
    industry: str
    target_audience: str
    budget: str
    geography: str
    description: str
    score: int
    report: dict
    created_at: str
