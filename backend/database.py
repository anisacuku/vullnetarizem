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
MATCHES_FILE = os.path.join(DATA_DIR, "matches.csv")

# === Password hashing ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# === Ensure data directory and files exist ===
os.makedirs(DATA_DIR, exist_ok=True)


def init_data_files():
    """Initialize data files with proper column structure if they don't exist."""
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

    if not os.path.exists(MATCHES_FILE):
        pd.DataFrame(columns=[
            'id', 'volunteer_id', 'opportunity_id', 'match_score',
            'status', 'volunteer_feedback', 'organization_feedback',
            'created_at', 'updated_at'
        ]).to_csv(MATCHES_FILE, index=False)


# Initialize data files on module import
init_data_files()


# === Serialization/Deserialization Helpers ===
def serialize_list(data):
    """Convert a list to a JSON string for storage in CSV."""
    return json.dumps(data) if isinstance(data, list) else "[]"


def serialize_dict(data):
    """Convert a dictionary to a JSON string for storage in CSV."""
    return json.dumps(data) if isinstance(data, dict) else "{}"


def deserialize_list(data):
    """Convert a JSON string to a list from CSV storage."""
    if pd.isna(data) or not data:
        return []
    try:
        return json.loads(data)
    except:
        return []


def deserialize_dict(data):
    """Convert a JSON string to a dictionary from CSV storage."""
    if pd.isna(data) or not data:
        return {}
    try:
        return json.loads(data)
    except:
        return {}


# === User Operations ===
def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Get a user (volunteer or organization) by email."""
    try:
        # First check volunteers
        df = pd.read_csv(VOLUNTEERS_FILE, dtype={'password': str, 'email': str})
        match = df[df['email'] == email]
        if not match.empty:
            user = match.iloc[0].to_dict()
            # Keep the password as is (we'll verify it directly)
            user['skills'] = deserialize_list(user.get('skills', '[]'))
            user['interests'] = deserialize_list(user.get('interests', '[]'))
            user['availability'] = deserialize_dict(user.get('availability', '{}'))
            return user
    except Exception as e:
        print(f"Volunteer lookup error: {e}")

    try:
        # Then check organizations
        df = pd.read_csv(ORGANIZATIONS_FILE, dtype={'password': str, 'email': str})
        match = df[df['email'] == email]
        if not match.empty:
            user = match.iloc[0].to_dict()
            return user
    except Exception as e:
        print(f"Organization lookup error: {e}")

    return None


def get_user_by_id(user_id: int, user_type: str) -> Optional[Dict[str, Any]]:
    """Get a user by ID and type."""
    try:
        file_path = VOLUNTEERS_FILE if user_type == "volunteer" else ORGANIZATIONS_FILE
        df = pd.read_csv(file_path)
        match = df[df['id'] == user_id]
        if not match.empty:
            user = match.iloc[0].to_dict()

            # Process volunteer-specific fields
            if user_type == "volunteer":
                user['skills'] = deserialize_list(user.get('skills', '[]'))
                user['interests'] = deserialize_list(user.get('interests', '[]'))
                user['availability'] = deserialize_dict(user.get('availability', '{}'))

            return user
    except Exception as e:
        print(f"User lookup error: {e}")

    return None


def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new user (volunteer or organization)."""
    if user_data.get("user_type") == "organization":
        return create_organization(user_data)
    return create_volunteer(user_data)


