import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getOpportunityById } from '../../services/matchingService';
import LoadingSpinner from '../common/LoadingSpinner';
import SuccessModal from '../ui/SuccesModal';
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaClock,
  FaTools,
  FaUsers,
  FaBriefcase,
  FaHeart,
  FaCheck
} from 'react-icons/fa';
import './OpportunityDetail.css';

function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        const data = await getOpportunityById(id);

        if (!data) {
          setError('Mundësia e kërkuar nuk u gjet');
        } else {
          setOpportunity(data);

          // Check if user has already applied
          if (isAuthenticated && user?.email) {
            const appliedOpportunities = JSON.parse(localStorage.getItem(`applied_${user.email}`) || '[]');
            setHasApplied(appliedOpportunities.includes(parseInt(id)));
          }
        }
      } catch (err) {
        setError('Gabim gjatë ngarkimit të të dhënave');
        console.error('Error loading opportunity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, isAuthenticated, user]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Save application in localStorage
    const appliedOpportunities = JSON.parse(localStorage.getItem(`applied_${user.email}`) || '[]');

    if (!appliedOpportunities.includes(parseInt(id))) {
      appliedOpportunities.push(parseInt(id));
      localStorage.setItem(`applied_${user.email}`, JSON.stringify(appliedOpportunities));
      setHasApplied(true);
    }

    setShowModal(true);
  };

  if (loading) return <div className="loading-container"><LoadingSpinner /></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!opportunity) return <div className="not-found">Mundësia nuk u gjet</div>;

  return (
    <div className="opportunity-detail">
      <h2>{opportunity.title}</h2>

      <div className="organization">
        <FaBriefcase className="organization-icon" />
        <span>Organizuar nga: <strong>{opportunity.organization}</strong></span>
      </div>

      <p className="description">{opportunity.description}</p>

      <div className="detail-info">
        <div className="info-tag">
          <FaMapMarkerAlt className="icon" />
          <span>{opportunity.location}</span>
        </div>

        <div className="info-tag">
          <FaRegCalendarAlt className="icon" />
          <span>{opportunity.date}</span>
        </div>

        <div className="info-tag">
          <FaClock className="icon" />
          <span>{opportunity.time_requirements}</span>
        </div>

        <div className="info-tag">
          <FaTools className="icon" />
          <span>{opportunity.skills_required}</span>
        </div>

        {opportunity.spotsLeft != null && (
          <div className="info-tag">
            <FaUsers className="icon" />
            <span>{opportunity.spotsLeft} vende të lira</span>
          </div>
        )}
      </div>

      <div className="skills-interests">
        <div className="required-skills">
          <h3>Aftësitë e Nevojshme</h3>
          <div className="skills-list">
            {opportunity.requiredSkills && opportunity.requiredSkills.map((skill, index) => (
              <div key={index} className="skill-tag">
                <FaCheck className="skill-icon" />
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="opportunity-interests">
          <h3>Interesat e Lidhura</h3>
          <div className="interests-list">
            {opportunity.interests && opportunity.interests.map((interest, index) => (
              <div key={index} className="interest-tag">
                <FaHeart className="interest-icon" />
                {interest}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className={`apply-button ${hasApplied ? 'already-applied' : ''}`}
          onClick={handleApplyClick}
          disabled={hasApplied}
        >
          {hasApplied ? 'Tashmë keni aplikuar' : 'Apliko Tani'}
        </button>

        <button className="back-button" onClick={() => navigate(-1)}>
          Kthehu
        </button>
      </div>

      <SuccessModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default OpportunityDetail;