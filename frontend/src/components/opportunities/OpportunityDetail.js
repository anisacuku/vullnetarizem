import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaClock,
  FaTools,
  FaUsers
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // ✅ adjust path if needed
// import SuccessModal from '../../components/ui/SuccessModal';
import './OpportunityDetail.css';

function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/opportunities/${id}`)
      .then((res) => setOpportunity(res.data))
      .catch((err) => console.error('Error loading opportunity:', err));
  }, [id]);

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setShowModal(true);
    }
  };

  if (!opportunity) return <p style={{ padding: '40px' }}>Duke u ngarkuar...</p>;

  return (
    <div className="opportunity-detail">
      <h2>{opportunity.title}</h2>
      <p className="description">{opportunity.description}</p>

      <div className="detail-info">
        {opportunity.location && (
          <div className="info-tag">
            <FaMapMarkerAlt className="icon" />
            <span>{opportunity.location}</span>
          </div>
        )}
        {opportunity.date && (
          <div className="info-tag">
            <FaRegCalendarAlt className="icon" />
            <span>{opportunity.date}</span>
          </div>
        )}
        {opportunity.time_requirements && (
          <div className="info-tag">
            <FaClock className="icon" />
            <span>{opportunity.time_requirements}</span>
          </div>
        )}
        {opportunity.skills_required && (
          <div className="info-tag">
            <FaTools className="icon" />
            <span>{opportunity.skills_required}</span>
          </div>
        )}
        {opportunity.spotsLeft != null && (
          <div className="info-tag">
            <FaUsers className="icon" />
            <span>{opportunity.spotsLeft} vende të lira</span>
          </div>
        )}
      </div>

      <button className="apply-button" onClick={handleApplyClick}>
        Apliko Tani
      </button>

      <SuccessModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default OpportunityDetail;
