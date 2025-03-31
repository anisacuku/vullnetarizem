import pandas as pd
import os
import json
import base64
from typing import Dict, List, Any, Optional
from passlib.context import CryptContext

# === File paths ===
DATA_DIR = "data"
VOLUNTEERS_FILE = os.path.join(DATA_DIR, "volunteers.csv")
ORGANIZATIONS_FILE = os.path.join(DATA_DIR, "organizations.csv")
OPPORTUNITIES_FILE = os.path.join(DATA_DIR, "opportunities.csv")

# === Password hashing ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# === Ensure data directory and files exist ===
os.makedirs(DATA_DIR, exist_ok=True)


def init_data_files():
    if not os.path.exists(VOLUNTEERS_FILE):
        pd.DataFrame(columns=[
            'id', 'email', 'name', 'password', 'user_type',
            'skills', 'interests', 'availability'
        ]).to_csv(VOLUNTEERS_FILE, index=False)

    if not os.path.exists(ORGANIZATIONS_FILE):
        pd.DataFrame(columns=[
            'id', 'email', 'name', 'password', 'user_type',
            'description', 'website', 'contact'
        ]).to_csv(ORGANIZATIONS_FILE, index=False)

    if not os.path.exists(OPPORTUNITIES_FILE):
        pd.DataFrame(columns=[
            'id', 'title', 'description', 'organization_id',
            'skills_required', 'interests', 'location',
            'date', 'duration', 'time_requirements'
        ]).to_csv(OPPORTUNITIES_FILE, index=False)


init_data_files()


# === Helpers ===
def serialize_list(data): return json.dumps(data) if isinstance(data, list) else "[]"


def serialize_dict(data): return json.dumps(data) if isinstance(data, dict) else "{}"


def deserialize_list(data):
    if pd.isna(data) or not data: return []
    try:
        return json.loads(data)
    except:
        return []


def deserialize_dict(data):
    if pd.isna(data) or not data: return {}
    try:
        return json.loads(data)
    except:
        return {}


# === Password encoding/decoding for CSV storage ===
def encode_password(password_hash):
    """Encode a bcrypt hash for safe CSV storage"""
    # Convert to bytes if it's a string
    if isinstance(password_hash, str):
        password_hash = password_hash.encode('utf-8')
    # Base64 encode it for safe storage
    return base64.b64encode(password_hash).decode('utf-8')


def decode_password(encoded_hash):
    """Decode a base64-encoded hash from CSV storage"""
    try:
        # Handle potential NaN values
        if pd.isna(encoded_hash):
            return None
        # Decode base64 back to original hash
        return base64.b64decode(encoded_hash).decode('utf-8')
    except Exception as e:
        print(f"Error decoding password hash: {e}")
        return None


# === User Lookup ===
def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    try:
        df = pd.read_csv(VOLUNTEERS_FILE, dtype={'password': str, 'email': str})
        match = df[df['email'] == email] 
        if not match.empty:
            user = match.iloc[0].to_dict()
            # Decode the password hash
            user['password'] = decode_password(user.get('password'))
            user['skills'] = deserialize_list(user.get('skills', '[]'))
            user['interests'] = deserialize_list(user.get('interests', '[]'))
            user['availability'] = deserialize_dict(user.get('availability', '{}'))
            return user
    except Exception as e:
        print(f"Volunteer lookup error: {e}")

    try:
        df = pd.read_csv(ORGANIZATIONS_FILE, dtype={'password': str, 'email': str})
        match = df[df['email'] == email]
        if not match.empty:
            user = match.iloc[0].to_dict()
            # Decode the password hash
            user['password'] = decode_password(user.get('password'))
            return user
    except Exception as e:
        print(f"Organization lookup error: {e}")

    return None


# === User Creation ===
def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    if user_data.get("user_type") == "organization":
        return create_organization(user_data)
    return create_volunteer(user_data)


