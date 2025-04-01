from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext

from models import UserCreate, Token, TokenData
from database import get_user_by_email, create_user, verify_user

router = APIRouter()

# Security configuration
SECRET_KEY = "your-secret-key"  # In production, use a proper secure key from environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT token with an optional expiration time.

    Args:
        data: Dictionary containing claims to encode in the token
        expires_delta: Optional expiration time, defaults to 30 minutes

    Returns:
        Encoded JWT token as a string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """
    Validate the token and return the current user.

    Args:
        token: JWT token from Authorization header

    Returns:
        User data dictionary if token is valid

    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception

        token_data = TokenData(username=email, user_type=payload.get("user_type"))
    except JWTError:
        raise credentials_exception

    # Get user from database
    user = get_user_by_email(email=token_data.username)
    if not user:
        raise credentials_exception

    return user


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user and provide access token.

    Args:
        form_data: OAuth2 password request form containing username (email) and password

    Returns:
        Token object with access token and token type

    Raises:
        HTTPException: If authentication fails
    """
    print(f"Login attempt for: {form_data.username}")

    # Use verify_user function which now has hardcoded authentication
    user = verify_user(form_data.username, form_data.password)

    if not user:
        print(f"Authentication failed for {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Ensure user type is set
    if "user_type" not in user or not user["user_type"]:
        user["user_type"] = "volunteer"  # Default to volunteer if not specified

    # Create access token with user information
    access_token = create_access_token(data={
        "sub": user["email"],
        "user_type": user["user_type"]
    })

    print(f"Authentication successful for {form_data.username}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    """
    Register a new user (volunteer or organization).

    Args:
        user: User data including email, password, and type

    Returns:
        Confirmation message and user ID

    Raises:
        HTTPException: If email is already registered
    """
    # Check if user already exists
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Prepare user data
    user_data = user.dict()

    # Hash the password
    plain_password = user_data["password"]
    user_data["password"] = get_password_hash(plain_password)

    # Create user in the database
    new_user = create_user(user_data)

    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

    return {
        "message": f"{user.user_type.capitalize()} registered successfully",
        "id": new_user.get("id")
    }


@router.get("/me")
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get information about the currently authenticated user.

    Args:
        current_user: Current user data from token validation

    Returns:
        User information (sensitive data removed)
    """
    # Remove sensitive information like password
    user_info = current_user.copy()
    if "password" in user_info:
        del user_info["password"]

    return user_info