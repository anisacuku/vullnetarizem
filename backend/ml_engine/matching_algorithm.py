from typing import Dict, List, Any, Tuple, Set
import math
from .text_processor import TextProcessor


class MatchingAlgorithm:
    """
    Core matching algorithm to connect volunteers with opportunities.
    Analyzes skills, interests, and availability to find optimal matches.
    """

    def __init__(self, language='albanian'):
        """Initialize the matching algorithm with specified language."""
        self.text_processor = TextProcessor(language)

    def find_matches_for_volunteer(self,
                                   volunteer: Dict[str, Any],
                                   opportunities: List[Dict[str, Any]],
                                   min_score: float = 0.0) -> List[Dict[str, Any]]:
        """
        Find matching opportunities for a volunteer.

        Args:
            volunteer: Volunteer profile with skills, interests, availability
            opportunities: List of opportunities to match against
            min_score: Minimum match score to include (0-100)

        Returns:
            List of opportunities with match scores and details
        """
        if not opportunities:
            return []

        matches = []

        # Extract volunteer data
        volunteer_skills = set(s.lower() for s in volunteer.get("skills", []))
        volunteer_interests = set(i.lower() for i in volunteer.get("interests", []))
        volunteer_availability = volunteer.get("availability", {})

        for opportunity in opportunities:
            # Extract opportunity data
            opp_skills = set(s.lower() for s in opportunity.get("skills_required", []))
            opp_interests = set(i.lower() for i in opportunity.get("interests", []))
            opp_time_reqs = opportunity.get("time_requirements", {})

            # Calculate skill match
            skill_score, matched_skills, missing_skills = self._calculate_skill_match(
                volunteer_skills, opp_skills
            )

            # Calculate interest match
            interest_score, matching_interests = self._calculate_interest_match(
                volunteer_interests, opp_interests
            )

            # Calculate availability match
            availability_score = self._calculate_availability_match(
                volunteer_availability, opp_time_reqs
            )

            # Calculate weighted final score (can be adjusted based on importance)
            final_score = (0.5 * skill_score) + (0.3 * interest_score) + (0.2 * availability_score)

            # Skip opportunities below the minimum score
            if final_score < min_score:
                continue

            # Create match object
            match = {
                "opportunity": opportunity,
                "match_score": round(final_score, 1),
                "match_details": {
                    "skill_score": round(skill_score, 1),
                    "matched_skills": list(matched_skills),
                    "missing_skills": list(missing_skills),
                    "interest_score": round(interest_score, 1),
                    "matching_interests": list(matching_interests),
                    "availability_score": round(availability_score, 1)
                }
            }

            matches.append(match)

        # Sort by match score descending
        matches.sort(key=lambda x: x["match_score"], reverse=True)

        return matches

    def find_volunteers_for_opportunity(self,
                                        opportunity: Dict[str, Any],
                                        volunteers: List[Dict[str, Any]],
                                        min_score: float = 0.0) -> List[Dict[str, Any]]:
        """
        Find matching volunteers for an opportunity.

        Args:
            opportunity: Opportunity details with requirements
            volunteers: List of volunteers to match against
            min_score: Minimum match score to include (0-100)

        Returns:
            List of volunteers with match scores and details
        """
        if not volunteers:
            return []

        matches = []

        # Extract opportunity data
        opp_skills = set(s.lower() for s in opportunity.get("skills_required", []))
        opp_interests = set(i.lower() for i in opportunity.get("interests", []))
        opp_time_reqs = opportunity.get("time_requirements", {})

        for volunteer in volunteers:
            # Extract volunteer data
            volunteer_skills = set(s.lower() for s in volunteer.get("skills", []))
            volunteer_interests = set(i.lower() for i in volunteer.get("interests", []))
            volunteer_availability = volunteer.get("availability", {})

            # Calculate skill match (reversed parameters for this perspective)
            skill_score, volunteer_has, volunteer_missing = self._calculate_skill_match(
                volunteer_skills, opp_skills
            )

            # Calculate interest match
            interest_score, matching_interests = self._calculate_interest_match(
                volunteer_interests, opp_interests
            )

            # Calculate availability match
            availability_score = self._calculate_availability_match(
                volunteer_availability, opp_time_reqs
            )

            # Calculate weighted final score
            final_score = (0.5 * skill_score) + (0.3 * interest_score) + (0.2 * availability_score)

            # Skip volunteers below the minimum score
            if final_score < min_score:
                continue

            # Create match object
            match = {
                "volunteer": volunteer,
                "match_score": round(final_score, 1),
                "match_details": {
                    "skill_score": round(skill_score, 1),
                    "volunteer_has_skills": list(volunteer_has),
                    "volunteer_missing_skills": list(volunteer_missing),
                    "interest_score": round(interest_score, 1),
                    "matching_interests": list(matching_interests),
                    "availability_score": round(availability_score, 1)
                }
            }

            matches.append(match)

        # Sort by match score descending
        matches.sort(key=lambda x: x["match_score"], reverse=True)

        return matches

    def _calculate_skill_match(self,
                               volunteer_skills: Set[str],
                               required_skills: Set[str]) -> Tuple[float, Set[str], Set[str]]:
        """
        Calculate skill match percentage between volunteer skills and required skills.

        Returns:
            Tuple containing (match_percentage, matched_skills, missing_skills)
        """
        if not required_skills:
            return 100.0, set(), set()  # No skills required means perfect match

        if not volunteer_skills:
            return 0.0, set(), required_skills  # No volunteer skills means no match

        # Find matching and missing skills
        matched_skills = volunteer_skills.intersection(required_skills)
        missing_skills = required_skills - volunteer_skills

        # Calculate match percentage
        match_percentage = (len(matched_skills) / len(required_skills)) * 100

        return match_percentage, matched_skills, missing_skills

    def _calculate_interest_match(self,
                                  volunteer_interests: Set[str],
                                  opportunity_interests: Set[str]) -> Tuple[float, Set[str]]:
        """
        Calculate interest alignment between volunteer interests and opportunity interests.

        Returns:
            Tuple containing (alignment_score, matching_interests)
        """
        if not opportunity_interests:
            return 50.0, set()  # Neutral score if no interests specified by opportunity

        if not volunteer_interests:
            return 30.0, set()  # Low match if volunteer has no interests

        # Find matching interests
        matching_interests = volunteer_interests.intersection(opportunity_interests)

        # Use Jaccard similarity for interests
        # (size of intersection / size of union)
        union = volunteer_interests.union(opportunity_interests)

        if not union:
            return 50.0, set()

        similarity = len(matching_interests) / len(union)

        # Convert to percentage
        interest_score = similarity * 100

        return interest_score, matching_interests

    def _calculate_availability_match(self,
                                      volunteer_availability: Dict[str, bool],
                                      opportunity_times: Dict[str, bool]) -> float:
        """
        Calculate availability match percentage between volunteer and opportunity.

        Returns:
            Match percentage between 0-100
        """
        # If no specific time requirements for opportunity, assume 100% match
        if not opportunity_times:
            return 100.0

        # If volunteer didn't specify availability, assume 50% match
        if not volunteer_availability:
            return 50.0

        # Count matching availability slots
        matches = 0
        total = 0

        for time_slot, required in opportunity_times.items():
            if required:
                total += 1
                if volunteer_availability.get(time_slot, False):
                    matches += 1

        if total == 0:
            return 100.0

        return (matches / total) * 100


