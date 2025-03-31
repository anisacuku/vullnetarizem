import React, { useState, useEffect } from 'react';
import { getMatches } from '../services/matchingService';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../App.css';

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        const matchData = await getMatches();
        setMatches(matchData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load matches');
        console.error(err);
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="matches-container">
      <h2>Your Personalized Matches</h2>
      <p>Based on your skills and interests, we've found these opportunities for you:</p>

      {matches.length === 0 ? (
        <div className="no-matches">
          No matches found yet. Complete your profile to get better matches!
        </div>
      ) : (
        <div className="match-list">
          {matches.map(match => (
            <div key={match.opportunity.id} className="match-item">
              <div className="match-score">
                <div className="score-circle" style={{
                  background: `conic-gradient(#4CAF50 ${match.score}%, #f3f3f3 0)`
                }}>
                  {Math.round(match.score)}%
                </div>
                <span>Match</span>
              </div>
              <OpportunityCard opportunity={match.opportunity} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchesPage;