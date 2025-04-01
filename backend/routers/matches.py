from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any
from pydantic import BaseModel

from services.auth import get_current_user
from database import (
    get_all_opportunities,
    get_volunteer_matches,
    create_match,
    update_match_status,
    add_match_feedback,
    get_opportunity_by_id
)
from ml.matching_algorithm import match_volunteer_with_opportunities

router = APIRouter()


class MatchFeedback(BaseModel):
    """Feedback model for matches."""
    rating: int  # 1-5 rating
    comment: str = ""


class MatchStatusUpdate(BaseModel):
    """Status update model for matches."""
    status: str  # "accepted", "declined", "completed", etc.


@router.get("/")
async def get_matches(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get matches for the current user.
    For volunteers: returns recommended opportunities.
    For organizations: returns volunteers who match their opportunities.
    """
    if current_user.get("user_type") == "volunteer":
        # Get volunteer matches (both existing and potential)

        # First get existing matches
        existing_matches = get_volunteer_matches(current_user.get("id"))

        # Then get potential matches
        volunteer_profile = {
            "id": current_user.get("id"),
            "skills": current_user.get("skills", []),
            "interests": current_user.get("interests", []),
            "availability": current_user.get("availability", {})
        }

        # Get all opportunities
        all_opportunities = get_all_opportunities()

        # Find matches
        potential_matches = match_volunteer_with_opportunities(
            volunteer_profile,
            all_opportunities
        )

        # Combine existing and potential matches
        # Mark existing matches as "matched" and potential as "recommended"
        existing_ids = set(match["opportunity"]["id"] for match in existing_matches)

        recommendations = []
        for match in potential_matches:
            opp_id = match["opportunity"]["id"]
            if opp_id not in existing_ids:
                match["status"] = "recommended"
                recommendations.append(match)

        # Format existing matches to match the structure of recommendations
        formatted_existing = []
        for match in existing_matches:
            formatted_match = {
                "opportunity": match["opportunity"],
                "score": match["match_score"],
                "status": match["status"],
                "id": match["id"]
            }
            if "volunteer_feedback" in match:
                formatted_match["feedback"] = match["volunteer_feedback"]

            formatted_existing.append(formatted_match)

        return {
            "matches": formatted_existing,
            "recommendations": recommendations
        }

    elif current_user.get("user_type") == "organization":
        # For organizations, we would implement logic to find
        # volunteers matching their opportunities
        return {
            "message": "Organization matches are not implemented yet"
        }

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid user type"
        )


@router.post("/{opportunity_id}")
async def create_new_match(
        opportunity_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new match between the current volunteer and an opportunity."""
    if current_user.get("user_type") != "volunteer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only volunteers can create matches"
        )

    # Verify the opportunity exists
    opportunity = get_opportunity_by_id(opportunity_id)
    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Opportunity not found"
        )

    # Calculate match score
    volunteer_profile = {
        "id": current_user.get("id"),
        "skills": current_user.get("skills", []),
        "interests": current_user.get("interests", []),
        "availability": current_user.get("availability", {})
    }

    # Calculate match score
    matches = match_volunteer_with_opportunities(
        volunteer_profile,
        [opportunity]
    )

    if not matches:
        # If no match was returned, use a default score
        match_score = 50.0
    else:
        match_score = matches[0]["score"]

    # Create the match
    new_match = create_match(
        volunteer_id=current_user.get("id"),
        opportunity_id=opportunity_id,
        match_score=match_score
    )

    if not new_match:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create match"
        )

    return {
        "message": "Match created successfully",
        "match_id": new_match.get("id"),
        "match_score": match_score
    }


@router.patch("/{match_id}/status")
async def update_match_status_endpoint(
        match_id: int,
        status_update: MatchStatusUpdate,
        current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update the status of a match."""
    # Verify the matches belong to the user (implementation would depend on database structure)
    # For now, we'll just update the status

    success = update_match_status(match_id, status_update.status)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found or could not be updated"
        )

    return {"message": f"Match status updated to {status_update.status}"}


@router.post("/{match_id}/feedback")
async def add_feedback_to_match(
        match_id: int,
        feedback: MatchFeedback,
        current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Add feedback to a match."""
    feedback_type = current_user.get("user_type")

    success = add_match_feedback(
        match_id,
        feedback.dict(),
        feedback_type
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found or could not be updated"
        )

    return {"message": "Feedback added successfully"}