# ml_engine/recommendation_engine.py
from .matching_algorithm import MatchingAlgorithm
import pandas as pd
import numpy as np


class RecommendationEngine:
    def __init__(self):
        self.matching_algorithm = MatchingAlgorithm()

    def recommend_opportunities(self, volunteer, all_opportunities, top_n=5,
                                min_score=50, include_feedback=True):
        """
        Recommend opportunities to a volunteer
        Parameters:
        - volunteer: volunteer profile data
        - all_opportunities: list of all opportunities
        - top_n: number of recommendations to return
        - min_score: minimum match score to include
        - include_feedback: whether to use feedback for improved recommendations
        """
        # Get initial matches based on profile
        matches = self.matching_algorithm.find_opportunities_for_volunteer(
            volunteer, all_opportunities, min_score=min_score
        )

        # If there's feedback data available, adjust scores
        if include_feedback and 'previous_matches' in volunteer:
            matches = self._adjust_scores_based_on_feedback(matches, volunteer['previous_matches'])

        # Return top N recommendations
        return matches[:top_n]

    def recommend_volunteers(self, opportunity, all_volunteers, top_n=10,
                             min_score=50, include_feedback=True):
        """
        Recommend volunteers for an opportunity
        Parameters:
        - opportunity: opportunity data
        - all_volunteers: list of all volunteers
        - top_n: number of recommendations to return
        - min_score: minimum match score to include
        - include_feedback: whether to use feedback for improved recommendations
        """
        # Get initial matches based on profiles
        matches = self.matching_algorithm.find_volunteers_for_opportunity(
            opportunity, all_volunteers, min_score=min_score
        )

        # If there's feedback data available, adjust scores
        if include_feedback and 'previous_matches' in opportunity:
            matches = self._adjust_scores_based_on_feedback(matches, opportunity['previous_matches'])

        # Return top N recommendations
        return matches[:top_n]

    def _adjust_scores_based_on_feedback(self, matches, previous_matches):
        """
        Adjust recommendation scores based on previous feedback
        This is a simple implementation that could be enhanced with more sophisticated ML
        """
        # Extract feedback ratings from previous matches
        feedback_data = {}
        for match in previous_matches:
            if 'feedback' in match and 'rating' in match['feedback']:
                if 'opportunity_id' in match:
                    feedback_data[match['opportunity_id']] = match['feedback']['rating']
                elif 'volunteer_id' in match:
                    feedback_data[match['volunteer_id']] = match['feedback']['rating']

        # If no feedback data, return original matches
        if not feedback_data:
            return matches

        # Adjust scores based on feedback
        adjusted_matches = []
        for match in matches:
            item_id = None
            if 'opportunity' in match and 'id' in match['opportunity']:
                item_id = match['opportunity']['id']
            elif 'volunteer' in match and 'id' in match['volunteer']:
                item_id = match['volunteer']['id']

            # Copy match data
            adjusted_match = match.copy()

            # Adjust score based on previous ratings of similar items
            original_score = match['match_details']['score']
            adjustment = 0

            # For each feedback rating, calculate similarity and adjust score
            for rated_id, rating in feedback_data.items():
                # This is simplified - in a real system, you'd calculate item similarity
                # For now, we just slightly boost scores if there's positive feedback
                if rating > 3:  # On a 1-5 scale
                    adjustment += 2
                elif rating < 3:
                    adjustment -= 1

            # Apply adjustment, ensuring score stays between 0-100
            adjusted_score = min(100, max(0, original_score + adjustment))
            adjusted_match['match_details']['score'] = adjusted_score
            adjusted_match['match_details']['original_score'] = original_score
            adjusted_match['match_details']['feedback_adjustment'] = adjustment

            adjusted_matches.append(adjusted_match)

        # Resort based on adjusted scores
        adjusted_matches.sort(key=lambda x: x['match_details']['score'], reverse=True)
        return adjusted_matches