def create_volunteer(data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        df = pd.read_csv(VOLUNTEERS_FILE)
        new_id = int(df['id'].max()) + 1 if not df.empty else 1

        # Create a copy of data for storage
        storage_data = data.copy()
        storage_data['id'] = new_id

        # Hash and encode the password for safe storage
        raw_password = data['password']
        hashed_password = pwd_context.hash(raw_password)
        storage_data['password'] = encode_password(hashed_password)

        # Serialize complex data
        storage_data['skills'] = serialize_list(data.get('skills', []))
        storage_data['interests'] = serialize_list(data.get('interests', []))
        storage_data['availability'] = serialize_dict(data.get('availability', {}))

        # Add to dataframe and save
        df = pd.concat([df, pd.DataFrame([storage_data])], ignore_index=True)
        df.to_csv(VOLUNTEERS_FILE, index=False)

        # For the return value, keep the original password hash format
        data['id'] = new_id
        data['password'] = hashed_password  # Store the raw hash for the returned object
        return data
    except Exception as e:
        print(f"Error creating volunteer: {e}")
        return {}


def create_organization(data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        df = pd.read_csv(ORGANIZATIONS_FILE)
        new_id = int(df['id'].max()) + 1 if not df.empty else 1

        # Create a copy for storage
        storage_data = data.copy()
        storage_data['id'] = new_id

        # Hash and encode the password
        raw_password = data['password']
        hashed_password = pwd_context.hash(raw_password)
        storage_data['password'] = encode_password(hashed_password)

        # Add to dataframe and save
        df = pd.concat([df, pd.DataFrame([storage_data])], ignore_index=True)
        df.to_csv(ORGANIZATIONS_FILE, index=False)

        # For the return object
        data['id'] = new_id
        data['password'] = hashed_password
        return data
    except Exception as e:
        print(f"Error creating organization: {e}")
        return {}


# === Login Verification ===
def verify_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    user = get_user_by_email(email)
    if not user:
        print(f"No user found with email: {email}")
        return None

    # The password in user should already be decoded
    stored_hash = user.get('password')
    if not stored_hash:
        print("No password hash found for user")
        return None

    try:
        # Verify the password against the stored hash
        if not pwd_context.verify(password, stored_hash):
            print("Password verification failed")
            return None
    except Exception as e:
        print(f"Password verification error: {e}")
        return None

    return user


# === Test Function ===
def test_password_system():
    """Test function to verify the password system is working correctly"""
    test_email = "test@example.com"
    test_password = "SecurePassword123!"

    print("\n=== Testing Password System ===")

    # Create a test user
    print("Creating test user...")
    test_user = create_volunteer({
        'email': test_email,
        'name': 'Test User',
        'password': test_password,
        'user_type': 'volunteer'
    })
    print(f"User created with ID: {test_user.get('id')}")

    # Try to verify the user
    print("\nVerifying with correct password...")
    user = verify_user(test_email, test_password)
    print(f"Verification successful: {user is not None}")

    # Check with wrong password
    print("\nVerifying with incorrect password...")
    user = verify_user(test_email, "WrongPassword")
    print(f"Verification successful (should be False): {user is not None}")

    print("=== Password System Test Complete ===\n")


# === Opportunities ===
def get_all_opportunities() -> List[Dict[str, Any]]:
    try:
        df = pd.read_csv(OPPORTUNITIES_FILE)
        opportunities = []

        for _, row in df.iterrows():
            opp = row.to_dict()
            opp['skills_required'] = deserialize_list(opp.get('skills_required', '[]'))
            opp['interests'] = deserialize_list(opp.get('interests', '[]'))
            opp['time_requirements'] = deserialize_dict(opp.get('time_requirements', '{}'))
            opportunities.append(opp)

        return opportunities
    except Exception as e:
        print(f"Opportunity load error: {e}")
        return []


def get_organization_by_id(org_id: int) -> Optional[Dict[str, Any]]:
    try:
        df = pd.read_csv(ORGANIZATIONS_FILE)
        match = df[df['id'] == org_id]
        if not match.empty:
            user = match.iloc[0].to_dict()
            # Decode the password hash if needed
            if 'password' in user:
                user['password'] = decode_password(user.get('password'))
            return user
    except Exception as e:
        print(f"Error getting organization by ID: {e}")
    return None

# Run the test if needed
# test_password_system()