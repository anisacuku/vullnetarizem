import React, { useState, useEffect } from 'react';
import OpportunityCard from '../components/opportunities/OpportunityCard';

function OpportunityListPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOpportunities([
        {
          id: 1,
          title: 'Community Clean-up',
          description: 'Help clean up local parks and streets',
          organization: 'Green Albania'
        },
        {
          id: 2,
          title: 'Teaching Assistant',
          description: 'Help children with homework after school',
          organization: 'Education for All'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="loading">Loading opportunities...</div>;
  }

  return (
    <div className="opportunities-page">
      <div className="container">
        <h2>Volunteer Opportunities</h2>
        <div className="opportunities-list">
          {opportunities.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default OpportunityListPage;