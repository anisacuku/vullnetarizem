// src/services/matchingService.js

// Define volunteer opportunities directly in this file instead of a separate data directory
const volunteerOpportunities = [
  {
    id: 1,
    title: "Pastrim i Parkut Kombëtar",
    description: "Ndihmoni në pastrimin e parqeve kombëtare për të ruajtur bukurinë natyrore dhe biodiversitetin. Aktiviteti përfshin mbledhjen e mbeturinave, mirëmbajtjen e shtigjeve dhe punë të lehta kopshtarie.",
    organization: "Green Albania",
    location: "Tiranë",
    date: "15 Maj, 2025",
    time_requirements: "4 orë, nga ora 9:00 deri në 13:00",
    skills_required: "Punë në ekip, Rezistencë fizike",
    interests: ["Mjedis", "Natyra", "Aktivitete në natyrë"],
    spotsLeft: 15,
    image: "park_cleaning.jpg",
    requiredSkills: ["Punë fizike", "Punë në ekip"],
    recommendedSkills: ["Organizim", "Njohuri mjedisore"]
  },
  {
    id: 2,
    title: "Mentor për Fëmijë në Shkolla",
    description: "Bëhuni mentor për fëmijët e shkollave fillore, duke i ndihmuar ata me detyrat e shtëpisë dhe duke i mbështetur në zhvillimin akademik dhe personal.",
    organization: "Fondacioni Arsimor i Shqipërisë",
    location: "Durrës",
    date: "1 Qershor - 31 Gusht, 2025",
    time_requirements: "6 orë/javë, ditët e punës pas shkollës",
    skills_required: "Mësimdhënie, Komunikim, Durim",
    interests: ["Edukim", "Fëmijë", "Zhvillim personal"],
    spotsLeft: 8,
    image: "mentoring.jpg",
    requiredSkills: ["Mësimdhënie", "Komunikim"],
    recommendedSkills: ["Psikologji", "Menaxhim kohe"]
  },
  {
    id: 3,
    title: "Ndihmë për të Moshuarit",
    description: "Ofroni shoqëri dhe asistencë për të moshuarit në komunitetin tuaj. Aktivitetet përfshijnë: biseda, lexim, lojëra dhe ndihmë në detyra të vogla shtëpiake.",
    organization: "Kujdesi për Të Moshuarit",
    location: "Vlorë",
    date: "Gjatë gjithë vitit, 2025",
    time_requirements: "3 orë/javë, orare fleksibël",
    skills_required: "Komunikim, Empati, Durim",
    interests: ["Të moshuarit", "Shëndetësi", "Komuniteti"],
    spotsLeft: 10,
    image: "elderly_care.jpg",
    requiredSkills: ["Komunikim", "Empati"],
    recommendedSkills: ["Kujdes shëndetësor", "Psikologji"]
  },
  {
    id: 4,
    title: "Fushatë Mbjellëse Pemësh",
    description: "Merrni pjesë në fushatën e madhe për mbjelljen e pemëve për të luftuar ndryshimet klimatike dhe për të përmirësuar cilësinë e ajrit në qytetet tona.",
    organization: "Shqipëria e Gjelbër",
    location: "Shkodër",
    date: "22 Prill, 2025 (Dita e Tokës)",
    time_requirements: "5 orë, nga ora 8:00 deri në 13:00",
    skills_required: "Punë fizike, Njohuri mbi mbjelljen e pemëve",
    interests: ["Mjedis", "Natyra", "Ndryshimet klimatike"],
    spotsLeft: 25,
    image: "tree_planting.jpg",
    requiredSkills: ["Punë fizike"],
    recommendedSkills: ["Kopshtari", "Njohuri mjedisore"]
  },
  {
    id: 5,
    title: "Mësues Ndihmës në Qendrën Komunitare",
    description: "Ndihmoni fëmijët nga familjet me të ardhura të ulëta me mësimet e tyre pas shkollës në qendrën komunitare lokale.",
    organization: "Qendra Komunitare Drita",
    location: "Elbasan",
    date: "15 Shtator - 15 Dhjetor, 2025",
    time_requirements: "4 orë/javë, pasdite",
    skills_required: "Mësimdhënie, Njohuri bazë në matematikë dhe gjuhë",
    interests: ["Edukim", "Fëmijë", "Komunitet"],
    spotsLeft: 6,
    image: "teaching_assistant.jpg",
    requiredSkills: ["Mësimdhënie", "Komunikim"],
    recommendedSkills: ["Psikologji", "Menaxhim konflikti"]
  },
  {
    id: 6,
    title: "Organizator i Eventeve Kulturore",
    description: "Ndihmoni në organizimin dhe zhvillimin e eventeve kulturore lokale që promovojnë trashëgiminë kulturore shqiptare dhe diversitetin.",
    organization: "Shoqata Kulturore Shqiptare",
    location: "Korçë",
    date: "Qershor - Gusht, 2025",
    time_requirements: "10 orë/muaj, sipas nevojës",
    skills_required: "Organizim eventesh, Komunikim, Menaxhim projektesh",
    interests: ["Arte", "Kulturë", "Organizim eventesh"],
    spotsLeft: 5,
    image: "cultural_event.jpg",
    requiredSkills: ["Organizim eventesh", "Komunikim"],
    recommendedSkills: ["Marketing", "Menaxhim projektesh"]
  },
  {
    id: 7,
    title: "Instruktor Sporti për Fëmijë",
    description: "Jepni mësim dhe trajnoni fëmijët në aktivitete të ndryshme sportive, duke promovuar një jetesë të shëndetshme dhe shpirtin e ekipit.",
    organization: "Klubi Sportiv i Rinisë",
    location: "Fier",
    date: "Prill - Tetor, 2025",
    time_requirements: "4 orë/javë, fundjavë",
    skills_required: "Njohuri sportive, Punë me fëmijë, Komunikim",
    interests: ["Sport", "Fëmijë", "Shëndetësi"],
    spotsLeft: 8,
    image: "sports_coach.jpg",
    requiredSkills: ["Edukim fizik", "Menaxhim fëmijësh"],
    recommendedSkills: ["Ndihmë e parë", "Nutricion"]
  },
  {
    id: 8,
    title: "Asistent në Strehën e Kafshëve",
    description: "Ndihmoni në kujdesin dhe mirëqenien e kafshëve të braktisura në strehën lokale të kafshëve, duke përfshirë ushqyerjen, pastrimin dhe shoqërimin.",
    organization: "Streha e Kafshëve 'Miku Besnik'",
    location: "Tiranë",
    date: "Gjatë gjithë vitit, 2025",
    time_requirements: "5 orë/javë, orare fleksibël",
    skills_required: "Dashuri për kafshët, Përkushtim",
    interests: ["Kafshë", "Mirëqenie kafshësh", "Natyra"],
    spotsLeft: 12,
    image: "animal_shelter.jpg",
    requiredSkills: ["Kujdes për kafshët"],
    recommendedSkills: ["Ndihmë e parë për kafshët", "Veterinari"]
  },
  {
    id: 9,
    title: "Asistent IT në Bibliotekat Publike",
    description: "Ndihmoni vizitorët e bibliotekave publike me përdorimin e kompjuterëve, internetit dhe teknologjisë digjitale, duke ofruar mbështetje teknike.",
    organization: "Rrjeti i Bibliotekave Publike",
    location: "Tiranë, Durrës, Vlorë",
    date: "Gjatë gjithë vitit, 2025",
    time_requirements: "8 orë/javë, gjatë orarit të punës",
    skills_required: "Njohuri IT, Komunikim, Durim",
    interests: ["Teknologji", "Edukim", "Komuniteti"],
    spotsLeft: 6,
    image: "it_assistant.jpg",
    requiredSkills: ["Programim", "Njohuri kompjuterike"],
    recommendedSkills: ["Komunikim", "Mësimdhënie"]
  },
  {
    id: 10,
    title: "Përkthyes dhe Interpretues Vullnetar",
    description: "Ndihmoni me përkthimin dhe interpretimin për vizitorët dhe turistët e huaj në ngjarje kulturore, konferenca dhe aktivitete të tjera.",
    organization: "Zyra e Turizmit",
    location: "Sarandë",
    date: "Maj - Shtator, 2025",
    time_requirements: "10 orë/muaj, sipas nevojës",
    skills_required: "Njohuri të gjuhëve të huaja (anglisht, italisht, gjermanisht), Komunikim",
    interests: ["Gjuhë të huaja", "Kulturë", "Turizëm"],
    spotsLeft: 8,
    image: "translator.jpg",
    requiredSkills: ["Përkthim", "Komunikim"],
    recommendedSkills: ["Njohuri kulturore", "Gjuhë të huaja"]
  },
  {
    id: 11,
    title: "Vullnetar në Bankën Ushqimore",
    description: "Ndihmoni në mbledhjen, organizimin dhe shpërndarjen e ushqimeve për familjet në nevojë dhe organizatat bamirëse.",
    organization: "Banka Ushqimore Shqiptare",
    location: "Tiranë",
    date: "Gjatë gjithë vitit, 2025",
    time_requirements: "6 orë/javë, ditët e punës",
    skills_required: "Organizim, Punë në ekip, Përkushtim",
    interests: ["Bamirësi", "Ndihmë sociale", "Komunitet"],
    spotsLeft: 15,
    image: "food_bank.jpg",
    requiredSkills: ["Organizim", "Punë fizike"],
    recommendedSkills: ["Logjistikë", "Menaxhim inventari"]
  },
  {
    id: 12,
    title: "Organizator i Aktiviteteve për Fëmijët me Aftësi të Kufizuara",
    description: "Organizoni dhe lehtësoni aktivitete zbavitëse dhe edukative për fëmijët me aftësi të kufizuara, duke promovuar përfshirjen dhe zhvillimin e tyre.",
    organization: "Qendra për Fëmijët me Aftësi të Kufizuara",
    location: "Durrës",
    date: "Gjatë gjithë vitit, 2025",
    time_requirements: "4 orë/javë, fundjavë",
    skills_required: "Punë me fëmijë me aftësi të kufizuara, Empati, Kreativitet",
    interests: ["Fëmijë", "Edukim special", "Përfshirje sociale"],
    spotsLeft: 10,
    image: "special_needs.jpg",
    requiredSkills: ["Kujdes për fëmijët", "Empati"],
    recommendedSkills: ["Edukim special", "Terapi rekreative"]
  },
  {
    id: 13,
    title: "Vullnetar në Qendrën e Refugjatëve",
    description: "Ofroni mbështetje për refugjatët dhe azilkërkuesit, duke i ndihmuar ata të integrohen në shoqërinë shqiptare përmes kurseve të gjuhës, orientimit kulturor dhe aktiviteteve të tjera.",
    organization: "Qendra e Refugjatëve",
    location: "Tiranë",
    date: "Gjatë gjithë vitit, 2025",
    time_requirements: "8 orë/javë, ditët e punës",
    skills_required: "Njohuri të gjuhëve të huaja, Ndjeshmëri kulturore, Empati",
    interests: ["Të drejtat e njeriut", "Ndihma humanitare", "Edukim"],
    spotsLeft: 6,
    image: "refugee_center.jpg",
    requiredSkills: ["Gjuhë të huaja", "Komunikim ndërkulturor"],
    recommendedSkills: ["Psikologji", "Këshillim"]
  },
  {
    id: 14,
    title: "Edukator Mjedisor për Shkollat",
    description: "Zhvilloni dhe realizoni programe edukative mjedisore për nxënësit e shkollave për të rritur ndërgjegjësimin për çështjet mjedisore dhe zhvillimin e qëndrueshëm.",
    organization: "Edukimi Mjedisor Shqiptar",
    location: "Në të gjithë Shqipërinë",
    date: "Shtator - Qershor, 2025",
    time_requirements: "6 orë/muaj, ditët e shkollës",
    skills_required: "Njohuri mjedisore, Mësimdhënie, Komunikim",
    interests: ["Mjedis", "Edukim", "Zhvillim i qëndrueshëm"],
    spotsLeft: 12,
    image: "environmental_education.jpg",
    requiredSkills: ["Njohuri mjedisore", "Mësimdhënie"],
    recommendedSkills: ["Krijimi i prezantimeve", "Punë me fëmijë"]
  },
  {
    id: 15,
    title: "Asistent në Festivalin e Filmit",
    description: "Ndihmoni në organizimin dhe realizimin e festivalit të filmit, duke përfshirë koordinimin e shfaqjeve, ndihmën për mysafirët dhe aktivitetet promovuese.",
    organization: "Festivali Ndërkombëtar i Filmit në Shqipëri",
    location: "Tiranë",
    date: "Shtator, 2025",
    time_requirements: "30 orë gjatë javës së festivalit",
    skills_required: "Organizim eventesh, Komunikim, Njohuri të gjuhëve të huaja",
    interests: ["Arte", "Film", "Organizim eventesh"],
    spotsLeft: 20,
    image: "film_festival.jpg",
    requiredSkills: ["Organizim eventesh", "Komunikim"],
    recommendedSkills: ["Marketing", "Gjuhë të huaja"]
  }
];

// Object with weights for each matching category
const matchWeights = {
  skills: 0.40,
  interests: 0.30,
  availability: 0.15,
  location: 0.15
};

/**
 * Get all available opportunities
 * @returns {Promise<Array>} All volunteer opportunities
 */
export const getAllOpportunities = async () => {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(volunteerOpportunities);
    }, 500);
  });
};

/**
 * Get a single opportunity by ID
 * @param {number|string} id - Opportunity ID
 * @returns {Promise<Object|null>} The opportunity or null if not found
 */
export const getOpportunityById = async (id) => {
  const numericId = parseInt(id, 10);
  const opportunity = volunteerOpportunities.find(opp => opp.id === numericId);

  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(opportunity || null);
    }, 300);
  });
};

/**
 * Calculate match score between a user profile and an opportunity with enhanced algorithm
 *
 * @param {Object} userProfile - The user's profile with skills, interests, etc.
 * @param {Object} opportunity - The volunteer opportunity
 * @returns {Object} - Match data including score and detailed breakdown
 */
const calculateEnhancedMatch = (userProfile, opportunity) => {
  if (!userProfile || !opportunity) return { score: 0, details: {} };

  // Calculate individual category scores
  const skillsData = calculateEnhancedSkillsScore(
    userProfile.skills || [],
    opportunity.requiredSkills || opportunity.skills_required?.split(', ') || [],
    opportunity.recommendedSkills || []
  );

  const interestsData = calculateEnhancedInterestsScore(
    userProfile.interests || [],
    opportunity.interests || []
  );

  const availabilityScore = calculateEnhancedAvailabilityScore(
    userProfile.availability || {},
    opportunity.time_requirements || ""
  );

  const locationScore = calculateEnhancedLocationScore(
    userProfile.city || userProfile.location || "",
    opportunity.location || ""
  );

  // Calculate personality score if available
  const personalityScore = calculatePersonalityMatch(
    userProfile.personality || {},
    opportunity.personality_traits || {}
  );

  // Calculate weighted total score
  const weightedScore =
    (skillsData.score * matchWeights.skills) +
    (interestsData.score * matchWeights.interests) +
    (availabilityScore * matchWeights.availability) +
    (locationScore * matchWeights.location);

  // Apply personality boost if available
  const finalScore = personalityScore > 0
    ? weightedScore * (1.0 + (personalityScore * 0.05))
    : weightedScore;

  // Create detailed match breakdown
  return {
    score: Math.round(finalScore),
    details: {
      skillScore: Math.round(skillsData.score),
      matchedSkills: skillsData.matchedSkills,
      missingSkills: skillsData.missingSkills,
      interestScore: Math.round(interestsData.score),
      matchingInterests: interestsData.matchingInterests,
      availabilityScore: Math.round(availabilityScore),
      locationScore: Math.round(locationScore),
      personalityScore: personalityScore > 0 ? Math.round(personalityScore) : 0
    }
  };
};

