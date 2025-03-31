from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

from backend.routers import auth, volunteers, organizations, opportunities, matches

app = FastAPI(
    title="AI-Powered Volunteer Matching System",
    description="API for matching volunteers with opportunities using ML/NLP",
    version="1.0.0"
)

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(volunteers.router, prefix="/api/volunteers", tags=["Volunteers"])
app.include_router(organizations.router, prefix="/api/organizations", tags=["Organizations"])
app.include_router(opportunities.router, prefix="/api/opportunities", tags=["Opportunities"])
app.include_router(matches.router, prefix="/api/matches", tags=["Matches"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Constants
SECRET_KEY = "your-secret-key"  # Replace with a secure secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


@app.get("/")
async def root():
    return {"message": "Mirësevini në API-në e sistemit të përputhjes së vullnetarëve të fuqizuar nga AI"}
