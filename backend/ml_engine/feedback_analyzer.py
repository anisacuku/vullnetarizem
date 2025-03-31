# ml_engine/feedback_analyzer.py
import pandas as pd
import numpy as np
from .text_processor import TextProcessor


class FeedbackAnalyzer:
    def __init__(self):
        self.text_processor = TextProcessor()

    def analyze_feedback_comment(self, comment):
        """
        Analyze feedback comment text to extract sentiment and key points
        Returns a dict with sentiment score and extracted topics
        """
        if not comment:
            return {'sentiment': 0, 'topics': []}

        # Preprocess text
        processed_text = self.text_processor.preprocess_text(comment)

        # Simple sentiment analysis using keyword matching (for Albanian)
        positive_words = {
            'mirë', 'shkëlqyer', 'fantastike', 'e mrekullueshme', 'përvojë pozitive',
            'e dobishme', 'efektive', 'e kënaqshme', 'e vlefshme', 'konstruktive',
            'sukses', 'produktive', 'frytdhënëse', 'entuziazëm', 'kënaqësi'
        }

        negative_words = {
            'keq', 'jo e dobishme', 'zhgënjyer', 'problem', 'vështirësi',
            'konfuze', 'e pakënaqshme', 'jo efektive', 'humbje kohe', 'e paqartë',
            'jo profesionale', 'jo e organizuar', 'jo e mjaftueshme', 'dobët'
        }

        # Count matches
        pos_count = sum(1 for word in positive_words if word in processed_text)
        neg_count = sum(1 for word in negative_words if word in processed_text)

        # Calculate sentiment score (-1 to 1)
        if pos_count + neg_count > 0:
            sentiment = (pos_count - neg_count) / (pos_count + neg_count)
        else:
            sentiment = 0

        # Extract topics from feedback
        topics = []
        topic_keywords = {
            'komunikim': ['komunikim', 'informacion', 'kontakt', 'bisedë'],
            'organizim': ['organizim', 'planifikim', 'strukturë', 'koordinim'],
            'trajnim': ['trajnim', 'mësim', 'udhëzim', 'demonstrim'],
            'mbështetje': ['mbështetje', 'ndihmë', 'asistencë', 'udhëheqje'],
            'angazhim': ['angazhim', 'pjesëmarrje', 'përfshirje', 'motivim'],
            'koha': ['kohë', 'orar', 'afat', 'vonesa', 'përpikëri'],
            'burime': ['burime', 'materiale', 'pajisje', 'mjete']
        }

        for topic, keywords in topic_keywords.items():
            if any(keyword in processed_text for keyword in keywords):
                topics.append(topic)

        return {
            'sentiment': round(sentiment, 2),
            'topics': topics
        }

    def analyze_match_success(self, match_data):
        """
        Analyze if a match was successful based on feedback, completion status, etc.
        Returns a success score and factors
        """
        success_score = 0
        factors = []

        # Check if match was completed
        if match_data.get('status') == 'completed':
            success_score += 0.5
            factors.append('completed')

        # Check volunteer feedback
        volunteer_feedback = match_data.get('volunteer_feedback', {})
        vol_rating = volunteer_feedback.get('rating', 0)
        vol_comment = volunteer_feedback.get('comment', '')

        if vol_rating > 0:
            # Normalize rating to 0-1 scale (assuming 1-5 scale)
            success_score += (vol_rating / 5) * 0.3
            factors.append(f'volunteer_rating: {vol_rating}')

        if vol_comment:
            feedback_result = self.analyze_feedback_comment(vol_comment)
            sentiment = feedback_result['sentiment']
            success_score += (sentiment + 1) / 2 * 0.2  # Normalize sentiment from [-1,1] to [0,1], then weight
            if feedback_result['topics']:
                factors.extend([f'topic: {topic}' for topic in feedback_result['topics']])

        return {
            'success_score': round(success_score, 2),
            'factors': factors
        }