def create_volunteer(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new volunteer user."""
    try:
        df = pd.read_csv(VOLUNTEERS_FILE)
        new_id = int(df['id'].max()) + 1 if not df.empty else 1

        # Create a copy of data for storage
        storage_data = data.copy()
        storage_data['id'] = new_id

        # Hash the password (already hashed in auth.py)
        storage_data['password'] = data['password']  # This is already hashed

        # Serialize complex data
        storage_data['skills'] = serialize_list(data.get('skills', []))
        storage_data['interests'] = serialize_list(data.get('interests', []))
        storage_data['availability'] = serialize_dict(data.get('availability', {}))

        # Add to dataframe and save
        df = pd.concat([df, pd.DataFrame([storage_data])], ignore_index=True)
        df.to_csv(VOLUNTEERS_FILE, index=False)

        # For the return value
        result = data.copy()
        result['id'] = new_id
        if 'password' in result:
            del result['password']  # Don't return the password
        return result
    except Exception as e:
        print(f"Error creating volunteer: {e}")
        return {}


def create_organization(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new organization user."""
    try:
        df = pd.read_csv(ORGANIZATIONS_FILE)
        new_id = int(df['id'].max()) + 1 if not df.empty else 1

        # Create a copy for storage
        storage_data = data.copy()
        storage_data['id'] = new_id

        # Hash the password (already hashed in auth.py)
        storage_data['password'] = data['password']  # This is already hashed

        # Add to dataframe and save
        df = pd.concat([df, pd.DataFrame([storage_data])], ignore_index=True)
        df.to_csv(ORGANIZATIONS_FILE, index=False)

        # For the return object
        result = data.copy()
        result['id'] = new_id
        if 'password' in result:
            del result['password']  # Don't return the password
        return result
    except Exception as e:
        print(f"Error creating organization: {e}")
        return {}


def verify_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Verify user credentials for login."""
    user = get_user_by_email(email)
    if not user:
        print(f"No user found with email: {email}")
        return None

    # Get the stored hashed password
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

    # Password verified successfully
    return user


# === Opportunity Operations ===
def get_all_opportunities() -> List[Dict[str, Any]]:
    """Get all available opportunities."""
    try:
        df = pd.read_csv(OPPORTUNITIES_FILE)
        if df.empty:
            return []

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


def get_opportunity_by_id(opportunity_id: int) -> Optional[Dict[str, Any]]:
    """Get an opportunity by ID."""
    try:
        df = pd.read_csv(OPPORTUNITIES_FILE)
        match = df[df['id'] == opportunity_id]
        if not match.empty:
            opp = match.iloc[0].to_dict()
            opp['skills_required'] = deserialize_list(opp.get('skills_required', '[]'))
            opp['interests'] = deserialize_list(opp.get('interests', '[]'))
            opp['time_requirements'] = deserialize_dict(opp.get('time_requirements', '{}'))
            return opp
    except Exception as e:
        print(f"Error getting opportunity by ID: {e}")

    return None


def create_opportunity(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new opportunity."""
    try:
        df = pd.read_csv(OPPORTUNITIES_FILE)
        new_id = int(df['id'].max()) + 1 if not df.empty else 1

        # Create a copy for storage
        storage_data = data.copy()
        storage_data['id'] = new_id

        # Serialize complex data
        storage_data['skills_required'] = serialize_list(data.get('skills_required', []))
        storage_data['interests'] = serialize_list(data.get('interests', []))
        storage_data['time_requirements'] = serialize_dict(data.get('time_requirements', {}))

        # Add to dataframe and save
        df = pd.concat([df, pd.DataFrame([storage_data])], ignore_index=True)
        df.to_csv(OPPORTUNITIES_FILE, index=False)

        # For the return object
        result = data.copy()
        result['id'] = new_id
        return result
    except Exception as e:
        print(f"Error creating opportunity: {e}")
        return {}


def get_organization_by_id(org_id: int) -> Optional[Dict[str, Any]]:
    """Get an organization by ID."""
    return get_user_by_id(org_id, "organization")


# === Match Operations ===
def create_match(volunteer_id: int, opportunity_id: int, match_score: float) -> Dict[str, Any]:
    """Create a new match between volunteer and opportunity."""
    try:
        df = pd.read_csv(MATCHES_FILE)
        new_id = int(df['id'].max()) + 1 if not df.empty else 1

        match_data = {
            'id': new_id,
            'volunteer_id': volunteer_id,
            'opportunity_id': opportunity_id,
            'match_score': match_score,
            'status': 'pending',
            'volunteer_feedback': serialize_dict({}),
            'organization_feedback': serialize_dict({}),
            'created_at': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        # Add to dataframe and save
        df = pd.concat([df, pd.DataFrame([match_data])], ignore_index=True)
        df.to_csv(MATCHES_FILE, index=False)

        return match_data
    except Exception as e:
        print(f"Error creating match: {e}")
        return {}


def get_volunteer_matches(volunteer_id: int) -> List[Dict[str, Any]]:
    """Get all matches for a specific volunteer."""
    try:
        matches_df = pd.read_csv(MATCHES_FILE)
        vol_matches = matches_df[matches_df['volunteer_id'] == volunteer_id]

        if vol_matches.empty:
            return []

        result = []
        for _, match in vol_matches.iterrows():
            match_dict = match.to_dict()

            # Get opportunity details
            opportunity = get_opportunity_by_id(match_dict['opportunity_id'])
            if opportunity:
                # Get organization details
                organization = get_organization_by_id(opportunity['organization_id'])
                org_name = organization['name'] if organization else "Unknown Organization"

                # Create rich match object
                match_obj = {
                    'id': match_dict['id'],
                    'status': match_dict['status'],
                    'match_score': match_dict['match_score'],
                    'created_at': match_dict['created_at'],
                    'opportunity': {
                        'id': opportunity['id'],
                        'title': opportunity['title'],
                        'description': opportunity['description'],
                        'organization_id': opportunity['organization_id'],
                        'organization_name': org_name,
                        'location': opportunity['location'],
                        'date': opportunity['date'],
                        'duration': opportunity['duration']
                    },
                    'volunteer_feedback': deserialize_dict(match_dict['volunteer_feedback']),
                    'organization_feedback': deserialize_dict(match_dict['organization_feedback'])
                }
                result.append(match_obj)

        return result
    except Exception as e:
        print(f"Error getting volunteer matches: {e}")
        return []


def update_match_status(match_id: int, status: str) -> bool:
    """Update the status of a match."""
    try:
        df = pd.read_csv(MATCHES_FILE)
        match_idx = df[df['id'] == match_id].index

        if match_idx.empty:
            return False

        df.loc[match_idx, 'status'] = status
        df.loc[match_idx, 'updated_at'] = pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
        df.to_csv(MATCHES_FILE, index=False)

        return True
    except Exception as e:
        print(f"Error updating match status: {e}")
        return False


def add_match_feedback(match_id: int, feedback: Dict[str, Any], feedback_type: str) -> bool:
    """Add feedback to a match from either volunteer or organization."""
    try:
        df = pd.read_csv(MATCHES_FILE)
        match_idx = df[df['id'] == match_id].index

        if match_idx.empty:
            return False

        feedback_column = 'volunteer_feedback' if feedback_type == 'volunteer' else 'organization_feedback'
        df.loc[match_idx, feedback_column] = serialize_dict(feedback)
        df.loc[match_idx, 'updated_at'] = pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
        df.to_csv(MATCHES_FILE, index=False)

        return True
    except Exception as e:
        print(f"Error adding match feedback: {e}")
        return False