/**
 * Calculate enhanced skills score with consideration for required and recommended skills
 *
 * @param {Array} userSkills - User's skills
 * @param {Array} requiredSkills - Skills required for the opportunity
 * @param {Array} recommendedSkills - Skills recommended but not required
 * @returns {Object} - Score object with score, matched skills, and missing skills
 */
const calculateEnhancedSkillsScore = (userSkills, requiredSkills, recommendedSkills) => {
  if (!userSkills || !userSkills.length) return { score: 0, matchedSkills: [], missingSkills: requiredSkills };
  if (!requiredSkills) requiredSkills = [];
  if (!recommendedSkills) recommendedSkills = [];

  // Normalize all skills to lowercase for better matching
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase());
  const normalizedRequiredSkills = requiredSkills.map(skill => skill.toLowerCase());
  const normalizedRecommendedSkills = recommendedSkills.map(skill => skill.toLowerCase());

  // Find matching required skills
  const matchedRequiredSkills = normalizedRequiredSkills.filter(skill =>
    normalizedUserSkills.some(userSkill =>
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );

  // Find partial matches
  const partialMatches = normalizedRequiredSkills.filter(skill =>
    !matchedRequiredSkills.includes(skill) &&
    normalizedUserSkills.some(userSkill =>
      isPartialMatch(userSkill, skill)
    )
  );

  // Find matching recommended skills
  const matchedRecommendedSkills = normalizedRecommendedSkills.filter(skill =>
    normalizedUserSkills.some(userSkill =>
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );

  // Calculate required score (80% of total)
  let requiredScore = 0;
  if (normalizedRequiredSkills.length > 0) {
    const requiredMatch = (matchedRequiredSkills.length + (partialMatches.length * 0.5)) / normalizedRequiredSkills.length;
    requiredScore = requiredMatch * 80;
  } else {
    requiredScore = 80; // Full points if no required skills
  }

  // Calculate recommended score (20% of total)
  let recommendedScore = 0;
  if (normalizedRecommendedSkills.length > 0) {
    const recommendedMatch = matchedRecommendedSkills.length / normalizedRecommendedSkills.length;
    recommendedScore = recommendedMatch * 20;
  } else {
    recommendedScore = 20; // Full points if no recommended skills
  }

  // Calculate missing skills
  const missingSkills = normalizedRequiredSkills.filter(skill =>
    !matchedRequiredSkills.includes(skill) && !partialMatches.includes(skill)
  );

  // Get original case for skills to display to user
  const displayMatchedSkills = [
    ...requiredSkills.filter((_, index) => matchedRequiredSkills.includes(normalizedRequiredSkills[index])),
    ...recommendedSkills.filter((_, index) => matchedRecommendedSkills.includes(normalizedRecommendedSkills[index])),
    ...requiredSkills.filter((_, index) => partialMatches.includes(normalizedRequiredSkills[index]))
  ];

  const displayMissingSkills = requiredSkills.filter((_, index) =>
    missingSkills.includes(normalizedRequiredSkills[index])
  );

  return {
    score: requiredScore + recommendedScore,
    matchedSkills: [...new Set(displayMatchedSkills)], // Remove duplicates
    missingSkills: displayMissingSkills
  };
};

/**
 * Check if two skill terms have a partial match
 *
 * @param {string} skill1 - First skill
 * @param {string} skill2 - Second skill
 * @returns {boolean} - True if there's a meaningful partial match
 */
const isPartialMatch = (skill1, skill2) => {
  // Minimum length of common substring to consider a partial match
  const MIN_COMMON_LENGTH = 5;

  // Check for common words
  const words1 = skill1.split(' ');
  const words2 = skill2.split(' ');

  for (const word1 of words1) {
    if (word1.length < 4) continue; // Skip short words

    if (words2.some(word2 => word2.length >= 4 && (word1.includes(word2) || word2.includes(word1)))) {
      return true;
    }
  }

  // Find the longest common substring
  for (let i = 0; i < skill1.length; i++) {
    for (let j = 0; j < skill2.length; j++) {
      let k = 0;
      while (i + k < skill1.length && j + k < skill2.length &&
             skill1[i + k] === skill2[j + k]) {
        k++;
      }
      if (k >= MIN_COMMON_LENGTH) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Calculate enhanced interests score with semantic similarity
 *
 * @param {Array} userInterests - User's interests
 * @param {Array} opportunityInterests - Interests relevant to the opportunity
 * @returns {Object} - Object with score and matching interests
 */
const calculateEnhancedInterestsScore = (userInterests, opportunityInterests) => {
  if (!userInterests || !userInterests.length) return { score: 30, matchingInterests: [] };
  if (!opportunityInterests || !opportunityInterests.length) return { score: 50, matchingInterests: [] };

  // Normalize interest strings to lowercase for better matching
  const normalizedUserInterests = userInterests.map(interest => interest.toLowerCase());
  const normalizedOppInterests = opportunityInterests.map(interest => interest.toLowerCase());

  // Find exact matching interests
  const exactMatches = normalizedUserInterests.filter(interest =>
    normalizedOppInterests.includes(interest)
  );

  // Find semantic matches (related interests that aren't exact matches)
  const semanticMatches = [];
  for (const userInterest of normalizedUserInterests) {
    if (exactMatches.includes(userInterest)) continue; // Skip exact matches

    for (const oppInterest of normalizedOppInterests) {
      if (areInterestsRelated(userInterest, oppInterest)) {
        semanticMatches.push(oppInterest);
        break; // Only count one semantic match per user interest
      }
    }
  }

  // Get original case for interests to display to user
  const displayMatches = [
    ...opportunityInterests.filter((_, index) => exactMatches.includes(normalizedOppInterests[index])),
    ...opportunityInterests.filter((_, index) => semanticMatches.includes(normalizedOppInterests[index]))
  ];

  // Calculate Jaccard similarity with semantic boost
  const unionSize = new Set([...normalizedUserInterests, ...normalizedOppInterests]).size;

  // Count exact matches fully and semantic matches at 0.75 weight
  const weightedMatchCount = exactMatches.length + (semanticMatches.length * 0.75);

  // Calculate similarity and convert to percentage
  const similarity = unionSize > 0 ? (weightedMatchCount / unionSize) * 100 : 50;

  return {
    score: similarity,
    matchingInterests: [...new Set(displayMatches)] // Remove duplicates
  };
};

/**
 * Check if two interest terms are semantically related
 *
 * @param {string} interest1 - First interest
 * @param {string} interest2 - Second interest
 * @returns {boolean} - True if the interests are related
 */
const areInterestsRelated = (interest1, interest2) => {
  // Check for substring matches
  if (interest1.includes(interest2) || interest2.includes(interest1)) {
    return true;
  }

  // Simple synonym dictionary for Albanian
  const interestSynonyms = {
    'mjedis': ['ekologji', 'natyrë', 'ambient', 'gjelbër'],
    'edukim': ['arsim', 'mësim', 'shkollë', 'dije'],
    'fëmijë': ['të rinj', 'të vegjël', 'adoleshentë', 'rini'],
    'kafshë': ['fauna', 'qenie', 'kafshët'],
    'teknologji': ['tech', 'it', 'digjital', 'kompjuter'],
    'art': ['artet', 'krijimtari', 'kreativitet'],
    'komunitet': ['shoqëri', 'qytet', 'lagje', 'grup'],
    'sport': ['aktivitet fizik', 'stërvitje', 'trajnim'],
    'shëndetësi': ['mjekësi', 'shëndet', 'mirëqenie'],
    'të moshuarit': ['pleqtë', 'të moshuar', 'pensionistë']
  };

  // Check if the interests belong to the same category
  for (const [key, synonyms] of Object.entries(interestSynonyms)) {
    const category1 = interest1 === key || synonyms.some(syn => interest1.includes(syn));
    const category2 = interest2 === key || synonyms.some(syn => interest2.includes(syn));

    if (category1 && category2) {
      return true;
    }
  }

  return false;
};

/**
 * Calculate enhanced availability match from string description
 *
 * @param {Object} userAvailability - User's availability preferences
 * @param {string} opportunityTimeReq - String description of time requirements
 * @returns {number} - Match score between 0-100
 */
const calculateEnhancedAvailabilityScore = (userAvailability, opportunityTimeReq) => {
  if (!userAvailability || Object.keys(userAvailability).length === 0) {
    return 50; // Neutral score if no availability provided
  }

  if (!opportunityTimeReq) {
    return 100; // Full score if no time requirements
  }

  // Convert to lowercase for consistent matching
  const timeReq = opportunityTimeReq.toLowerCase();

  // Start with a base score
  let score = 50;

  // Check for weekday/weekend matches
  if (timeReq.includes('ditët e punës') || timeReq.includes('weekday')) {
    if (userAvailability.weekdays) {
      score += 20;
    } else {
      score -= 10;
    }
  }

  if (timeReq.includes('fundjavë') || timeReq.includes('weekend')) {
    if (userAvailability.weekends) {
      score += 20;
    } else {
      score -= 10;
    }
  }

  // Check time of day matches
  if (timeReq.includes('mëngjes') || timeReq.includes('morning') ||
      timeReq.includes('9:00') || timeReq.includes('8:00')) {
    if (userAvailability.mornings) {
      score += 10;
    } else {
      score -= 5;
    }
  }

  if (timeReq.includes('pasdite') || timeReq.includes('afternoon')) {
    if (userAvailability.afternoons) {
      score += 10;
    } else {
      score -= 5;
    }
  }

  if (timeReq.includes('mbrëmje') || timeReq.includes('evening')) {
    if (userAvailability.evenings) {
      score += 10;
    } else {
      score -= 5;
    }
  }

  // Flexible schedules favor the match
  if (timeReq.includes('fleksibël') || timeReq.includes('flexible')) {
    score += 15;
  }

  // Limit score to 0-100 range
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculate enhanced location match score
 *
 * @param {string} userLocation - User's location
 * @param {string} opportunityLocation - Opportunity's location
 * @returns {number} - Match score between 0-100
 */
const calculateEnhancedLocationScore = (userLocation, opportunityLocation) => {
  if (!userLocation || !opportunityLocation) {
    return 50; // Neutral score if either location is missing
  }

  // Convert to lowercase for consistent matching
  userLocation = userLocation.toLowerCase();
  opportunityLocation = opportunityLocation.toLowerCase();

  // Perfect match
  if (userLocation === opportunityLocation) {
    return 100;
  }

  // Check for partial matches
  if (userLocation.includes(opportunityLocation) || opportunityLocation.includes(userLocation)) {
    return 85;
  }

  // Check for nationwide opportunities
  if (opportunityLocation.includes('shqipëri') ||
      opportunityLocation.includes('nationwide') ||
      opportunityLocation.includes('në të gjithë')) {
    return 75;
  }

  // City proximity matching - a simplified approach
  const nearbyLocations = {
    'tiranë': ['durrës', 'vorë', 'kamëz'],
    'durrës': ['tiranë', 'shijak'],
    'vlorë': ['fier', 'orikum'],
    'shkodër': ['lezhë', 'koplik'],
    'elbasan': ['librazhd', 'peqin'],
    // Add more as needed
  };

  // Extract city name from location (simplified - assumes first word is city)
  const userCity = userLocation.split(' ')[0];
  const oppCity = opportunityLocation.split(' ')[0];

  // Check if cities are nearby
  if (nearbyLocations[userCity]?.includes(oppCity) ||
      nearbyLocations[oppCity]?.includes(userCity)) {
    return 70;
  }

  // Default score for different locations
  return 30;
};

/**
 * Calculate personality match score if data is available
 *
 * @param {Object} userPersonality - User's personality traits
 * @param {Object} opportunityPersonality - Desired personality traits
 * @returns {number} - Match score between 0-100, or 0 if data not available
 */
const calculatePersonalityMatch = (userPersonality, opportunityPersonality) => {
  // Skip if either is missing or empty
  if (!userPersonality || !opportunityPersonality ||
      Object.keys(userPersonality).length === 0 ||
      Object.keys(opportunityPersonality).length === 0) {
    return 0;
  }

  // Find common traits
  const commonTraits = Object.keys(userPersonality).filter(
    trait => trait in opportunityPersonality
  );

  if (commonTraits.length === 0) {
    return 0;
  }

  // Calculate similarity (cosine similarity)
  let dotProduct = 0;
  for (const trait of commonTraits) {
    dotProduct += userPersonality[trait] * opportunityPersonality[trait];
  }

  // Calculate magnitudes
  const userMagnitude = Math.sqrt(
    Object.values(userPersonality).reduce((sum, val) => sum + val * val, 0)
  );

  const oppMagnitude = Math.sqrt(
    Object.values(opportunityPersonality).reduce((sum, val) => sum + val * val, 0)
  );

  // Avoid division by zero
  if (userMagnitude === 0 || oppMagnitude === 0) {
    return 0;
  }

  // Calculate similarity and convert to percentage
  return (dotProduct / (userMagnitude * oppMagnitude)) * 100;
};

/**
 * Get matches for the current user using the enhanced algorithm
 *
 * @param {Object} userProfile - User profile data (or null to use mock data)
 * @returns {Promise<Array>} Array of matching opportunities with scores
 */
export const getMatches = async (userProfile = null) => {
  // In a real implementation, this would pull the user profile from an API or context
  // For now, we'll simulate a user profile if none is provided
  const profile = userProfile || {
    name: "Anisa",
    surname: "Cuku",
    email: "anisacuku07@gmail.com",
    phoneNumber: "355123456789",
    profession: "Student",
    skills: ["Komunikim", "Mësimdhënie", "Organizim", "Programim", "Punë në ekip"],
    interests: ["Edukim", "Mjedis", "Fëmijë", "Teknologji", "Arte"],
    city: "Tiranë",
    availability: {
      weekdays: true,
      weekends: true,
      mornings: false,
      afternoons: true,
      evenings: true
    }
  };

  // Get all opportunities
  const opportunities = await getAllOpportunities();

  // Calculate match scores for each opportunity
  const matches = opportunities.map(opportunity => {
    const matchData = calculateEnhancedMatch(profile, opportunity);

    return {
      opportunity,
      score: matchData.score,
      matched_skills: matchData.details.matchedSkills,
      matching_interests: matchData.details.matchingInterests,
      match_details: matchData.details
    };
  });

  // Sort by score and limit to top matches
  const topMatches = matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(topMatches);
    }, 500);
  });
};

/**
 * Get recommended opportunities for the current user
 * Different from top matches - focuses on diversity and exploration
 *
 * @param {Object} userProfile - User profile data (or null to use mock data)
 * @param {Array} excludedIds - IDs of opportunities to exclude (e.g., already matched)
 * @returns {Promise<Array>} Array of recommended opportunities
 */
export const getRecommendedOpportunities = async (userProfile = null, excludedIds = []) => {
  // Use provided profile or mock data
  const profile = userProfile || {
    name: "Anisa",
    surname: "Cuku",
    email: "anisacuku07@gmail.com",
    phoneNumber: "355123456789",
    profession: "Student",
    skills: ["Komunikim", "Mësimdhënie", "Organizim", "Programim", "Punë në ekip"],
    interests: ["Edukim", "Mjedis", "Fëmijë", "Teknologji", "Arte"],
    city: "Tiranë",
    availability: {
      weekdays: true,
      weekends: true,
      mornings: false,
      afternoons: true,
      evenings: true
    }
  };

  // Get all opportunities
  const opportunities = await getAllOpportunities();

  // If no excluded IDs provided, first get top matches to exclude them
  let idsToExclude = excludedIds;
  if (idsToExclude.length === 0) {
    const topMatches = await getMatches(profile);
    idsToExclude = topMatches.slice(0, 3).map(match => match.opportunity.id);
  }

  // Calculate matches for remaining opportunities
  const allMatches = opportunities
    .filter(opp => !idsToExclude.includes(opp.id))
    .map(opportunity => {
      const matchData = calculateEnhancedMatch(profile, opportunity);
      return {
        opportunity,
        score: matchData.score
      };
    });

  // Sort by score
  const sortedMatches = allMatches.sort((a, b) => b.score - a.score);

  // For recommendations, we want a mix of good matches and diversity
  // Get some good-but-not-perfect matches to encourage exploration
  const goodMatches = sortedMatches.filter(match => match.score >= 50 && match.score < 80);

  // Mix in some opportunities that match different interests than top matches
  const diverseInterestMatches = findOpportunitiesWithDiverseInterests(sortedMatches, profile.interests);

  // Create the final recommendations list
  let recommendations = [
    ...goodMatches.slice(0, 2),
    ...diverseInterestMatches.slice(0, 2)
  ];

  // If we don't have enough recommendations, add more from top matches
  if (recommendations.length < 3) {
    const remainingNeeded = 3 - recommendations.length;
    const otherTopMatches = sortedMatches
      .filter(match => !recommendations.includes(match))
      .slice(0, remainingNeeded);

    recommendations = [...recommendations, ...otherTopMatches];
  }

  // Extract just the opportunity objects for simpler usage
  const recommendedOpportunities = recommendations
    .filter(rec => rec.score >= 40) // Ensure minimum quality
    .map(rec => rec.opportunity);

  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(recommendedOpportunities.slice(0, 4));
    }, 500);
  });
};

