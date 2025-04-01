import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaTools,
  FaRegCalendarAlt,
  FaBuilding
} from 'react-icons/fa';

function OpportunityCard({ opportunity }) {
  if (!opportunity) return null;

  // Truncate description
  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="opportunity-card">
      <div className="card-header">
        <h3 className="opportunity-title">{opportunity.title}</h3>
        <div className="organization-name">
          <FaBuilding />
          <span>{opportunity.organization}</span>
        </div>
      </div>

      <div className="card-body">
        <p className="opportunity-description">
          {truncateDescription(opportunity.description)}
        </p>

        <div className="opportunity-tags">
          {opportunity.location && (
            <div className="tag">
              <FaMapMarkerAlt className="tag-icon" />
              {opportunity.location}
            </div>
          )}
          {opportunity.date && (
            <div className="tag">
              <FaRegCalendarAlt className="tag-icon" />
              {opportunity.date}
            </div>
          )}
          {opportunity.time_requirements && (
            <div className="tag">
              <FaClock className="tag-icon" />
              {opportunity.time_requirements}
            </div>
          )}
          {opportunity.skills_required && (
            <div className="tag">
              <FaTools className="tag-icon" />
              {typeof opportunity.skills_required === 'string' && opportunity.skills_required.length > 20
                ? opportunity.skills_required.substring(0, 20) + '...'
                : opportunity.skills_required}
            </div>
          )}
          {opportunity.spotsLeft != null && (
            <div className="tag">
              <FaUsers className="tag-icon" />
              {opportunity.spotsLeft} vende të lira
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <Link
          to={`/opportunities/${opportunity.id}`}
          className="view-details-button"
        >
          Shiko Detajet
        </Link>
      </div>
    </div>
  );
}

export default OpportunityCard;