import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaClock,
  FaUsers,
  FaTools,
  FaBuilding,
  FaSearch
} from 'react-icons/fa';
import { getAllOpportunities } from '../services/matchingService';
import '../App.css';

// Inline styles approach to avoid CSS conflicts
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.2rem',
    color: '#083081',
    marginBottom: '10px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#555',
  },
  searchBar: {
    display: 'flex',
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto 30px auto',
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#083081',
  },
  searchInput: {
    width: '100%',
    padding: '15px 15px 15px 45px',
    borderRadius: '30px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  },
  count: {
    margin: '20px 0',
    color: '#666',
    fontSize: '15px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: '1px solid #eee',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
  cardHeader: {
    padding: '20px',
    borderBottom: '1px solid #f0f0f0',
    background: 'linear-gradient(to right, #f0f4ff, #f8fbff)',
  },
  organization: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#666',
    fontSize: '14px',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#083081',
    margin: '0 0 5px 0',
    lineHeight: '1.4',
  },
  cardContent: {
    padding: '20px',
    flex: '1',
  },
  description: {
    color: '#555',
    marginBottom: '20px',
    lineHeight: '1.5',
    fontSize: '15px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
  icon: {
    color: '#083081',
    minWidth: '16px',
  },
  cardFooter: {
    padding: '15px 20px',
    borderTop: '1px solid #f0f0f0',
    background: '#fafafa',
  },
  button: {
    display: 'block',
    width: '100%',
    background: '#083081',
    color: 'white',
    textAlign: 'center',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 0',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '30px',
    color: '#d32f2f',
    background: '#fff8f8',
    borderRadius: '8px',
    margin: '30px auto',
    maxWidth: '600px',
  }
};

function OpportunityListPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCardId, setHoveredCardId] = useState(null);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        setLoading(true);
        // Use the existing service function to get all opportunities
        const data = await getAllOpportunities();
        setOpportunities(data);
        setFilteredOpportunities(data);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Gabim gjatë ngarkimit të të dhënave');
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOpportunities(opportunities);
    } else {
      const filtered = opportunities.filter(opp =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOpportunities(filtered);
    }
  }, [searchTerm, opportunities]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div style={styles.loading}>Duke ngarkuar mundësitë...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mundësitë e Vullnetarizmit</h1>
        <p style={styles.subtitle}>Gjeni mundësi vullnetarizmi që përshtaten me interesat tuaja</p>
      </div>

      <div style={styles.searchBar}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Kërko sipas titullit, organizatës, vendndodhjes..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.count}>
        Duke shfaqur <strong>{filteredOpportunities.length}</strong> mundësi
      </div>

      <div style={styles.grid}>
        {filteredOpportunities.map(opportunity => (
          <div
            key={opportunity.id}
            style={{
              ...styles.card,
              ...(hoveredCardId === opportunity.id ? styles.cardHover : {})
            }}
            onMouseEnter={() => setHoveredCardId(opportunity.id)}
            onMouseLeave={() => setHoveredCardId(null)}
          >
            <div style={styles.cardHeader}>
              <div style={styles.organization}>
                <FaBuilding style={styles.icon} />
                <span>{opportunity.organization}</span>
              </div>
              <h3 style={styles.cardTitle}>{opportunity.title}</h3>
            </div>

            <div style={styles.cardContent}>
              <p style={styles.description}>
                {opportunity.description && opportunity.description.length > 150
                  ? `${opportunity.description.substring(0, 150)}...`
                  : opportunity.description}
              </p>

              <div style={styles.details}>
                {opportunity.location && (
                  <div style={styles.detailItem}>
                    <FaMapMarkerAlt style={styles.icon} />
                    <span>{opportunity.location}</span>
                  </div>
                )}
                {opportunity.date && (
                  <div style={styles.detailItem}>
                    <FaRegCalendarAlt style={styles.icon} />
                    <span>{opportunity.date}</span>
                  </div>
                )}
                {opportunity.time_requirements && (
                  <div style={styles.detailItem}>
                    <FaClock style={styles.icon} />
                    <span>{opportunity.time_requirements}</span>
                  </div>
                )}
                {opportunity.skills_required && (
                  <div style={styles.detailItem}>
                    <FaTools style={styles.icon} />
                    <span>
                      {typeof opportunity.skills_required === 'string' && opportunity.skills_required.length > 30
                        ? opportunity.skills_required.substring(0, 30) + '...'
                        : opportunity.skills_required}
                    </span>
                  </div>
                )}
                {opportunity.spotsLeft != null && (
                  <div style={{...styles.detailItem, color: '#2e7d32', fontWeight: '500'}}>
                    <FaUsers style={{...styles.icon, color: '#2e7d32'}} />
                    <span>{opportunity.spotsLeft} vende të lira</span>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.cardFooter}>
              <Link
                to={`/opportunities/${opportunity.id}`}
                style={styles.button}
              >
                Shiko Detajet
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpportunityListPage;