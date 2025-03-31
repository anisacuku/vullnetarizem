from typing import Dict, List, Any
import numpy as np
from ..services.database import get_all_opportunities, get_organization_by_id


def match_volunteer_with_opportunities(volunteer_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Match volunteer with opportunities based on skills, interests and availability

    Args:
        volunteer_profile: Dictionary containing volunteer details

    Returns:
        List of opportunities with match scores
    """
    # Get all opportunities from database
    opportunities = get_all_opportunities()

    # Prepare results list
    matches = []

    # Extract volunteer data
    volunteer_skills = set(s.lower() for s in volunteer_profile.get("skills", []))
    volunteer_interests = set(i.lower() for i in volunteer_profile.get("interests", []))
    volunteer_availability = volunteer_profile.get("availability", {})

    for opportunity in opportunities:
        # Extract opportunity data
        opp_skills = set(s.lower() for s in opportunity.get("skills_required", []))
        opp_interests = set(i.lower() for i in opportunity.get("interests", []))

        # Calculate skill match
        skill_score = calculate_skill_match(volunteer_skills, opp_skills)

        # Calculate interest match
        interest_score = calculate_interest_match(volunteer_interests, opp_interests)

        # Calculate availability match
        availability_score = calculate_availability_match(
            volunteer_availability,
            opportunity.get("time_requirements", {})
        )

        # Calculate final score (weighted average)
        final_score = (0.5 * skill_score) + (0.3 * interest_score) + (0.2 * availability_score)

        # Get organization info
        org_id = opportunity.get("organization_id")
        organization = get_organization_by_id(org_id)
        org_name = organization.get("name", "Unknown Organization") if organization else "Unknown Organization"

        # Create match object
        match = {
            "opportunity": {
                "id": opportunity.get("id"),
                "title": opportunity.get("title"),
                "description": opportunity.get("description"),
                "organization_id": org_id,
                "organization_name": org_name,
                "location": opportunity.get("location"),
                "date": opportunity.get("date"),
                "duration": opportunity.get("duration")
            },
            "score": round(final_score)
        }

        matches.append(match)

    # Sort by score (descending)
    matches.sort(key=lambda x: x["score"], reverse=True)

    return matches


def calculate_skill_match(volunteer_skills, required_skills):
    """Calculate skill match percentage"""
    if not required_skills:
        return 100  # No skills required means perfect match

    if not volunteer_skills:
        return 0  # No volunteer skills means no match

    matched_skills = volunteer_skills.intersection(required_skills)
    return (len(matched_skills) / len(required_skills)) * 100


def calculate_interest_match(volunteer_interests, opportunity_interests):
    """Calculate interest match percentage"""
    if not opportunity_interests:
        return 50  # Neutral score if no interests specified

    if not volunteer_interests:
        return 30  # Low match if volunteer has no interests

    matched_interests = volunteer_interests.intersection(opportunity_interests)
    total_interests = volunteer_interests.union(opportunity_interests)

    if not total_interests:
        return 50

    return (len(matched_interests) / len(total_interests)) * 100


def calculate_availability_match(volunteer_availability, opportunity_times):
    """Calculate availability match"""
    # If no specific time requirements, assume 100% match
    if not opportunity_times:
        return 100

    # If volunteer didn't specify availability, assume 50% match
    if not volunteer_availability:
        return 50

    # Count matching availability slots
    matches = 0
    total = 0

    for time_slot, required in opportunity_times.items():
        if required:
            total += 1
            if volunteer_availability.get(time_slot, False):
                matches += 1

    if total == 0:
        return 100

    return (matches / total) * 100