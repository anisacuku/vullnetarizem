import re
import string
import nltk
from nltk.tokenize import word_tokenize
from typing import List, Dict, Any, Set

# Download necessary NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')


class TextProcessor:
    """
    Process text for NLP operations in both Albanian and English.
    Handles text cleaning, skill and interest extraction.
    """

    def __init__(self, language='albanian'):
        """Initialize text processor with specified language."""
        self.language = language.lower()

        # For Albanian, use a custom stopwords list
        if self.language == 'albanian':
            # Common Albanian stopwords
            self.stopwords = {
                'dhe', 'në', 'e', 'të', 'së', 'për', 'me', 'si', 'që', 'nga', 'një',
                'është', 'më', 'po', 'ka', 'kjo', 'këtë', 'këto', 'ky', 'jam', 'janë',
                'do', 'duke', 'ishte', 'ketë', 'kur', 'ku', 'pa', 'pasi', 'por', 'sepse',
                'deri', 'këtu', 'kemi', 'kishte', 'mund', 'nuk', 'shumë', 'çdo', 'atë',
                'ai', 'ajo', 'ata', 'ato', 'jemi', 'duhet', 'i', 'o', 'a', 'u', 'ne'
            }
        else:
            # Use NLTK's English stopwords
            from nltk.corpus import stopwords
            self.stopwords = set(stopwords.words('english'))

            # Use lemmatizer for English
            from nltk.stem import WordNetLemmatizer
            self.lemmatizer = WordNetLemmatizer()

        # Initialize dictionaries of skills and interests
        self.skills_dictionary = self._init_skills_dictionary()
        self.interests_dictionary = self._init_interests_dictionary()

    def _init_skills_dictionary(self) -> Dict[str, List[str]]:
        """Initialize the skills dictionary."""
        # Albanian skills with synonyms
        if self.language == 'albanian':
            return {
                'programim': ['zhvillim softuer', 'kodim', 'programues'],
                'dizajn': ['dizajn grafik', 'grafikë', 'dizajn uebi', 'ilustrim'],
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
        else:
            # English skills with synonyms (simplified version)
            return {
                'programming': ['software development', 'coding', 'developer'],
                'design': ['graphic design', 'graphics', 'web design', 'illustration'],
                'teaching': ['teacher', 'education', 'trainer', 'professor'],
                'translation': ['foreign languages', 'translator', 'interpreter'],
                'marketing': ['social media', 'advertising', 'PR', 'promotion'],
                'accounting': ['finance', 'bookkeeping', 'balance sheets'],
                'medicine': ['nursing', 'healthcare', 'pharmacy'],
                'journalism': ['writing', 'reporting', 'media'],
                'law': ['lawyer', 'legal consultation', 'legal'],
                'engineering': ['construction', 'mechanical', 'electronics'],
                'agriculture': ['farming', 'cultivation', 'agronomy'],
                'cooking': ['chef', 'food', 'culinary'],
                'music': ['instrument', 'singing', 'composition'],
                'photography': ['camera', 'video', 'editing'],
                'management': ['leadership', 'organization', 'planning'],
                'research': ['analysis', 'study', 'investigation'],
                'psychology': ['counseling', 'therapy', 'support'],
                'sports': ['training', 'fitness', 'exercise'],
                'art': ['painting', 'sculpture', 'creation'],
                'technology': ['IT', 'hardware', 'software']
            }

    def _init_interests_dictionary(self) -> Dict[str, List[str]]:
        """Initialize the interests dictionary."""
        # Albanian interests with synonyms
        if self.language == 'albanian':
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
        else:
            # English interests with synonyms (simplified version)
            return {
                'environment': ['nature', 'ecology', 'environmental protection', 'green'],
                'education': ['learning', 'knowledge', 'teaching', 'personal development'],
                'healthcare': ['medical care', 'wellness', 'public health'],
                'art': ['culture', 'museum', 'gallery', 'creativity'],
                'charity': ['help', 'support', 'solidarity', 'humanism'],
                'sports': ['physical activity', 'team', 'games', 'competition'],
                'technology': ['innovation', 'science', 'development', 'artificial intelligence'],
                'children': ['youth', 'child education', 'games', 'development'],
                'elderly': ['elderly care', 'support', 'companionship'],
                'animals': ['animal protection', 'veterinary', 'shelter'],
                'justice': ['rights', 'equality', 'activism'],
                'culture': ['heritage', 'tradition', 'diversity'],
                'community development': ['improvement', 'infrastructure', 'services'],
                'immigration': ['refugees', 'support', 'integration'],
                'music': ['concerts', 'festival', 'performance'],
                'food': ['cuisine', 'food distribution', 'food security'],
                'tourism': ['travel', 'guide', 'promotion'],
                'history': ['heritage', 'archaeology', 'preservation'],
                'internet': ['social media', 'online content', 'digital access']
            }

    def preprocess_text(self, text: str) -> str:
        """Clean and normalize text by removing stopwords and punctuation."""
        if not text:
            return ""

        # Convert to lowercase
        text = text.lower()

        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))

        # Tokenize words
        tokens = word_tokenize(text)

        # Remove stopwords
        tokens = [token for token in tokens if token not in self.stopwords]

        # Apply lemmatization for English
        if self.language == 'english':
            tokens = [self.lemmatizer.lemmatize(token) for token in tokens]

        return ' '.join(tokens)

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text using the skills dictionary."""
        if not text:
            return []

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

    def extract_interests(self, text: str) -> List[str]:
        """Extract interests from text using the interests dictionary."""
        if not text:
            return []

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

    def analyze_profile(self, profile_text: str) -> Dict[str, Any]:
        """
        Analyze a volunteer or organization profile text to extract relevant information.
        Returns a dictionary with skills, interests, and locations.
        """
        if not profile_text:
            return {
                'skills': [],
                'interests': [],
                'locations': []
            }

        processed_text = self.preprocess_text(profile_text)

        # Extract skills and interests
        skills = self.extract_skills(profile_text)
        interests = self.extract_interests(profile_text)

        # Extract locations (could be enhanced with a gazetteer)
        locations = []
        if self.language == 'albanian':
            # Common Albanian cities
            common_cities = [
                'tiranë', 'durrës', 'vlorë', 'shkodër', 'elbasan', 'korçë', 'fier',
                'berat', 'lushnjë', 'gjirokastër', 'sarandë', 'pogradec', 'kavajë',
                'lezhë', 'lushnje', 'krujë', 'kuçovë', 'kukës', 'peshkopi', 'burrel'
            ]
        else:
            # Some common English-speaking cities
            common_cities = [
                'london', 'new york', 'los angeles', 'chicago', 'toronto', 'sydney',
                'melbourne', 'dublin', 'edinburgh', 'san francisco', 'boston'
            ]

        for city in common_cities:
            if city in processed_text:
                locations.append(city)

        return {
            'skills': skills,
            'interests': interests,
            'locations': locations
        }