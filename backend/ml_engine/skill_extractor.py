# ml_engine/skill_extractor.py
import re
from .text_processor import TextProcessor


class SkillExtractor:
    def __init__(self):
        self.text_processor = TextProcessor()

        # Additional skill patterns (regex)
        self.skill_patterns = [
            r'(\w+) eksperiencë',  # experience in something
            r'njohuri në (\w+)',  # knowledge in something
            r'di të (\w+)',  # know how to do something
            r'aftësi në (\w+)',  # ability in something
            r'certifikim në (\w+)'  # certification in something
        ]

    def extract_from_resume(self, resume_text):
        """Extract skills from a resume or CV text"""
        # First use the text processor to get basic skills
        basic_skills = self.text_processor.extract_skills(resume_text)

        # Now use regex patterns to find more specific skills
        additional_skills = set()
        for pattern in self.skill_patterns:
            matches = re.findall(pattern, resume_text.lower())
            additional_skills.update(matches)

        # Combine both sets of skills
        all_skills = set(basic_skills)
        all_skills.update(additional_skills)

        return list(all_skills)

    def extract_from_opportunity(self, opportunity_text):
        """Extract required skills from an opportunity description"""
        # First use the text processor to get basic skills
        basic_skills = self.text_processor.extract_skills(opportunity_text)

        # Look for phrases that indicate required skills
        required_skills = set(basic_skills)

        # Common phrases in Albanian that indicate required skills
        skill_indicators = [
            r'kërkohen aftësi në (\w+)',  # skills required in
            r'duhet të keni njohuri (\w+)',  # must have knowledge in
            r'preferohen aftësi (\w+)',  # preferred skills
            r'kërkohet eksperiencë në (\w+)'  # experience required in
        ]

        for pattern in skill_indicators:
            matches = re.findall(pattern, opportunity_text.lower())
            required_skills.update(matches)

        return list(required_skills)

    def match_skills(self, volunteer_skills, opportunity_skills):
        """
        Calculate skill match percentage between volunteer skills and opportunity required skills
        Returns a tuple of (match_percentage, matched_skills, missing_skills)
        """
        # Convert to sets for easier operations
        vol_skills_set = set(volunteer_skills)
        opp_skills_set = set(opportunity_skills)

        # Find matching skills
        matched_skills = vol_skills_set.intersection(opp_skills_set)

        # Find missing skills
        missing_skills = opp_skills_set - vol_skills_set

        # Calculate match percentage
        if len(opp_skills_set) == 0:
            match_percentage = 100.0  # No skills required, perfect match
        else:
            match_percentage = (len(matched_skills) / len(opp_skills_set)) * 100

        return (match_percentage, list(matched_skills), list(missing_skills))