# Main interface function for the router to use
def match_volunteer_with_opportunities(volunteer_profile: Dict[str, Any],
                                       all_opportunities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Main matching function to be used by the router.

    Args:
        volunteer_profile: Volunteer data including skills, interests, availability
        all_opportunities: List of all opportunities to match against

    Returns:
        List of opportunities with match scores
    """
    matching_algorithm = MatchingAlgorithm()

    matches = matching_algorithm.find_matches_for_volunteer(
        volunteer_profile,
        all_opportunities
    )

    # Format the result for the API
    result = []
    for match in matches:
        opportunity = match["opportunity"]

        # Include organization information if available
        organization_name = "Unknown Organization"
        if "organization_name" in opportunity:
            organization_name = opportunity["organization_name"]

        result.append({
            "opportunity": {
                "id": opportunity.get("id"),
                "title": opportunity.get("title"),
                "description": opportunity.get("description"),
                "organization_id": opportunity.get("organization_id"),
                "organization_name": organization_name,
                "location": opportunity.get("location"),
                "date": opportunity.get("date"),
                "duration": opportunity.get("duration")
            },
            "score": round(match["match_score"]),
            "matched_skills": match["match_details"]["matched_skills"],
            "matching_interests": match["match_details"]["matching_interests"]
        })

    return result