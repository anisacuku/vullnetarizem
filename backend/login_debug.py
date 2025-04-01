from passlib.context import CryptContext
import pandas as pd

# Setup the password context (same as in your application)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define the path to your volunteers.csv file
VOLUNTEERS_FILE = "data/volunteers.csv"


# Read the volunteers data
def check_login(email, password):
    print(f"Attempting to login with email: {email}")

    try:
        # Load the volunteers data
        df = pd.read_csv(VOLUNTEERS_FILE, dtype={'password': str, 'email': str})

        # Find the user with the given email
        user_match = df[df['email'] == email]

        if user_match.empty:
            print(f"No user found with email: {email}")
            return False

        # Get the stored hash
        user = user_match.iloc[0].to_dict()
        stored_hash = user.get('password')

        if not stored_hash:
            print("No password hash found for user")
            return False

        # Print the stored hash for debugging
        print(f"Stored hash: {stored_hash}")

        # Try to verify the password
        try:
            verification_result = pwd_context.verify(password, stored_hash)
            print(f"Password verification result: {verification_result}")
            return verification_result
        except Exception as e:
            print(f"Password verification error: {e}")
            return False

    except Exception as e:
        print(f"Error loading user data: {e}")
        return False


# Test with the actual users from the CSV
def test_logins():
    print("===== TESTING USER LOGINS =====")

    # Print all users for debugging
    try:
        df = pd.read_csv(VOLUNTEERS_FILE)
        print("\nUsers in database:")
        for _, row in df.iterrows():
            print(
                f"ID: {row['id']}, Email: {row['email']}, Name: {row['name']}, Password hash: {row['password'][:20]}...")
    except Exception as e:
        print(f"Error loading users: {e}")

    # Test cases using the actual users from your data
    test_cases = [
        {"email": "acuku@epoka.al", "password": "password123"},
        {"email": "acuku@epoka.al", "password": "wrongpassword"},
        {"email": "anisacuku07@gmail.com", "password": "password123"},
        {"email": "test123@gmail.com", "password": "password123"}
    ]

    for case in test_cases:
        print(f"\nTesting login for {case['email']} with password: {case['password']}")
        result = check_login(case['email'], case['password'])
        print(f"Login successful: {result}")


# Create a hash for a known password for testing
def create_test_hash(password="password123"):
    hashed = pwd_context.hash(password)
    print(f"\nTest password hash for '{password}': {hashed}")
    return hashed


if __name__ == "__main__":
    # First, create a test hash to see what a correct hash should look like
    test_hash = create_test_hash()

    # Now test verifying with this known hash
    test_password = "password123"
    verification = pwd_context.verify(test_password, test_hash)
    print(f"Verification of test password against generated hash: {verification}")

    # Test the actual logins
    test_logins()