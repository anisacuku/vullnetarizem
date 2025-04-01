// src/services/profileMatchingService.js
import { getAllOpportunities } from './matchingService';

/**
 * Find personalized recommendations based on user profile data
 * @param {Object} profileData - User profile with skills, interests, availability
 * @returns {Promise<Array>} - Recommended opportunities sorted by match score
 */
export const findRecommendations = async (profileData) => {
  // Get all available opportunities
  const opportunities = await getAllOpportunities();

  // Calculate match scores for each opportunity
  const matches = opportunities.map(opportunity => {
    const matchData = calculateMatch(profileData, opportunity);

    return {
      opportunity,
      score: matchData.score,
      matched_skills: matchData.matchedSkills,
      matching_interests: matchData.matchingInterests,
      match_details: {
        skillScore: matchData.skillScore,
        interestScore: matchData.interestScore,
        availabilityScore: matchData.availabilityScore,
        locationScore: matchData.locationScore
      }
    };
  });

  // Sort by score (highest first)
  const sortedMatches = matches.sort((a, b) => b.score - a.score);

  // Return top recommendations
  return sortedMatches.slice(0, 6);
};

/**
 * Calculate match score between a user profile and an opportunity
 *
 * @param {Object} profile - User profile data
 * @param {Object} opportunity - Volunteer opportunity data
 * @returns {Object} - Match data with scores and details
 */
const calculateMatch = (profile, opportunity) => {
  if (!profile || !opportunity) {
    return {
      score: 0,
      matchedSkills: [],
      matchingInterests: [],
      skillScore: 0,
      interestScore: 0,
      availabilityScore: 0,
      locationScore: 0
    };
  }

  // Extract data for matching
  const userSkills = profile.skills || [];
  const userInterests = profile.interests || [];
  const userAvailability = profile.availability || {};
  const userLocation = profile.city || '';

  const requiredSkills = opportunity.requiredSkills ||
    (opportunity.skills_required ? opportunity.skills_required.split(', ') : []);

  const recommendedSkills = opportunity.recommendedSkills || [];
  const opportunityInterests = opportunity.interests || [];
  const opportunityLocation = opportunity.location || '';
  const timeRequirements = opportunity.time_requirements || '';

  // Calculate individual scores
  const skillsData = calculateSkillsScore(userSkills, requiredSkills, recommendedSkills);
  const interestsData = calculateInterestsScore(userInterests, opportunityInterests);
  const availabilityScore = calculateAvailabilityScore(userAvailability, timeRequirements);
  const locationScore = calculateLocationScore(userLocation, opportunityLocation);

  // Apply weights to each category
  const weights = {
    skills: 0.40,
    interests: 0.30,
    availability: 0.15,
    location: 0.15
  };

  // Calculate weighted final score
  const finalScore = (
    skillsData.score * weights.skills +
    interestsData.score * weights.interests +
    availabilityScore * weights.availability +
    locationScore * weights.location
  );

  return {
    score: Math.round(finalScore),
    matchedSkills: skillsData.matchedSkills,
    matchingInterests: interestsData.matchingInterests,
    skillScore: Math.round(skillsData.score),
    interestScore: Math.round(interestsData.score),
    availabilityScore: Math.round(availabilityScore),
    locationScore: Math.round(locationScore)
  };
};

/**
 * Calculate skills match score
 *
 * @param {Array} userSkills - User's skills
 * @param {Array} requiredSkills - Required skills for opportunity
 * @param {Array} recommendedSkills - Recommended skills for opportunity
 * @returns {Object} - Score and matched skills
 */
