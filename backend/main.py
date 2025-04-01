import sys
import traceback

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from starlette.requests import Request
from starlette.responses import JSONResponse

# Import your routers
from backend.routers import auth, volunteers, organizations, opportunities, matches

# === FastAPI App ===
app = FastAPI(
    title="AI-Powered Volunteer Matching System",
    description="API for matching volunteers with opportunities using ML/NLP",
    version="1.0.0"
)

# === CORS Middleware ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    A comprehensive exception handler that returns full error details.
    This includes the full traceback, which is crucial for debugging.
    """
    # Get the full traceback as a string
    error_type, error_value, error_traceback = sys.exc_info()
    traceback_str = ''.join(traceback.format_tb(error_traceback))

    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "message": str(exc),
                "type": type(exc).__name__,
                "traceback": traceback_str,
                "full_error_details": {
                    "error_type": str(error_type),
                    "error_value": str(error_value)
                }
            }
        }
    )


# === Route Registration ===
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(volunteers.router, prefix="/api/volunteers", tags=["Volunteers"])
app.include_router(organizations.router, prefix="/api/organizations", tags=["Organizations"])
app.include_router(opportunities.router, prefix="/api/opportunities", tags=["Opportunities"])
app.include_router(matches.router, prefix="/api/matches", tags=["Matches"])

# === Auth Helpers ===
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# === JWT Constants ===
SECRET_KEY = "your-secret-key"  # ⚠️ Replace this with a secure, secret value
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# === Root Route ===
@app.get("/")
async def root():
    return {
        "message": "Mirësevini në API-në e sistemit të përputhjes së vullnetarëve të fuqizuar nga AI 🚀"
    }
