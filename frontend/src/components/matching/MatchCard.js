import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaHeart
} from 'react-icons/fa';
import './MatchCard.css';

/**
 * Enhanced match card component that displays match details with an interactive UI
 *
 * @param {Object} match - Match object with opportunity and score details
 */
const EnhancedMatchCard = ({ match }) => {
  const [expanded, setExpanded] = useState(false);

  if (!match || !match.opportunity) return null;

  const { opportunity, score, matched_skills, matching_interests, match_details } = match;

  // Calculate color for score circle based on match percentage
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';  // Green for excellent matches
    if (score >= 60) return '#8BC34A';  // Light green for good matches
    if (score >= 40) return '#FFC107';  // Yellow for decent matches
    return '#FF5722';  // Orange-red for poor matches
  };

  // Get percentage fill for score circle (conic gradient)
  const getScoreGradient = (score) => {
    const color = getScoreColor(score);
    return `conic-gradient(${color} ${score}%, #f3f3f3 0)`;
  };

  // Format date for consistent display
  const formatDate = (dateString) => {
    if (!dateString) return 'Fleksibël';
    return dateString;
  };

  return (
    <div className="enhanced-match-card">
      <div className="match-card-header">
        <div className="match-score-container">
          <div
            className="match-score-circle"
            style={{ background: getScoreGradient(score) }}
          >
            <div className="match-score-inner">
              <span className="match-percentage">{score}%</span>
            </div>
          </div>
          <span className="match-label">Përputhje</span>
        </div>

        <div className="match-opportunity-header">
          <h3 className="opportunity-title">{opportunity.title}</h3>
          <div className="organization-info">
            <FaBuilding className="org-icon" />
            <span>{opportunity.organization}</span>
          </div>
        </div>
      </div>

      <div className="match-card-body">
        <p className="opportunity-description">
          {opportunity.description.length > 160
            ? `${opportunity.description.substring(0, 160)}...`
            : opportunity.description}
        </p>

        <div className="opportunity-meta">
          <div className="opportunity-meta-item">
            <FaMapMarkerAlt className="meta-icon" />
            <span>{opportunity.location}</span>
          </div>

          <div className="opportunity-meta-item">
            <FaCalendarAlt className="meta-icon" />
            <span>{formatDate(opportunity.date)}</span>
          </div>

          <div className="opportunity-meta-item">
            <FaClock className="meta-icon" />
            <span>{opportunity.time_requirements || 'Fleksibël'}</span>
          </div>
        </div>

        {matched_skills && matched_skills.length > 0 && (
          <div className="match-skills">
            <div className="match-skills-header">
              <FaCheckCircle className="skills-icon" />
              <span>Aftësitë e përputhura:</span>
            </div>
            <div className="skill-tags">
              {matched_skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
              {matched_skills.length > 3 && (
                <span className="more-tag">+{matched_skills.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Expandable section with more details */}
        {expanded && (
          <div className="match-details-expanded">
            <div className="match-breakdown">
              <h4>Detaje Përputhshmërie</h4>

              <div className="score-breakdown">
                <div className="score-category">
                  <span className="category-label">Aftësi</span>
                  <div className="score-bar-container">
                    <div
                      className="score-bar"
                      style={{
                        width: `${match_details?.skillScore || 0}%`,
                        backgroundColor: getScoreColor(match_details?.skillScore || 0)
                      }}
                    ></div>
                  </div>
                  <span className="category-score">{match_details?.skillScore || 0}%</span>
                </div>

                <div className="score-category">
                  <span className="category-label">Interesa</span>
                  <div className="score-bar-container">
                    <div
                      className="score-bar"
                      style={{
                        width: `${match_details?.interestScore || 0}%`,
                        backgroundColor: getScoreColor(match_details?.interestScore || 0)
                      }}
                    ></div>
                  </div>
                  <span className="category-score">{match_details?.interestScore || 0}%</span>
                </div>

                <div className="score-category">
                  <span className="category-label">Disponueshmëri</span>
                  <div className="score-bar-container">
                    <div
                      className="score-bar"
                      style={{
                        width: `${match_details?.availabilityScore || 0}%`,
                        backgroundColor: getScoreColor(match_details?.availabilityScore || 0)
                      }}
                    ></div>
                  </div>
                  <span className="category-score">{match_details?.availabilityScore || 0}%</span>
                </div>

                <div className="score-category">
                  <span className="category-label">Vendndodhje</span>
                  <div className="score-bar-container">
                    <div
                      className="score-bar"
                      style={{
                        width: `${match_details?.locationScore || 0}%`,
                        backgroundColor: getScoreColor(match_details?.locationScore || 0)
                      }}
                    ></div>
                  </div>
                  <span className="category-score">{match_details?.locationScore || 0}%</span>
                </div>
              </div>

              {/* Matching interests */}
              {matching_interests && matching_interests.length > 0 && (
                <div className="additional-match-info">
                  <h5>Interesat e Përputhura</h5>
                  <div className="interest-tags">
                    {matching_interests.map((interest, index) => (
                      <span key={index} className="interest-tag">
                        <FaHeart style={{ fontSize: '0.8em' }} />
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing skills */}
              {match_details?.missingSkills && match_details.missingSkills.length > 0 && (
                <div className="additional-match-info missing-skills">
                  <h5>
                    <FaExclamationTriangle className="warning-icon" />
                    Aftësi të Kërkuara që Mungojnë
                  </h5>
                  <div className="missing-skill-tags">
                    {match_details.missingSkills.map((skill, index) => (
                      <span key={index} className="missing-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="match-card-actions">
          <button
            className="details-toggle-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <span>Më pak detaje</span>
                <FaChevronUp className="toggle-icon" />
              </>
            ) : (
              <>
                <span>Më shumë detaje</span>
                <FaChevronDown className="toggle-icon" />
              </>
            )}
          </button>

          <Link
            to={`/opportunities/${opportunity.id}`}
            className="view-opportunity-button"
          >
            Shiko Detajet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMatchCard;