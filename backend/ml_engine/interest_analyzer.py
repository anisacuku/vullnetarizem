# ml_engine/interest_analyzer.py
import re
from .text_processor import TextProcessor


class InterestAnalyzer:
    def __init__(self):
        self.text_processor = TextProcessor()

        # Interest categories in Albanian
        self.interest_categories = {
            'mjedisore': ['mjedis', 'ekologji', 'natyrë', 'riciklim', 'gjelbërim'],
            'sociale': ['komunitet', 'ndihmë', 'mbështetje', 'solidaritet', 'bamirësi'],
            'edukative': ['edukim', 'arsim', 'mësim', 'shkollë', 'universitet', 'trajnim'],
            'shëndetësore': ['shëndet', 'mjekësi', 'spital', 'klinikë', 'mirëqenie'],
            'kulturore': ['art', 'muzikë', 'teatër', 'film', 'letërsi', 'muze'],
            'sportive': ['sport', 'atletikë', 'futboll', 'basketboll', 'volejboll', 'not'],
            'teknologjike': ['teknologji', 'kompjuter', 'programim', 'inovacion', 'digjitale'],
            'humanitare': ['ndihmë', 'emergjencë', 'fatkeqësi', 'refugjat', 'strehim']
        }

    def categorize_interests(self, interests):
        """Categorize a list of interests into predefined categories"""
        categorized = {}

        for category, keywords in self.interest_categories.items():
            matching_interests = []
            for interest in interests:
                # Check if the interest or any of its words match the category keywords
                interest_words = interest.split()
                if any(keyword in interest or any(keyword in word for word in interest_words) for keyword in keywords):
                    matching_interests.append(interest)

            if matching_interests:
                categorized[category] = matching_interests

        return categorized

    def extract_from_text(self, text):
        """Extract interests from text"""
        # Use the text processor to get basic interests
        return self.text_processor.extract_interests(text)

    def match_interests(self, volunteer_interests, opportunity_interests):
        """
        Calculate interest alignment between volunteer interests and opportunity interests
        Returns a tuple of (alignment_score, aligned_interests)
        """
        # Convert to sets for easier operations
        vol_interests_set = set(volunteer_interests)
        opp_interests_set = set(opportunity_interests)

        # Find matching interests
        aligned_interests = vol_interests_set.intersection(opp_interests_set)

        # Calculate alignment score (0 to 1)
        # We consider both how many of the volunteer's interests align and how many of the opportunity's interests are covered
        if len(vol_interests_set) == 0 or len(opp_interests_set) == 0:
            alignment_score = 0.0
        else:
            vol_coverage = len(aligned_interests) / len(vol_interests_set)
            opp_coverage = len(aligned_interests) / len(opp_interests_set)
            alignment_score = (vol_coverage + opp_coverage) / 2

        return (alignment_score, list(aligned_interests))