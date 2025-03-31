import React from 'react';
import { Link } from 'react-router-dom';
import './OpportunityCard.css';
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaTools,
  FaRegCalendarAlt,
  FaRegClock
} from 'react-icons/fa';

function OpportunityCard({ opportunity }) {
  if (!opportunity) return null;

  return (
    <div className="opportunity-card">
      <h3 className="opportunity-title">{opportunity.title}</h3>

      <p className="opportunity-description">{opportunity.description}</p>

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
            <FaRegClock className="tag-icon" />
            {opportunity.time_requirements}
          </div>
        )}
        {opportunity.skills_required && (
          <div className="tag skills-tag">
            <FaTools className="tag-icon" />
            {opportunity.skills_required}
          </div>
        )}
        {opportunity.spotsLeft != null && (
          <div className="tag">
            <FaUsers className="tag-icon" />
            {opportunity.spotsLeft} vende të lira
          </div>
        )}
      </div>

      <Link to={`/opportunities/${opportunity.id}`} className="button secondary view-details-button">
        Shiko Detajet
      </Link>
    </div>
  );
}

export default OpportunityCard;
