from typing import Dict, List, Any, Tuple, Set
import math
from .text_processor import TextProcessor

# Optional semantic embedding matcher
try:
    from .semantic_matcher import semantic_match_score
except Exception:
    semantic_match_score = None


class EnhancedMatchingAlgorithm:
    """
    Enhanced AI matching algorithm combining:
    - Skill matching
    - Interest matching
    - Semantic embedding similarity
    - Availability compatibility
    - Location compatibility
    """

    def __init__(self, language: str = "albanian"):
        self.text_processor = TextProcessor(language)

        # All scores are 0–100 and weights sum to 1.0
        self.weights = {
            "skills": 0.35,
            "interests": 0.25,
            "semantic": 0.20,
            "availability": 0.10,
            "location": 0.10,
        }

        # 🔥 Disabled hard constraints (so matches always return during testing)
        self.min_required_skill_score = 0.0
        self.min_availability_score = 0.0

    # --------------------------------------------------
    # MAIN MATCHING FUNCTION
    # --------------------------------------------------

    def find_matches_for_volunteer(
        self,
        volunteer: Dict[str, Any],
        opportunities: List[Dict[str, Any]],
        min_score: float = 0.0,
    ) -> List[Dict[str, Any]]:

        if not opportunities:
            return []

        matches = []

        volunteer_skills = set(s.lower() for s in volunteer.get("skills", []))
        volunteer_interests = set(i.lower() for i in volunteer.get("interests", []))
        volunteer_availability = volunteer.get("availability", {})
        volunteer_location = volunteer.get("location", "") or volunteer.get("city", "")

        volunteer_personality = self._extract_personality_traits(volunteer)

        for opportunity in opportunities:

            opp_skills = set(s.lower() for s in opportunity.get("skills_required", []))
            opp_recommended = set(s.lower() for s in opportunity.get("recommended_skills", []))
            opp_interests = set(i.lower() for i in opportunity.get("interests", []))
            opp_time = opportunity.get("time_requirements", {})
            opp_location = opportunity.get("location", "")

            skill_score, matched_skills, missing_skills = self._calculate_skill_match(
                volunteer_skills, opp_skills, opp_recommended
            )

            interest_score, matching_interests = self._calculate_interest_match(
                volunteer_interests, opp_interests
            )

            semantic_score = self._calculate_semantic_match(volunteer, opportunity)

            availability_score = self._calculate_availability_match(
                volunteer_availability, opp_time
            )

            location_score = self._calculate_location_match(
                volunteer_location, opp_location
            )

            personality_score = self._calculate_personality_match(
                volunteer_personality,
                opportunity.get("personality_traits", {})
            )

            # Weighted final score
            final_score = (
                self.weights["skills"] * skill_score +
                self.weights["interests"] * interest_score +
                self.weights["semantic"] * semantic_score +
                self.weights["availability"] * availability_score +
                self.weights["location"] * location_score
            )

            # Optional personality boost
            if personality_score > 0:
                final_score *= (1.0 + personality_score * 0.05)

            if final_score < min_score:
                continue

            match = {
                "opportunity": opportunity,
                "match_score": round(final_score, 1),
                "match_details": {
                    "skill_score": round(skill_score, 1),
                    "matched_skills": list(matched_skills),
                    "missing_skills": list(missing_skills),
                    "interest_score": round(interest_score, 1),
                    "semantic_score": round(semantic_score, 1),
                    "matching_interests": list(matching_interests),
                    "availability_score": round(availability_score, 1),
                    "location_score": round(location_score, 1),
                }
            }

            if personality_score > 0:
                match["match_details"]["personality_score"] = round(personality_score, 1)

            matches.append(match)

        matches.sort(key=lambda x: x["match_score"], reverse=True)
        return matches

    # --------------------------------------------------
    # SKILL MATCHING
    # --------------------------------------------------

    def _calculate_skill_match(
        self,
        volunteer_skills: Set[str],
        required_skills: Set[str],
        recommended_skills: Set[str] = None
    ) -> Tuple[float, Set[str], Set[str]]:

        if recommended_skills is None:
            recommended_skills = set()

        if not required_skills and not recommended_skills:
            return 100.0, set(), set()

        if not volunteer_skills:
            return 0.0, set(), required_skills

        matched_required = volunteer_skills.intersection(required_skills)
        missing_required = required_skills - volunteer_skills

        partial_matches = set()
        for req in missing_required.copy():
            for vol in volunteer_skills:
                if req in vol or vol in req:
                    partial_matches.add(req)
                    missing_required.remove(req)
                    break

        matched_recommended = volunteer_skills.intersection(recommended_skills)

        required_score = (
            ((len(matched_required) + 0.5 * len(partial_matches)) / len(required_skills)) * 80
            if required_skills else 80
        )

        recommended_score = (
            (len(matched_recommended) / len(recommended_skills)) * 20
            if recommended_skills else 20
        )

        total_score = required_score + recommended_score
        all_matched = matched_required.union(matched_recommended).union(partial_matches)

        return total_score, all_matched, missing_required

    # --------------------------------------------------
    # INTEREST MATCHING
    # --------------------------------------------------

    def _calculate_interest_match(
        self,
        volunteer_interests: Set[str],
        opportunity_interests: Set[str]
    ) -> Tuple[float, Set[str]]:

        if not opportunity_interests:
            return 50.0, set()

        if not volunteer_interests:
            return 30.0, set()

        exact_matches = volunteer_interests.intersection(opportunity_interests)

        semantic_matches = set()
        for v in volunteer_interests:
            for o in opportunity_interests:
                if v != o and self._are_semantically_similar(v, o):
                    semantic_matches.add(o)

        union_size = len(volunteer_interests.union(opportunity_interests))
        if not union_size:
            return 50.0, set()

        weighted = len(exact_matches) + 0.75 * len(semantic_matches)
        similarity = weighted / union_size

        return similarity * 100, exact_matches.union(semantic_matches)

    # --------------------------------------------------
    # SEMANTIC EMBEDDING MATCH
    # --------------------------------------------------

    def _calculate_semantic_match(
        self,
        volunteer: Dict[str, Any],
        opportunity: Dict[str, Any]
    ) -> float:

        if semantic_match_score is None:
            return 0.0

        try:
            score = float(semantic_match_score(volunteer, opportunity))
            return max(0.0, min(100.0, score))
        except Exception:
            return 0.0

    # --------------------------------------------------
    # AVAILABILITY MATCH
    # --------------------------------------------------

    def _calculate_availability_match(
        self,
        volunteer_availability: Dict[str, bool],
        opportunity_times: Dict[str, bool]
    ) -> float:

        if not opportunity_times:
            return 100.0

        if not volunteer_availability:
            return 50.0

        matches = 0
        total = 0

        for slot, required in opportunity_times.items():
            if required:
                total += 1
                if volunteer_availability.get(slot, False):
                    matches += 1

        return (matches / total) * 100 if total > 0 else 100.0

    # --------------------------------------------------
    # LOCATION MATCH
    # --------------------------------------------------

    def _calculate_location_match(self, vol_loc: str, opp_loc: str) -> float:
        if not opp_loc:
            return 70.0
        if not vol_loc:
            return 50.0

        vol = vol_loc.lower().strip()
        opp = opp_loc.lower().strip()

        if vol == opp:
            return 100.0
        if vol in opp or opp in vol:
            return 85.0
        if self._are_semantically_similar(vol, opp):
            return 75.0

        return 40.0

    # --------------------------------------------------
    # PERSONALITY MATCH
    # --------------------------------------------------

    def _calculate_personality_match(
        self,
        volunteer_traits: Dict[str, float],
        opportunity_traits: Dict[str, float]
    ) -> float:

        if not volunteer_traits or not opportunity_traits:
            return 0.0

        common = set(volunteer_traits.keys()).intersection(opportunity_traits.keys())
        if not common:
            return 0.0

        v_vec = [volunteer_traits[t] for t in common]
        o_vec = [opportunity_traits[t] for t in common]

        dot = sum(a * b for a, b in zip(v_vec, o_vec))
        v_norm = math.sqrt(sum(a * a for a in v_vec))
        o_norm = math.sqrt(sum(b * b for b in o_vec))

        if v_norm == 0 or o_norm == 0:
            return 0.0

        return dot / (v_norm * o_norm)

    # --------------------------------------------------

    def _extract_personality_traits(self, profile: Dict[str, Any]) -> Dict[str, float]:
        traits = profile.get("personality_traits", {})
        return {str(k): float(v) for k, v in traits.items()} if isinstance(traits, dict) else {}

    def _are_semantically_similar(self, text1: str, text2: str) -> bool:
        try:
            return self.text_processor.are_similar(text1, text2)
        except Exception:
            return False


# --------------------------------------------------
# API CONVENIENCE FUNCTION
# --------------------------------------------------

def match_volunteer_with_opportunities(
    volunteer: Dict[str, Any],
    opportunities: List[Dict[str, Any]],
    min_score: float = 0.0
) -> List[Dict[str, Any]]:

    matcher = EnhancedMatchingAlgorithm(language="albanian")
    return matcher.find_matches_for_volunteer(volunteer, opportunities, min_score)