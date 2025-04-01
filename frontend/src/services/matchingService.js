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
 * Calculate match score between a user profile and an opportunity
 *
 * @param {Object} userProfile - The user's profile with skills, interests, etc.
 * @param {Object} opportunity - The volunteer opportunity
 * @returns {number} - Match score percentage (0-100)
 */
const calculateMatchScore = (userProfile, opportunity) => {
  if (!userProfile || !opportunity) return 0;

  // Initialize scores
  let totalScore = 0;
  let maxPossibleScore = 100;

  // Skills match (40% weight)
  const skillsScore = calculateSkillsScore(userProfile.skills, opportunity.requiredSkills, opportunity.recommendedSkills);

  // Interests match (30% weight)
  const interestsScore = calculateInterestsScore(userProfile.interests, opportunity.interests);

  // Location preference match (15% weight)
  const locationScore = calculateLocationScore(userProfile, opportunity);

  // Availability match (15% weight)
  const availabilityScore = calculateAvailabilityScore(userProfile.availability, opportunity.time_requirements);

  // Calculate weighted total
  totalScore = (skillsScore * 0.4) + (interestsScore * 0.3) + (locationScore * 0.15) + (availabilityScore * 0.15);

  // Round to nearest integer and ensure within 0-100 range
  return Math.min(100, Math.max(0, Math.round(totalScore)));
};

/**
 * Calculate how well user's skills match opportunity requirements
 *
 * @param {Array} userSkills - User's skills
 * @param {Array} requiredSkills - Skills required for the opportunity
 * @param {Array} recommendedSkills - Skills recommended but not required
 * @returns {number} - Score from 0-100
 */
const calculateSkillsScore = (userSkills, requiredSkills, recommendedSkills) => {
  if (!userSkills || !userSkills.length) return 0;
  if (!requiredSkills) requiredSkills = [];
  if (!recommendedSkills) recommendedSkills = [];

  let score = 0;
  const maxScore = 100;

  // Required skills have higher weight
  if (requiredSkills.length > 0) {
    const requiredMatches = requiredSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ).length;

    const requiredPercentage = requiredMatches / requiredSkills.length;
    score += requiredPercentage * 70; // 70% weight for required skills
  } else {
    score += 70; // Full points if no required skills
  }

  // Recommended skills have lower weight
  if (recommendedSkills.length > 0) {
    const recommendedMatches = recommendedSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ).length;

    const recommendedPercentage = recommendedMatches / recommendedSkills.length;
    score += recommendedPercentage * 30; // 30% weight for recommended skills
  } else {
    score += 30; // Full points if no recommended skills
  }

  return score;
};

/**
 * Calculate how well user's interests match opportunity interests
 *
 * @param {Array} userInterests - User's interests
 * @param {Array} opportunityInterests - Interests relevant to the opportunity
 * @returns {number} - Score from 0-100
 */
const calculateInterestsScore = (userInterests, opportunityInterests) => {
  if (!userInterests || !userInterests.length) return 0;
  if (!opportunityInterests || !opportunityInterests.length) return 50; // Neutral score if no interests specified

  // Count how many interests match
  const matches = opportunityInterests.filter(interest =>
    userInterests.some(userInterest =>
      userInterest.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(userInterest.toLowerCase())
    )
  ).length;

  // Calculate percentage match and scale to 0-100
  return (matches / opportunityInterests.length) * 100;
};

/**
 * Calculate location match score
 *
 * @param {Object} userProfile - User profile with location preferences
 * @param {Object} opportunity - Opportunity with location
 * @returns {number} - Score from 0-100
 */
const calculateLocationScore = (userProfile, opportunity) => {
  if (!userProfile || !opportunity || !opportunity.location) return 50; // Neutral score

  // If user has preferred cities and opportunity location matches
  if (userProfile.city && opportunity.location.includes(userProfile.city)) {
    return 100;
  }

  // If user has not specified a city
  if (!userProfile.city) {
    return 60; // Slightly positive default
  }

  // For opportunities that list multiple cities or regions
  if (opportunity.location.includes("Në të gjithë Shqipërinë")) {
    return 80; // High score for nationwide opportunities
  }

  // If multiple cities are listed and user's city isn't among them
  if (opportunity.location.includes(",")) {
    return 40; // Lower score but not the lowest
  }

  // No match at all
  return 20;
};

/**
 * Calculate availability match score
 *
 * @param {Object} userAvailability - User's availability preferences
 * @param {string} opportunityTimeRequirements - Opportunity time requirements
 * @returns {number} - Score from 0-100
 */