const calculateSkillsScore = (userSkills, requiredSkills, recommendedSkills) => {
  if (!userSkills || userSkills.length === 0) {
    return { score: 0, matchedSkills: [] };
  }

  if (!requiredSkills) requiredSkills = [];
  if (!recommendedSkills) recommendedSkills = [];

  // Normalize skills to lowercase for better matching
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase());
  const normalizedRequiredSkills = requiredSkills.map(skill => skill.toLowerCase());
  const normalizedRecommendedSkills = recommendedSkills.map(skill => skill.toLowerCase());

  // Find matching required skills
  const matchedRequiredSkills = normalizedRequiredSkills.filter(skill =>
    normalizedUserSkills.some(userSkill =>
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );

  // Find matching recommended skills
  const matchedRecommendedSkills = normalizedRecommendedSkills.filter(skill =>
    normalizedUserSkills.some(userSkill =>
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );

  // Calculate scores for required (80%) and recommended (20%) skills
  let requiredScore = 0;
  if (normalizedRequiredSkills.length > 0) {
    requiredScore = (matchedRequiredSkills.length / normalizedRequiredSkills.length) * 80;
  } else {
    requiredScore = 80; // Full points if no required skills
  }

  let recommendedScore = 0;
  if (normalizedRecommendedSkills.length > 0) {
    recommendedScore = (matchedRecommendedSkills.length / normalizedRecommendedSkills.length) * 20;
  } else {
    recommendedScore = 20; // Full points if no recommended skills
  }

  // Get display versions of matched skills (original case)
  const displayMatchedSkills = [
    ...requiredSkills.filter((_, index) =>
      matchedRequiredSkills.includes(normalizedRequiredSkills[index])
    ),
    ...recommendedSkills.filter((_, index) =>
      matchedRecommendedSkills.includes(normalizedRecommendedSkills[index])
    )
  ];

  return {
    score: requiredScore + recommendedScore,
    matchedSkills: [...new Set(displayMatchedSkills)] // Remove duplicates
  };
};

/**
 * Calculate interests match score
 *
 * @param {Array} userInterests - User's interests
 * @param {Array} opportunityInterests - Opportunity interests
 * @returns {Object} - Score and matching interests
 */
const calculateInterestsScore = (userInterests, opportunityInterests) => {
  if (!userInterests || userInterests.length === 0) {
    return { score: 30, matchingInterests: [] };
  }

  if (!opportunityInterests || opportunityInterests.length === 0) {
    return { score: 50, matchingInterests: [] };
  }

  // Normalize interests to lowercase
  const normalizedUserInterests = userInterests.map(interest => interest.toLowerCase());
  const normalizedOppInterests = opportunityInterests.map(interest => interest.toLowerCase());

  // Find exact matching interests
  const exactMatches = normalizedUserInterests.filter(interest =>
    normalizedOppInterests.includes(interest)
  );

  // Find related interests (semantic matching)
  const relatedMatches = [];
  for (const userInterest of normalizedUserInterests) {
    if (exactMatches.includes(userInterest)) continue;

    for (const oppInterest of normalizedOppInterests) {
      if (areInterestsRelated(userInterest, oppInterest)) {
        relatedMatches.push(oppInterest);
        break;
      }
    }
  }

  // Get original display versions
  const displayMatches = [
    ...opportunityInterests.filter((_, index) =>
      exactMatches.includes(normalizedOppInterests[index])
    ),
    ...opportunityInterests.filter((_, index) =>
      relatedMatches.includes(normalizedOppInterests[index])
    )
  ];

  // Calculate Jaccard similarity with semantic boost
  const unionSize = new Set([...normalizedUserInterests, ...normalizedOppInterests]).size;

  // Count exact matches fully and related matches at 75% weight
  const weightedMatchCount = exactMatches.length + (relatedMatches.length * 0.75);
  const similarity = unionSize > 0 ? (weightedMatchCount / unionSize) * 100 : 50;

  return {
    score: similarity,
    matchingInterests: [...new Set(displayMatches)] // Remove duplicates
  };
};

/**
 * Check if two interests are semantically related
 *
 * @param {string} interest1 - First interest
 * @param {string} interest2 - Second interest
 * @returns {boolean} - True if interests are related
 */
const areInterestsRelated = (interest1, interest2) => {
  // Direct substring match
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
    'art': ['arte', 'krijimtari', 'kreativitet'],
    'komunitet': ['shoqëri', 'qytet', 'lagje', 'grup'],
    'sport': ['aktivitet fizik', 'stërvitje', 'trajnim'],
    'shëndetësi': ['mjekësi', 'shëndet', 'mirëqenie'],
    'të moshuarit': ['pleqtë', 'të moshuar', 'pensionistë']
  };

  // Check if interests belong to same category
  for (const [key, synonyms] of Object.entries(interestSynonyms)) {
    const isInterest1InCategory = (interest1 === key || synonyms.some(syn => interest1.includes(syn)));
    const isInterest2InCategory = (interest2 === key || synonyms.some(syn => interest2.includes(syn)));

    if (isInterest1InCategory && isInterest2InCategory) {
      return true;
    }
  }

  return false;
};