/**
 * Find opportunities that match different interests than the user's primary interests
 * This helps with recommendation diversity
 *
 * @param {Array} opportunities - Opportunity matches with scores
 * @param {Array} userInterests - User's stated interests
 * @returns {Array} - Opportunities that match diverse interests
 */
const findOpportunitiesWithDiverseInterests = (opportunities, userInterests) => {
  if (!userInterests || userInterests.length === 0) {
    return opportunities.slice(0, 3);
  }

  // Normalize user interests to lowercase
  const normalizedUserInterests = userInterests.map(i => i.toLowerCase());

  // Primary interests are the first 2 (most important to user)
  const primaryInterests = normalizedUserInterests.slice(0, 2);

  // Find opportunities that don't focus on primary interests
  return opportunities.filter(match => {
    const oppInterests = match.opportunity.interests || [];
    const normalizedOppInterests = oppInterests.map(i => i.toLowerCase());

    // Count matches with primary interests
    const primaryMatches = primaryInterests.filter(interest =>
      normalizedOppInterests.some(oppInterest =>
        areInterestsRelated(interest, oppInterest)
      )
    ).length;

    // Keep opportunities with 0 or 1 primary interest matches
    // This ensures some interest alignment but different focus
    return primaryMatches <= 1;
  });
};

/**
 * Search opportunities based on criteria
 *
 * @param {Object} searchCriteria - Search parameters (location, interests, etc.)
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} - Matching opportunities
 */
