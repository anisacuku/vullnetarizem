# password_reset.py
from passlib.context import CryptContext
import pandas as pd

# Setup password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# File path
VOLUNTEERS_FILE = "data/volunteers.csv"


def reset_password(email, new_password):
    """Reset password for a specific user."""
    try:
        # Read the file
        df = pd.read_csv(VOLUNTEERS_FILE)

        # Find the user
        user_idx = df[df['email'] == email].index

        if user_idx.empty:
            print(f"User not found: {email}")
            return False

        # Hash the new password
        new_hash = pwd_context.hash(new_password)

        # Update the password
        df.loc[user_idx, 'password'] = new_hash

        # Save the file
        df.to_csv(VOLUNTEERS_FILE, index=False)

        print(f"Password reset successful for {email}")
        print(f"New password hash: {new_hash}")

        # Verify the new password works
        verification = pwd_context.verify(new_password, new_hash)
        print(f"Password verification test: {verification}")

        return True

    except Exception as e:
        print(f"Error resetting password: {e}")
        return False


# Reset Anisa's password
reset_password("anisacuku07@gmail.com", "Anisa1234")