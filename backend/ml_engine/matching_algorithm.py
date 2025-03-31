import re
from .text_processor import TextProcessor
from .interest_analyzer import InterestAnalyzer
from backend.database import get_all_opportunities


class InterestAnalyzer:
    def __init__(self):
        self.text_processor = TextProcessor()

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
        categorized = {}

        for category, keywords in self.interest_categories.items():
            matching_interests = []
            for interest in interests:
                interest_words = interest.split()
                if any(keyword in interest or any(keyword in word for word in interest_words) for keyword in keywords):
                    matching_interests.append(interest)

            if matching_interests:
                categorized[category] = matching_interests

        return categorized

    def extract_from_text(self, text):
        return self.text_processor.extract_interests(text)

    def match_interests(self, volunteer_interests, opportunity_interests):
        vol_interests_set = set(volunteer_interests)
        opp_interests_set = set(opportunity_interests)
        aligned_interests = vol_interests_set.intersection(opp_interests_set)

        if len(vol_interests_set) == 0 or len(opp_interests_set) == 0:
            alignment_score = 0.0
        else:
            vol_coverage = len(aligned_interests) / len(vol_interests_set)
            opp_coverage = len(aligned_interests) / len(opp_interests_set)
            alignment_score = (vol_coverage + opp_coverage) / 2

        return (alignment_score, list(aligned_interests))


# ✅ THIS is the function your `matches.py` was looking for
def match_volunteer_with_opportunities(volunteer_profile):
    interest_analyzer = InterestAnalyzer()
    all_opps = get_all_opportunities()

    results = []

    for opp in all_opps:
        score, matched_interests = interest_analyzer.match_interests(
            volunteer_profile.get("interests", []),
            opp.get("interests", [])
        )
        results.append({
            "opportunity": opp,
            "match_score": round(score * 100, 2),
            "matched_interests": matched_interests
        })

    # Optional: sort by match score descending
    results.sort(key=lambda x: x["match_score"], reverse=True)

    return results
