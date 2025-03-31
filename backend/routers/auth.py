from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from backend.models import UserCreate, Token, TokenData
from backend.database import get_user_by_email, create_user, verify_user

router = APIRouter()

# Token URL must match EXACTLY what the frontend POSTs to
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Constants
SECRET_KEY = "your-secret-key"  # Replace with a secure secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = verify_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={
        "sub": user["email"],
        "user_type": user["user_type"]
    })
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register")
async def register_user(user: UserCreate):
    # Check if user already exists
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Prepare user data
    user_data = user.dict()
    user_data["password"] = get_password_hash(user.password)

    # Save user
    new_user = create_user(user_data)

    return {
        "message": f"{user.user_type.capitalize()} registered successfully",
        "id": new_user.get("id")
    }


@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(email)
    if not user:
        raise credentials_exception

    return user
