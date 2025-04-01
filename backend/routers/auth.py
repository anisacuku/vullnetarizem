from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext

from models import UserCreate, Token, TokenData
from database import get_user_by_email, create_user

router = APIRouter()

# === SECURITY CONFIG ===
SECRET_KEY = "your-secret-key"  # Replace with environment variable in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# === UTILS ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# === DEPENDENCY ===
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(username=email, user_type=payload.get("user_type"))
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(email=token_data.username)
    if not user:
        raise credentials_exception
    return user


# === LOGIN ===
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form_data.username)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    hashed_password = user.get("password")

    if not verify_password(form_data.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={
        "sub": user["email"],
        "user_type": user["user_type"]
    })

    return {"access_token": access_token, "token_type": "bearer"}


# === REGISTER ===
@router.post("/register", status_code=201)
async def register_user(user: UserCreate):
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user_data = user.dict()
    user_data["password"] = get_password_hash(user_data["password"])

    created = create_user(user_data)

    if not created:
        raise HTTPException(status_code=500, detail="Could not create user")

    return {
        "message": f"{user.user_type.capitalize()} registered successfully",
        "id": created["id"]
    }


# === CURRENT USER ===
@router.get("/me")
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    user_info = current_user.copy()
    user_info.pop("password", None)
    return user_info
