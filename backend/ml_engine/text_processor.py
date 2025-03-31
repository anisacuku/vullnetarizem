# ml_engine/text_processor.py
import re
import string
import nltk
from nltk.tokenize import word_tokenize

import nltk
nltk.download("punkt")
nltk.download("stopwords")


class TextProcessor:
    def __init__(self):
        # Download necessary NLTK resources
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')

        # Albanian stopwords (common words that don't add meaning)
        self.albanian_stopwords = {
            'dhe', 'në', 'e', 'të', 'së', 'për', 'me', 'si', 'që', 'nga', 'një',
            'është', 'më', 'po', 'ka', 'kjo', 'këtë', 'këto', 'ky', 'jam', 'janë',
            'do', 'duke', 'ishte', 'ketë', 'kur', 'ku', 'pa', 'pasi', 'por', 'sepse',
            'deri', 'këtu', 'kemi', 'kishte', 'mund', 'nuk', 'shumë', 'çdo', 'atë',
            'ai', 'ajo', 'ata', 'ato', 'jemi', 'duhet', 'i', 'o', 'a', 'u', 'ne'
        }

        # Create dictionaries of skills and interests in Albanian
        self.skills_dictionary = self._load_skills_dictionary()
        self.interests_dictionary = self._load_interests_dictionary()

    def _load_skills_dictionary(self):
        """Load skills dictionary for Albanian language"""
        # This would ideally come from a database or file
        # Here's a starter set of skills in Albanian
        return {
            'programim': ['zhvillim softuer', 'kodim', 'programues'],
            'dizajn': ['dizajn grafik', 'grafikë', 'dizajn uebi', 'illustrim'],
            'mësimdhënie': ['mësues', 'edukim', 'trajner', 'profesor'],
            'përkthim': ['gjuhë të huaja', 'përkthyes', 'interpretues'],
            'marketing': ['media sociale', 'reklamim', 'PR', 'promocion'],
            'kontabilitet': ['financa', 'regjistrime', 'bilance'],
            'mjekësi': ['infermieri', 'kujdes shëndetësor', 'farmaci'],
            'gazetari': ['shkrim', 'raportim', 'media'],
            'drejtësi': ['avokat', 'konsulencë ligjore', 'ligj'],
            'inxhinieri': ['ndërtim', 'mekanikë', 'elektronikë'],
            'bujqësi': ['fermë', 'kultivim', 'agronomi'],
            'kuzhinë': ['gatim', 'ushqim', 'shef'],
            'muzikë': ['instrument', 'këndim', 'kompozim'],
            'fotografi': ['kamera', 'video', 'editim'],
            'menaxhim': ['lidership', 'organizim', 'planifikim'],
            'kërkim': ['analizë', 'studim', 'hulumtim'],
            'psikologji': ['këshillim', 'terapi', 'mbështetje'],
            'sport': ['trajnim', 'fitnes', 'ushtrime'],
            'art': ['pikturë', 'skulpturë', 'krijim'],
            'teknologji': ['IT', 'harduer', 'softuer']
        }

    def _load_interests_dictionary(self):
        """Load interests dictionary for Albanian language"""
        # This would ideally come from a database or file
        # Here's a starter set of interests in Albanian
        return {
            'mjedis': ['natyrë', 'ekologji', 'mbrojtje mjedisi', 'gjelbërim'],
            'edukim': ['arsim', 'dije', 'mësim', 'zhvillim personal'],
            'shëndetësi': ['kujdes shëndetësor', 'mirëqenie', 'shëndet publik'],
            'art': ['kulturë', 'muzeum', 'galeri', 'krijimtari'],
            'bamirësi': ['ndihmë', 'mbështetje', 'solidaritet', 'humanizëm'],
            'sport': ['aktivitet fizik', 'ekip', 'lojëra', 'konkurim'],
            'teknologji': ['inovacion', 'shkencë', 'zhvillim', 'inteligjencë artificiale'],
            'fëmijë': ['të rinj', 'edukim fëmijësh', 'lojëra', 'zhvillim'],
            'të moshuarit': ['kujdes për të moshuarit', 'përkrahje', 'shoqëri'],
            'kafshë': ['mbrojtje kafshësh', 'veterinari', 'strehim'],
            'drejtësi': ['të drejta', 'barazi', 'aktivizëm'],
            'kulturë': ['trashëgimi', 'traditë', 'diversitet'],
            'zhvillim komunitar': ['përmirësim', 'infrastrukturë', 'shërbime'],
            'emigracion': ['refugjatë', 'mbështetje', 'integrim'],
            'muzikë': ['koncerte', 'festival', 'performancë'],
            'ushqim': ['kuzhinë', 'shpërndarje ushqimi', 'siguri ushqimore'],
            'turizëm': ['udhëtime', 'guidë', 'promovim'],
            'histori': ['trashëgimi', 'arkeologji', 'ruajtje'],
            'internet': ['media sociale', 'përmbajtje online', 'akses digjital']
        }

    def preprocess_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ""

        # Convert to lowercase
        text = text.lower()

        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))

        # Tokenize words
        words = word_tokenize(text)

        # Remove stopwords
        words = [word for word in words if word not in self.albanian_stopwords]

        return ' '.join(words)

    def extract_skills(self, text):
        """Extract skills from text using the Albanian skills dictionary"""
        skills = set()
        processed_text = self.preprocess_text(text)

        # Look for direct matches in skills dictionary
        for skill, synonyms in self.skills_dictionary.items():
            if skill in processed_text:
                skills.add(skill)

            # Check for synonyms
            for synonym in synonyms:
                if synonym in processed_text:
                    skills.add(skill)  # Add the canonical skill

        return list(skills)

    def extract_interests(self, text):
        """Extract interests from text using the Albanian interests dictionary"""
        interests = set()
        processed_text = self.preprocess_text(text)

        # Look for direct matches in interests dictionary
        for interest, synonyms in self.interests_dictionary.items():
            if interest in processed_text:
                interests.add(interest)

            # Check for synonyms
            for synonym in synonyms:
                if synonym in processed_text:
                    interests.add(interest)  # Add the canonical interest

        return list(interests)

    def analyze_profile(self, profile_text):
        """Analyze a volunteer or organization profile"""
        processed_text = self.preprocess_text(profile_text)

        # Extract skills and interests
        skills = self.extract_skills(profile_text)
        interests = self.extract_interests(profile_text)

        # Extract locations (could be enhanced with a gazetteer of Albanian locations)
        # This is a simplified version
        common_albanian_cities = [
            'tiranë', 'durrës', 'vlorë', 'shkodër', 'elbasan', 'korçë', 'fier',
            'berat', 'lushnjë', 'gjirokastër', 'sarandë', 'pogradec', 'kavajë',
            'lezhë', 'lushnje', 'krujë', 'kuçovë', 'kukës', 'peshkopi', 'burrel'
        ]

        locations = []
        for city in common_albanian_cities:
            if city in processed_text:
                locations.append(city)

        return {
            'skills': skills,
            'interests': interests,
            'locations': locations,
            'processed_text': processed_text
        }