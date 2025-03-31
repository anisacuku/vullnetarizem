import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download necessary NLTK data (run this once)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')
    nltk.download('punkt')


class TextProcessor:
    def __init__(self, language='english'):
        self.language = language
        self.lemmatizer = WordNetLemmatizer()

        # For Albanian, we'll need a custom stopwords list
        if language.lower() == 'albanian':
            # Common Albanian stopwords (partial list)
            self.stopwords = {
                'dhe', 'në', 'një', 'për', 'me', 'që', 'të', 'se', 'nga', 'ka',
                'po', 'si', 'por', 'deri', 'kur', 'ku', 'kjo', 'ky', 'jam', 'je',
                'është', 'jemi', 'janë', 'do', 'nuk', 'jo'
            }
        else:
            self.stopwords = set(stopwords.words(language))

    def preprocess(self, text):
        if not text:
            return ""

        # Convert to lowercase
        text = text.lower()

        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))

        # Tokenize
        tokens = nltk.word_tokenize(text)

        # Remove stopwords and lemmatize (for English)
        if self.language.lower() == 'english':
            tokens = [self.lemmatizer.lemmatize(token) for token in tokens if token not in self.stopwords]
        else:
            # For Albanian, just remove stopwords (we don't have a lemmatizer)
            tokens = [token for token in tokens if token not in self.stopwords]

        return ' '.join(tokens)

    def extract_skills(self, text):
        """
        Extract potential skills from text.
        This is a simple implementation - a more advanced system would use NER or a predefined skills taxonomy.
        """
        # Preprocess the text
        processed_text = self.preprocess(text)

        # For now, just return the tokenized words as potential skills
        # In a real system, you'd match these against a skills database
        tokens = processed_text.split()

        # Remove very short words (unlikely to be skills)
        skills = [token for token in tokens if len(token) > 2]

        return skills

    def extract_interests(self, text):
        """
        Similar to skills extraction but focused on interests.
        """
        # In a simple implementation, this is similar to skills extraction
        return self.extract_skills(text)


# Example Albanian common skills (would be expanded in a real system)
ALBANIAN_SKILLS = {
    'programim', 'web', 'dizajn', 'menaxhim', 'marketing', 'infermieri',
    'mësimdhënie', 'projekt', 'kujdes', 'komunikim', 'organizim', 'udhëheqje',
    'përgatitje', 'përkthim', 'gjuhë', 'anglisht', 'italisht', 'analizë',
    'raportim', 'kontabilitet', 'financë', 'shitje', 'logjistikë', 'transport'
}

# Example Albanian common interests (would be expanded in a real system)
ALBANIAN_INTERESTS = {
    'mjedis', 'edukim', 'shëndetësi', 'art', 'kulturë', 'sport', 'teknologji',
    'bamirësi', 'fëmijë', 'të moshuarit', 'kafshë', 'natyra', 'drejtësi',
    'zhvillim', 'komunitet', 'trashëgimi', 'histori', 'muzikë', 'film',
    'letërsi', 'kuzhinë', 'udhëtim', 'fotografi'
}