const calculateAvailabilityScore = (userAvailability, opportunityTimeRequirements) => {
  if (!userAvailability || !opportunityTimeRequirements) return 50; // Neutral score

  let score = 50; // Start with neutral score

  // Parse opportunity time requirements
  const timeReq = opportunityTimeRequirements.toLowerCase();

  // Check weekday/weekend match
  if (userAvailability.weekdays && timeReq.includes("ditët e punës")) {
    score += 25;
  }

  if (userAvailability.weekends && (timeReq.includes("fundjavë") || timeReq.includes("vikend"))) {
    score += 25;
  }

  // Check time of day match
  if (userAvailability.mornings && (timeReq.includes("mëngjes") || timeReq.includes("9:00"))) {
    score += 10;
  }

  if (userAvailability.afternoons && timeReq.includes("pasdite")) {
    score += 10;
  }

  if (userAvailability.evenings && timeReq.includes("mbrëmje")) {
    score += 10;
  }

  // Flexible schedule is always a plus
  if (timeReq.includes("fleksibël")) {
    score += 15;
  }

  return Math.min(100, score); // Cap at 100
};

/**
 * Get top matches for a user profile
 *
 * @param {Object} userProfile - User's profile
 * @param {number} limit - Number of matches to return (default: 5)
 * @returns {Array} - Array of matches with scores
 */
export const getMatchesForUser = (userProfile, limit = 5) => {
  if (!userProfile) return [];

  const matches = volunteerOpportunities.map(opportunity => {
    const score = calculateMatchScore(userProfile, opportunity);
    return {
      opportunity,
      score
    };
  });

  // Sort by score (highest first) and limit results
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Get personalized recommendations (different from top matches)
 *
 * @param {Object} userProfile - User's profile
 * @param {Array} excludedIds - IDs of opportunities to exclude (e.g., already matched)
 * @param {number} limit - Number of recommendations to return
 * @returns {Array} - Array of recommended opportunities
 */
export const getRecommendationsForUser = (userProfile, excludedIds = [], limit = 3) => {
  if (!userProfile) return [];

  // First, get all matches
  const allMatches = volunteerOpportunities
    .filter(opportunity => !excludedIds.includes(opportunity.id))
    .map(opportunity => {
      const score = calculateMatchScore(userProfile, opportunity);
      return {
        opportunity,
        score
      };
    });

  // Sort by score (highest first)
  const sortedMatches = allMatches.sort((a, b) => b.score - a.score);

  // For recommendations, we want a mix of high scores and diversity
  // Select opportunities with good but not perfect matches to encourage exploration
  const goodMatches = sortedMatches.filter(match => match.score >= 50 && match.score < 85);

  // If we don't have enough good matches, supplement with top matches
  let recommendations = goodMatches.length >= limit ?
    goodMatches.slice(0, limit) :
    [...goodMatches, ...sortedMatches.filter(match => match.score >= 85)];

  // Limit results and ensure we're not recommending super low-quality matches
  return recommendations
    .filter(match => match.score >= 40)
    .slice(0, limit);
};

/**
 * Search opportunities based on criteria
 *
 * @param {Object} searchCriteria - Search parameters (location, interests, etc.)
 * @param {number} limit - Maximum number of results to return
 * @returns {Array} - Matching opportunities
 */
export const searchOpportunities = (searchCriteria, limit = 10) => {
  let filteredOpportunities = [...volunteerOpportunities];

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
        interest.toLowerCase().includes(searchCriteria.interest.toLowerCase())
      )
    );
  }

  // Filter by skill if provided
  if (searchCriteria.skill) {
    filteredOpportunities = filteredOpportunities.filter(opportunity =>
      opportunity.skills_required.toLowerCase().includes(searchCriteria.skill.toLowerCase()) ||
      (opportunity.requiredSkills && opportunity.requiredSkills.some(skill =>
        skill.toLowerCase().includes(searchCriteria.skill.toLowerCase())
      )) ||
      (opportunity.recommendedSkills && opportunity.recommendedSkills.some(skill =>
        skill.toLowerCase().includes(searchCriteria.skill.toLowerCase())
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

  // Limit results
  return filteredOpportunities.slice(0, limit);
};

/**
 * Get matches for the current user
 * This is a mock implementation for demonstration purposes
 * In a real app, this would fetch user profile from context or API
 *
 * @returns {Promise<Array>} Array of matching opportunities with scores
 */
export const getMatches = async () => {
  // In a real implementation, this would pull the user profile from an API or context
  // For now, we'll simulate a user profile
  const mockUserProfile = {
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

  // Get top matches
  const matches = getMatchesForUser(mockUserProfile, 5);

  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(matches);
    }, 500);
  });
};

/**
 * Get recommended opportunities for the current user
 * This is a mock implementation for demonstration purposes
 *
 * @returns {Promise<Array>} Array of recommended opportunities
 */
export const getRecommendedOpportunities = async () => {
  // Similar mock user profile
  const mockUserProfile = {
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

  // First get top matches to exclude them from recommendations
  const topMatches = getMatchesForUser(mockUserProfile, 5);
  const topMatchIds = topMatches.map(match => match.opportunity.id);

  // Get recommendations excluding top matches
  const recommendations = getRecommendationsForUser(mockUserProfile, topMatchIds, 3);

  // Extract just the opportunity objects for simpler usage
  const recommendedOpportunities = recommendations.map(rec => rec.opportunity);

  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(recommendedOpportunities);
    }, 500);
  });
};

