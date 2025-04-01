from typing import Dict, List, Any, Tuple, Set
import math
from .text_processor import TextProcessor


class EnhancedMatchingAlgorithm:
    """
    Enhanced matching algorithm to connect volunteers with opportunities.
    Using natural language processing, advanced weighting, and personalized scoring.
    """

    def __init__(self, language='albanian'):
        """Initialize the matching algorithm with specified language."""
        self.text_processor = TextProcessor(language)

        # Configure match weights (these can be tuned based on feedback)
        self.weights = {
            'skills': 0.40,
            'interests': 0.30,
            'availability': 0.15,
            'location': 0.15
        }

    def find_matches_for_volunteer(self,
                                   volunteer: Dict[str, Any],
                                   opportunities: List[Dict[str, Any]],
                                   min_score: float = 0.0) -> List[Dict[str, Any]]:
        """
        Find matching opportunities for a volunteer with enhanced scoring.

        Args:
            volunteer: Volunteer profile with skills, interests, availability
            opportunities: List of opportunities to match against
            min_score: Minimum match score to include (0-100)

        Returns:
            List of opportunities with match scores and detailed match breakdown
        """
        if not opportunities:
            return []

        matches = []

        # Extract volunteer data
        volunteer_skills = set(s.lower() for s in volunteer.get("skills", []))
        volunteer_interests = set(i.lower() for i in volunteer.get("interests", []))
        volunteer_availability = volunteer.get("availability", {})
        volunteer_location = volunteer.get("location", "")
        if not volunteer_location and "city" in volunteer:
            volunteer_location = volunteer.get("city", "")

        # Calculate personality vector (if personality data is available)
        volunteer_personality = self._extract_personality_traits(volunteer)

        for opportunity in opportunities:
            # Extract opportunity data
            opp_skills = set(s.lower() for s in opportunity.get("skills_required", []))
            opp_interests = set(i.lower() for i in opportunity.get("interests", []))
            opp_time_reqs = opportunity.get("time_requirements", {})
            opp_location = opportunity.get("location", "")

            # Parse recommended skills if available
            opp_recommended_skills = set(s.lower() for s in opportunity.get("recommended_skills", []))

            # Calculate skill match
            skill_score, matched_skills, missing_skills = self._calculate_skill_match(
                volunteer_skills, opp_skills, opp_recommended_skills
            )

            # Calculate interest match with semantic similarity
            interest_score, matching_interests = self._calculate_interest_match(
                volunteer_interests, opp_interests
            )

            # Calculate availability match
            availability_score = self._calculate_availability_match(
                volunteer_availability, opp_time_reqs
            )

            # Calculate location match
            location_score = self._calculate_location_match(
                volunteer_location, opp_location
            )

            # Calculate personality match if data is available
            personality_score = self._calculate_personality_match(
                volunteer_personality, opportunity.get("personality_traits", {})
            )

            # Calculate weighted final score
            final_score = (
                    self.weights['skills'] * skill_score +
                    self.weights['interests'] * interest_score +
                    self.weights['availability'] * availability_score +
                    self.weights['location'] * location_score
            )

            # Add personality boost if available (as a bonus factor)
            if personality_score > 0:
                # Apply personality as a smaller boost factor (5%)
                final_score = final_score * (1.0 + (personality_score * 0.05))

            # Skip opportunities below the minimum score
            if final_score < min_score:
                continue

            # Create match object with detailed breakdown
            match = {
                "opportunity": opportunity,
                "match_score": round(final_score, 1),
                "match_details": {
                    "skill_score": round(skill_score, 1),
                    "matched_skills": list(matched_skills),
                    "missing_skills": list(missing_skills),
                    "interest_score": round(interest_score, 1),
                    "matching_interests": list(matching_interests),
                    "availability_score": round(availability_score, 1),
                    "location_score": round(location_score, 1)
                }
            }

            # Add personality score if available
            if personality_score > 0:
                match["match_details"]["personality_score"] = round(personality_score, 1)

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
        opp_recommended_skills = set(s.lower() for s in opportunity.get("recommended_skills", []))
        opp_interests = set(i.lower() for i in opportunity.get("interests", []))
        opp_time_reqs = opportunity.get("time_requirements", {})
        opp_location = opportunity.get("location", "")
        opp_personality = self._extract_personality_traits(opportunity)

        for volunteer in volunteers:
            # Extract volunteer data
            volunteer_skills = set(s.lower() for s in volunteer.get("skills", []))
            volunteer_interests = set(i.lower() for i in volunteer.get("interests", []))
            volunteer_availability = volunteer.get("availability", {})
            volunteer_location = volunteer.get("location", "")
            if not volunteer_location and "city" in volunteer:
                volunteer_location = volunteer.get("city", "")
            volunteer_personality = self._extract_personality_traits(volunteer)

            # Calculate skill match
            skill_score, volunteer_has, volunteer_missing = self._calculate_skill_match(
                volunteer_skills, opp_skills, opp_recommended_skills
            )

            # Calculate interest match
            interest_score, matching_interests = self._calculate_interest_match(
                volunteer_interests, opp_interests
            )

            # Calculate availability match
            availability_score = self._calculate_availability_match(
                volunteer_availability, opp_time_reqs
            )

            # Calculate location match
            location_score = self._calculate_location_match(
                volunteer_location, opp_location
            )

            # Calculate personality match if data is available
            personality_score = self._calculate_personality_match(
                volunteer_personality, opp_personality
            )

            # Calculate weighted final score
            final_score = (
                    self.weights['skills'] * skill_score +
                    self.weights['interests'] * interest_score +
                    self.weights['availability'] * availability_score +
                    self.weights['location'] * location_score
            )

            # Add personality boost if available
            if personality_score > 0:
                final_score = final_score * (1.0 + (personality_score * 0.05))

            # Skip volunteers below the minimum score
            if final_score < min_score:
                continue

            # Create match object with detailed breakdown
            match = {
                "volunteer": volunteer,
                "match_score": round(final_score, 1),
                "match_details": {
                    "skill_score": round(skill_score, 1),
                    "volunteer_has_skills": list(volunteer_has),
                    "volunteer_missing_skills": list(volunteer_missing),
                    "interest_score": round(interest_score, 1),
                    "matching_interests": list(matching_interests),
                    "availability_score": round(availability_score, 1),
                    "location_score": round(location_score, 1)
                }
            }

            # Add personality score if available
            if personality_score > 0:
                match["match_details"]["personality_score"] = round(personality_score, 1)

            matches.append(match)

        # Sort by match score descending
        matches.sort(key=lambda x: x["match_score"], reverse=True)

        return matches

    def _calculate_skill_match(self,
                               volunteer_skills: Set[str],
                               required_skills: Set[str],
                               recommended_skills: Set[str] = None) -> Tuple[float, Set[str], Set[str]]:
        """
        Calculate skill match percentage between volunteer skills and required skills.
        Includes weighting for required vs recommended skills.

        Returns:
            Tuple containing (match_percentage, matched_skills, missing_skills)
        """
        if recommended_skills is None:
            recommended_skills = set()

        if not required_skills and not recommended_skills:
            return 100.0, set(), set()  # No skills required means perfect match

        if not volunteer_skills:
            return 0.0, set(), required_skills  # No volunteer skills means no match

        # Find matching and missing skills
        matched_required = volunteer_skills.intersection(required_skills)
        missing_required = required_skills - volunteer_skills

        # Check for partial matches using substrings
        partial_matches = set()
        for req_skill in missing_required.copy():
            for vol_skill in volunteer_skills:
                # Check for partial matches (e.g., "programming" matches "python programming")
                if (req_skill in vol_skill) or (vol_skill in req_skill):
                    partial_matches.add(req_skill)
                    # Consider it a partial match, not entirely missing
                    if req_skill in missing_required:
                        missing_required.remove(req_skill)

        # Find matching recommended skills
        matched_recommended = volunteer_skills.intersection(recommended_skills)

        # Calculate match percentage with weighting
        # Required skills are 80% of the weight, recommended are 20%
        if required_skills:
            required_match = (len(matched_required) + (len(partial_matches) * 0.5)) / len(required_skills)
            required_score = required_match * 80
        else:
            required_score = 80  # Full points if no required skills

        if recommended_skills:
            recommended_match = len(matched_recommended) / len(recommended_skills)
            recommended_score = recommended_match * 20
        else:
            recommended_score = 20  # Full points if no recommended skills

        total_score = required_score + recommended_score

        # Combine matches for return
        all_matched = matched_required.union(matched_recommended).union(partial_matches)

        return total_score, all_matched, missing_required

    def _calculate_interest_match(self,
                                  volunteer_interests: Set[str],
                                  opportunity_interests: Set[str]) -> Tuple[float, Set[str]]:
        """
        Calculate interest alignment between volunteer interests and opportunity interests.
        Uses semantic similarity for improved matching.

        Returns:
            Tuple containing (alignment_score, matching_interests)
        """
        if not opportunity_interests:
            return 50.0, set()  # Neutral score if no interests specified by opportunity

        if not volunteer_interests:
            return 30.0, set()  # Low match if volunteer has no interests

        # Find exact matching interests
        exact_matches = volunteer_interests.intersection(opportunity_interests)

        # Find semantic matches (using the text processor for similar meanings)
        semantic_matches = set()
        for v_interest in volunteer_interests:
            for o_interest in opportunity_interests:
                # Skip exact matches as they're already counted
                if v_interest == o_interest:
                    continue

                # Look for semantic similarity (implemented in text processor)
                if self._are_semantically_similar(v_interest, o_interest):
                    semantic_matches.add(o_interest)

        # Combine exact and semantic matches for interest display
        all_matches = exact_matches.union(semantic_matches)

        # Use Jaccard similarity with semantic boost for interests
        union_size = len(volunteer_interests.union(opportunity_interests))

        if not union_size:
            return 50.0, set()

        # Count exact matches fully and semantic matches at 0.75 weight
        weighted_match_count = len(exact_matches) + (len(semantic_matches) * 0.75)
        similarity = weighted_match_count / union_size

        # Convert to percentage
        interest_score = similarity * 100

        return interest_score, all_matches

    def _calculate_availability_match(self,
                                      volunteer_availability: Dict[str, bool],
                                      opportunity_times: Dict[str, bool]) -> float:
        """
        Calculate availability match percentage between volunteer and opportunity.

        Args:
            volunteer_availability: Dict of availability slots (weekdays, weekends, etc.)
            opportunity_times: Dict of required time slots or string description

        Returns:
            Match percentage between 0-100
        """
        # If no specific time requirements for opportunity, assume 100% match
        if not opportunity_times:
            return 100.0

        # If volunteer didn't specify availability, assume 50% match
        if not volunteer_availability:
            return 50.0

        # Handle string-based opportunity times
        if isinstance(opportunity_times, str):
            return self._calculate_string_availability_match(volunteer_availability, opportunity_times)

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

    def _calculate_string_availability_match(self,
                                             volunteer_availability: Dict[str, bool],
                                             opportunity_time_str: str) -> float:
        """
        Calculate availability match from a text description of time requirements.

        Args:
            volunteer_availability: Dict of availability slots
            opportunity_time_str: String description of time requirements

        Returns:
            Match percentage between 0-100
        """
        opportunity_time_str = opportunity_time_str.lower()

        # Start with a base score
        score = 50.0

        # Check for keywords that suggest certain availability patterns
        if "weekday" in opportunity_time_str or "ditët e punës" in opportunity_time_str:
            if volunteer_availability.get("weekdays", False):
                score += 20
            else:
                score -= 10

        if "weekend" in opportunity_time_str or "fundjavë" in opportunity_time_str:
            if volunteer_availability.get("weekends", False):
                score += 20
            else:
                score -= 10

        # Check time of day
        if "morning" in opportunity_time_str or "mëngjes" in opportunity_time_str:
            if volunteer_availability.get("mornings", False):
                score += 10
            else:
                score -= 5

        if "afternoon" in opportunity_time_str or "pasdite" in opportunity_time_str:
            if volunteer_availability.get("afternoons", False):
                score += 10
            else:
                score -= 5

        if "evening" in opportunity_time_str or "mbrëmje" in opportunity_time_str:
            if volunteer_availability.get("evenings", False):
                score += 10
            else:
                score -= 5

        # Flexible schedule is always a plus
        if "flexible" in opportunity_time_str or "fleksibël" in opportunity_time_str:
            score += 15

        # Ensure score stays within 0-100 range
        return max(0, min(100, score))

    def _calculate_location_match(self,
                                  volunteer_location: str,
                                  opportunity_location: str) -> float:
        """
        Calculate location match between volunteer and opportunity.

        Args:
            volunteer_location: Volunteer's preferred location or city
            opportunity_location: Opportunity location

        Returns:
            Match score between 0-100
        """
        if not volunteer_location or not opportunity_location:
            return 50.0  # Neutral score if either location is not specified

        volunteer_location = volunteer_location.lower()
        opportunity_location = opportunity_location.lower()

        # Perfect match if exactly the same city/location
        if volunteer_location == opportunity_location:
            return 100.0

        # Check for partial matches (one location is part of the other)
        if volunteer_location in opportunity_location or opportunity_location in volunteer_location:
            return 85.0

        # Check for nationwide opportunities
        if "shqipëri" in opportunity_location or "nationwide" in opportunity_location:
            return 75.0

        # Check for neighboring cities or regions (simplified version)
        # In a full implementation, you would have a proper distance or region database
        nearby_locations = {
            "tiranë": ["durrës", "vorë", "kamëz"],
            "durrës": ["tiranë", "shijak"],
            "vlorë": ["fier", "orikum"],
            "shkodër": ["lezhë", "koplik"],
            "elbasan": ["librazhd", "peqin"],
            # Add more as needed
        }

        volunteer_city = volunteer_location.split()[0]  # Get first word as city
        opportunity_city = opportunity_location.split()[0]  # Get first word as city

        if volunteer_city in nearby_locations and opportunity_city in nearby_locations.get(volunteer_city, []):
            return 70.0

        if opportunity_city in nearby_locations and volunteer_city in nearby_locations.get(opportunity_city, []):
            return 70.0

        # Low match score for different locations
        return 30.0

    def _extract_personality_traits(self, profile: Dict[str, Any]) -> Dict[str, float]:
        """
        Extract personality traits from profile if available.

        Args:
            profile: User or opportunity profile

        Returns:
            Dictionary of personality traits with values
        """
        traits = {}

        # Check if personality data exists in the profile
        if "personality" in profile and isinstance(profile["personality"], dict):
            traits = profile["personality"]

        # Alternative format some profiles might use
        elif "personality_traits" in profile and isinstance(profile["personality_traits"], dict):
            traits = profile["personality_traits"]

        return traits

    def _calculate_personality_match(self,
                                     volunteer_traits: Dict[str, float],
                                     opportunity_traits: Dict[str, float]) -> float:
        """
        Calculate personality compatibility score if data is available.

        Args:
            volunteer_traits: Volunteer's personality traits
            opportunity_traits: Opportunity's desired personality traits

        Returns:
            Compatibility score between 0-100, or 0 if data not available
        """
        # If either is missing personality data, skip this score
        if not volunteer_traits or not opportunity_traits:
            return 0

        # Calculate trait similarity using cosine similarity
        common_traits = set(volunteer_traits.keys()) & set(opportunity_traits.keys())

        if not common_traits:
            return 0

        # Calculate dot product
        dot_product = sum(volunteer_traits[trait] * opportunity_traits[trait] for trait in common_traits)

        # Calculate magnitudes
        vol_magnitude = math.sqrt(sum(value ** 2 for value in volunteer_traits.values()))
        opp_magnitude = math.sqrt(sum(value ** 2 for value in opportunity_traits.values()))

        # Avoid division by zero
        if vol_magnitude == 0 or opp_magnitude == 0:
            return 0

        # Calculate cosine similarity and convert to percentage
        similarity = (dot_product / (vol_magnitude * opp_magnitude)) * 100

        return similarity

    def _are_semantically_similar(self, term1: str, term2: str) -> bool:
        """
        Check if two terms are semantically similar.

        This is a placeholder for a more sophisticated semantic similarity function.
        In a real implementation, this could use word embeddings or a knowledge graph.

        Args:
            term1: First term
            term2: Second term

        Returns:
            Boolean indicating if terms are semantically similar
        """
        # Convert to lowercase for comparison
        term1 = term1.lower()
        term2 = term2.lower()

        # Check for substring matches
        if term1 in term2 or term2 in term1:
            return True

        # Simple synonym dictionary for Albanian
        # This could be expanded or replaced with a proper semantic model
        synonyms = {
            "mjedis": ["ekologji", "natyrë", "ambient"],
            "edukim": ["arsim", "mësim", "edukimi", "shkollë"],
            "fëmijë": ["të rinj", "të vegjël", "adoleshentë", "rini"],
            "kafshë": ["fauna", "qenie", "kafshët", "shtazë"],
            "teknologji": ["tech", "it", "digjital", "kompjuter"],
            "art": ["arte", "krijimtari", "kreativitet"],
            "komunikim": ["bisedë", "bashkëbisedim", "bashkëveprim"],
            "vullnetarizëm": ["vullnetar", "bamirësi", "ndihmë"]
        }

        # Check if either term is a known synonym of the other
        for key, values in synonyms.items():
            if term1 == key and term2 in values:
                return True
            if term2 == key and term1 in values:
                return True

        # Check for synonyms in both directions
        for values in synonyms.values():
            if term1 in values and term2 in values:
                return True

        return False


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
    matching_algorithm = EnhancedMatchingAlgorithm()

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
        elif "organization" in opportunity:
            organization_name = opportunity["organization"]

        result.append({
            "opportunity": {
                "id": opportunity.get("id"),
                "title": opportunity.get("title"),
                "description": opportunity.get("description"),
                "organization_id": opportunity.get("organization_id"),
                "organization_name": organization_name,
                "location": opportunity.get("location"),
                "date": opportunity.get("date"),
                "duration": opportunity.get("duration"),
                "time_requirements": opportunity.get("time_requirements")
            },
            "score": round(match["match_score"]),
            "matched_skills": match["match_details"].get("matched_skills", []),
            "matching_interests": match["match_details"].get("matching_interests", []),
            "score_breakdown": {
                "skills": round(match["match_details"].get("skill_score", 0)),
                "interests": round(match["match_details"].get("interest_score", 0)),
                "availability": round(match["match_details"].get("availability_score", 0)),
                "location": round(match["match_details"].get("location_score", 0)),
                "personality": round(match["match_details"].get("personality_score", 0)) if "personality_score" in
                                                                                            match[
                                                                                                "match_details"] else 0
            }
        })

    return result