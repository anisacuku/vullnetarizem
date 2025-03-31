import React, { useEffect, useState } from 'react';
import OpportunityCard from './OpportunityCard';
import './OpportunityList.css';

function OpportunityListPage() {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    // Simulate loading delay or fetch
    setTimeout(() => {
      setOpportunities([
        {
          id: 1,
          title: 'Community Clean-up',
          organization: 'Green Albania',
          description: 'Help clean up local parks and streets',
          location: 'Tirana',
          date: 'April 15, 2025',
          type: 'Environment',
          spotsLeft: 5,
          skills: ['Teamwork', 'Responsibility']
        },
        {
          id: 2,
          title: 'Tech Workshop Mentor',
          organization: 'Code4Youth',
          description: 'Mentor teens in web development',
          location: 'Durres',
          date: 'May 1, 2025',
          type: 'Education',
          spotsLeft: 3,
          skills: ['JavaScript', 'Mentorship']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="opportunity-page container">
      <h2>Volunteer Opportunities</h2>
      <div className="opportunity-grid">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div className="opportunity-card skeleton" key={i}></div>
              ))
          : opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
      </div>
    </div>
  );
}

export default OpportunityListPage;
