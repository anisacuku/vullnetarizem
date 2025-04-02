import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { findRecommendations } from '../services/profileMatchingService';
import MatchCard from '../components/matching/MatchCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../App.css';

function MatchesPage() {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const username = user?.email ? user.email.split('@')[0] : 'Përdorues';

  useEffect(() => {
    if (user?.email) {
      const profileKey = `user_profile_${user.email}`;
      const matchesKey = `user_matches_${user.email}`;

      const storedProfile = localStorage.getItem(profileKey);
      const storedMatches = localStorage.getItem(matchesKey);

      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfileData(parsedProfile);

        if (storedMatches) {
          setMatches(JSON.parse(storedMatches));
          setLoading(false);
        } else {
          generateMatches(parsedProfile, matchesKey);
        }
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const generateMatches = async (profile, cacheKey) => {
    try {
      const matchResults = await findRecommendations(profile);
      setMatches(matchResults);
      localStorage.setItem(cacheKey, JSON.stringify(matchResults));
    } catch (error) {
      console.error('Gabim gjatë gjenerimit të përputhjeve:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="matches-page full-width">
      <section className="matches-banner full-width">
        <div className="matches-banner-container">
          <h1 className="matches-header">Përshëndetje, {profileData?.name || username}!</h1>
          <p className="matches-subtitle">Ne kemi gjetur disa mundësi që mund të përputhen me interesat dhe aftësitë tuaja. Shihni më poshtë!</p>
        </div>
      </section>

      <section className="matches-section full-width">
        <div className="matches-container">
          <h2 className="opportunities-header">Përputhjet Tuaja</h2>

          {loading ? (
            <div className="loading-center">
              <LoadingSpinner />
            </div>
          ) : matches.length === 0 ? (
            <div className="no-results">
              <p>Aktualisht nuk ka përputhje. Ju lutemi përditësoni profilin tuaj për mundësi më të mira.</p>
            </div>
          ) : (
            <div className="opportunities-grid">
              {matches.map((match) => (
                <MatchCard key={match.opportunity.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MatchesPage;