/**
 * Calculate availability match score
 *
 * @param {Object} userAvailability - User's availability preferences
 * @param {string} timeRequirements - Opportunity time requirements
 * @returns {number} - Match score (0-100)
 */
const calculateAvailabilityScore = (userAvailability, timeRequirements) => {
  if (!userAvailability || Object.keys(userAvailability).length === 0) {
    return 50; // Neutral score if no availability provided
  }

  if (!timeRequirements) {
    return 100; // Full score if no requirements
  }

  // Convert to lowercase for better matching
  const timeReqLower = timeRequirements.toLowerCase();

  // Start with base score
  let score = 50;

  // Check for weekdays/weekends match
  if (timeReqLower.includes('ditët e punës') || timeReqLower.includes('e hënë') ||
      timeReqLower.includes('e martë') || timeReqLower.includes('e mërkurë') ||
      timeReqLower.includes('e enjte') || timeReqLower.includes('e premte')) {
    if (userAvailability.weekdays) {
      score += 20;
    } else {
      score -= 10;
    }
  }

  if (timeReqLower.includes('fundjavë') || timeReqLower.includes('e shtunë') ||
      timeReqLower.includes('e diel')) {
    if (userAvailability.weekends) {
      score += 20;
    } else {
      score -= 10;
    }
  }

  // Check for time of day match
  if (timeReqLower.includes('mëngjes') || (timeReqLower.includes('9:00') && !timeReqLower.includes('19:00'))) {
    if (userAvailability.mornings) {
      score += 10;
    } else {
      score -= 5;
    }
  }

  if (timeReqLower.includes('pasdite') || timeReqLower.includes('15:00') || timeReqLower.includes('14:00')) {
    if (userAvailability.afternoons) {
      score += 10;
    } else {
      score -= 5;
    }
  }

  if (timeReqLower.includes('mbrëmje') || timeReqLower.includes('19:00') || timeReqLower.includes('20:00')) {
    if (userAvailability.evenings) {
      score += 10;
    } else {
      score -= 5;
    }
  }

  // Flexible schedules are preferred
  if (timeReqLower.includes('fleksibël') || timeReqLower.includes('sipas nevojës')) {
    score += 15;
  }

  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculate location match score
 *
 * @param {string} userLocation - User's location (city)
 * @param {string} opportunityLocation - Opportunity location
 * @returns {number} - Match score (0-100)
 */
const calculateLocationScore = (userLocation, opportunityLocation) => {
  if (!userLocation || !opportunityLocation) {
    return 50; // Neutral score if either location is missing
  }

  // Normalize to lowercase
  userLocation = userLocation.toLowerCase();
  opportunityLocation = opportunityLocation.toLowerCase();

  // Perfect match
  if (userLocation === opportunityLocation) {
    return 100;
  }

  // Partial match (one location is part of the other)
  if (opportunityLocation.includes(userLocation) || userLocation.includes(opportunityLocation)) {
    return 85;
  }

  // Nationwide opportunities are good matches
  if (opportunityLocation.includes('shqipëri') || opportunityLocation.includes('të gjithë') ||
      opportunityLocation.includes('nationwide')) {
    return 75;
  }

  // Check for nearby cities
  const nearbyCities = {
    'tiranë': ['durrës', 'vorë', 'kamëz'],
    'durrës': ['tiranë', 'shijak'],
    'vlorë': ['fier', 'orikum'],
    'shkodër': ['lezhë', 'koplik'],
    'elbasan': ['librazhd', 'peqin'],
    // Add more as needed
  };

  // Check if cities are nearby
  if (nearbyCities[userLocation] && opportunityLocation.split(',').some(loc =>
    nearbyCities[userLocation].includes(loc.trim()))) {
    return 70;
  }

  if (nearbyCities[opportunityLocation] && nearbyCities[opportunityLocation].includes(userLocation)) {
    return 70;
  }

  // Default score for different locations
  return 30;
};