export const searchOpportunities = async (searchCriteria, limit = 10) => {
  // Get all opportunities
  const opportunities = await getAllOpportunities();

  let filteredOpportunities = [...opportunities];

  // Filter by location if provided
  if (searchCriteria.location) {
    filteredOpportunities = filteredOpportunities.filter(opportunity =>
      opportunity.location.toLowerCase().includes(searchCriteria.location.toLowerCase())
    );
  }

  // Filter by interest if provided
  if (searchCriteria.interest) {
    filteredOpportunities = filteredOpportunities.filter(opportunity =>
      opportunity.interests.some(interest =>
        interest.toLowerCase().includes(searchCriteria.interest.toLowerCase()) ||
        areInterestsRelated(interest.toLowerCase(), searchCriteria.interest.toLowerCase())
      )
    );
  }

  // Filter by skill if provided
  if (searchCriteria.skill) {
    filteredOpportunities = filteredOpportunities.filter(opportunity =>
      opportunity.skills_required.toLowerCase().includes(searchCriteria.skill.toLowerCase()) ||
      (opportunity.requiredSkills && opportunity.requiredSkills.some(skill =>
        skill.toLowerCase().includes(searchCriteria.skill.toLowerCase()) ||
        isPartialMatch(skill.toLowerCase(), searchCriteria.skill.toLowerCase())
      )) ||
      (opportunity.recommendedSkills && opportunity.recommendedSkills.some(skill =>
        skill.toLowerCase().includes(searchCriteria.skill.toLowerCase()) ||
        isPartialMatch(skill.toLowerCase(), searchCriteria.skill.toLowerCase())
      ))
    );
  }

  // Filter by date if provided
  if (searchCriteria.date) {
    // This is a simplified implementation - in a real app, use proper date parsing
    filteredOpportunities = filteredOpportunities.filter(opportunity =>
      opportunity.date.includes(searchCriteria.date)
    );
  }

  // Filter by minimum spots if provided
  if (searchCriteria.minSpots && !isNaN(searchCriteria.minSpots)) {
    filteredOpportunities = filteredOpportunities.filter(opportunity =>
      opportunity.spotsLeft >= parseInt(searchCriteria.minSpots, 10)
    );
  }

  // Limit results
  const results = filteredOpportunities.slice(0, limit);

  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(results);
    }, 400);
  });
};