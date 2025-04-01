import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheck,
  FaStar,
  FaChevronRight,
} from 'react-icons/fa';
import './RecommendedOpportunities.css';

/**
 * Component to display personalized opportunity recommendations
 * @param {Array} recommendations - Array of recommended opportunities with match scores
 */
function RecommendedOpportunities({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="no-recommendations">
        <p>
          Nuk u gjetën mundësi të përputhshme. Ju lutemi provoni të
          përditësoni profilin tuaj me më shumë aftësi dhe interesa.
        </p>
      </div>
    );
  }

  return (
    <div className="recommendations-grid">
      {recommendations.map((recommendation) => (
        <div
          className="recommendation-card"
          key={recommendation.opportunity.id}
        >
          <div>
            <div className="recommendation-badge">
              <FaStar className="star-icon" />
              <span>{recommendation.score}% përputhje</span>
            </div>

            <h3 className="recommendation-title">
              {recommendation.opportunity.title}
            </h3>
            <p className="recommendation-organization">
              {recommendation.opportunity.organization}
            </p>

            <p className="recommendation-description">
              {recommendation.opportunity.description.length > 150
                ? `${recommendation.opportunity.description.substring(
                    0,
                    150
                  )}...`
                : recommendation.opportunity.description}
            </p>

            <div className="recommendation-details">
              <div className="recommendation-detail">
                <FaMapMarkerAlt className="detail-icon" />
                <span>{recommendation.opportunity.location}</span>
              </div>

              <div className="recommendation-detail">
                <FaCalendarAlt className="detail-icon" />
                <span>{recommendation.opportunity.date}</span>
              </div>
            </div>

            {recommendation.matched_skills &&
              recommendation.matched_skills.length > 0 && (
                <div className="match-highlights">
                  <div className="matches-title">
                    <FaCheck className="check-icon" />
                    Aftësi të përputhura:
                  </div>
                  <div className="match-tags">
                    {recommendation.matched_skills
                      .slice(0, 3)
                      .map((skill, index) => (
                        <span
                          className="match-tag skill-match"
                          key={index}
                        >
                          {skill}
                        </span>
                      ))}
                    {recommendation.matched_skills.length > 3 && (
                      <span className="more-tag">
                        +{recommendation.matched_skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

            {recommendation.matching_interests &&
              recommendation.matching_interests.length > 0 && (
                <div className="match-highlights">
                  <div className="matches-title">
                    <FaCheck className="check-icon" />
                    Interesa të përbashkëta:
                  </div>
                  <div className="match-tags">
                    {recommendation.matching_interests
                      .slice(0, 3)
                      .map((interest, index) => (
                        <span
                          className="match-tag interest-match"
                          key={index}
                        >
                          {interest}
                        </span>
                      ))}
                    {recommendation.matching_interests.length > 3 && (
                      <span className="more-tag">
                        +{recommendation.matching_interests.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
          </div>

          <div className="recommendation-actions">
            <Link
              to={`/opportunities/${recommendation.opportunity.id}`}
              className="view-opportunity-button"
            >
              <span>Shiko Detajet</span>
              <FaChevronRight className="button-icon" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecommendedOpportunities;
