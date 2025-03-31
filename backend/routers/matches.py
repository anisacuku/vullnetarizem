from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any

from ..routers.auth import get_current_user
from backend.ml_engine.matching_algorithm import match_volunteer_with_opportunities

router = APIRouter()


@router.get("/")
async def get_matches(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user.get("user_type") != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can view matches")

    # Extract volunteer profile from current user
    volunteer_profile = {
        "id": current_user.get("id"),
        "skills": current_user.get("skills", []),
        "interests": current_user.get("interests", []),
        "availability": current_user.get("availability", {})
    }

    # Get matched opportunities
    matches = match_volunteer_with_opportunities(volunteer_profile)

    return matches