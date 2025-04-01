import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMatches, getRecommendedOpportunities } from '../services/matchingService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTools } from 'react-icons/fa';
import '../App.css';

function MatchesPage() {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract username from email (before the @ symbol)
  const username = user?.email ? user.email.split('@')[0] : 'Vullnetar';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch both matches and recommendations in parallel
        const [matchesData, recommendationsData] = await Promise.all([
          getMatches(),
          getRecommendedOpportunities()
        ]);

        setMatches(matchesData);
        setRecommendedOpportunities(recommendationsData);
        setLoading(false);
      } catch (err) {
        setError('Gabim gjatë ngarkimit të të dhënave');
        console.error(err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="loading-container"><LoadingSpinner /></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="matches-page full-width">
      {/* Personalized greeting */}
      <section className="matches-banner full-width">
        <div className="matches-banner-container">
          <h1>Përshëndetje, {username}!</h1>
          <p>Këto janë mundësitë e përputhura me profilin tuaj</p>
        </div>
      </section>

      {/* Matches section */}
      <section className="matches-section">
        <div className="matches-container">
          <h2>Përputhjet Tuaja Personale</h2>

          {matches.length === 0 ? (
            <div className="no-matches">
              Nuk u gjetën përputhje. Plotësoni profilin tuaj për të marrë përputhje më të mira!
            </div>
          ) : (
            <div className="match-list">
              {matches.map(match => (
                <div key={match.opportunity.id} className="match-item">
                  <div className="match-score">
                    <div className="score-circle" style={{
                      background: `conic-gradient(#4CAF50 ${match.score}%, #f3f3f3 0)`
                    }}>
                      {match.score}%
                    </div>
                    <span>Përputhje</span>
                  </div>
                  <div className="match-opportunity">
                    <h3>{match.opportunity.title}</h3>
                    <p>{match.opportunity.description.substring(0, 150)}...</p>
                    <div className="opportunity-details">
                      <div className="opportunity-detail-tag">
                        <FaMapMarkerAlt /> {match.opportunity.location}
                      </div>
                      <div className="opportunity-detail-tag">
                        <FaCalendarAlt /> {match.opportunity.date}
                      </div>
                      <div className="opportunity-detail-tag">
                        <FaClock /> {match.opportunity.time_requirements}
                      </div>
                      <div className="opportunity-detail-tag">
                        <FaTools /> {match.opportunity.skills_required}
                      </div>
                    </div>
                    <Link to={`/opportunities/${match.opportunity.id}`} className="button secondary">
                      Shiko Detajet
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recommended opportunities section */}
      <section className="recommendations-section full-width">
        <div className="recommendations-container">
          <h2>Mundësi të Rekomanduara për Ju</h2>

          {recommendedOpportunities.length === 0 ? (
            <div className="no-recommendations">
              Nuk ka rekomandime të disponueshme aktualisht.
            </div>
          ) : (
            <div className="opportunities-grid">
              {recommendedOpportunities.map(opportunity => (
                <div key={opportunity.id} className="opportunity-card">
                  <h3>{opportunity.title}</h3>
                  <p>{opportunity.description.substring(0, 100)}...</p>
                  <div className="opportunity-details">
                    <div className="opportunity-detail-item">
                      <FaMapMarkerAlt className="detail-icon" /> {opportunity.location}
                    </div>
                    <div className="opportunity-detail-item">
                      <FaCalendarAlt className="detail-icon" /> {opportunity.date}
                    </div>
                  </div>
                  <Link to={`/opportunities/${opportunity.id}`} className="button secondary">
                    Shiko Detajet
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MatchesPage;