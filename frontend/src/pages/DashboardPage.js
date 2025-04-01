import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaUserCircle,
  FaClipboardCheck,
  FaCalendarAlt,
  FaBell,
  FaUserEdit,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle
} from 'react-icons/fa';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import '../App.css';

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('Mirësevini');
  const [username, setUsername] = useState('');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // User activity statistics
  const [stats, setStats] = useState({
    matchedOpportunities: 0,
    appliedOpportunities: [],
    upcomingActivities: [],
    notifications: []
  });

  useEffect(() => {
    // Set appropriate greeting based on time of day
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting('Mirëmëngjes');
    } else if (hour < 18) {
      setGreeting('Mirëdita');
    } else {
      setGreeting('Mirëmbrëma');
    }

    // Extract username from user data if it exists
    if (user && user.email) {
      const extractedName = user.email.split('@')[0];
      setUsername(extractedName);

      // Load user profile from localStorage
      try {
        const savedProfile = localStorage.getItem(`user_profile_${user.email}`);
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile));
        }

        // Get actual matched opportunities
        const recommendationsData = localStorage.getItem(`user_recommendations_${user.email}`);
        let matchCount = 0;
        if (recommendationsData) {
          matchCount = JSON.parse(recommendationsData).length;
        }

        // Get applied opportunities
        const appliedOpps = JSON.parse(localStorage.getItem(`applied_${user.email}`) || '[]');

        // Map opportunity IDs to actual data (we'd fetch this from a service in a real app)
        const getOpportunityDetails = async (id) => {
          // For demonstration purposes, we're creating some fake data
          // In a real application, you would fetch this from your API
          return {
            id,
            title: id === 1 ? "Community Clean-up" : "Teaching Assistant",
            organization: id === 1 ? "Green Albania" : "Fondacioni Arsimor i Shqipërisë",
            date: id === 1 ? "15 Maj, 2025" : "1 Qershor - 31 Gusht, 2025"
          };
        };

        const fetchAppliedDetails = async () => {
          const appliedDetails = await Promise.all(
            appliedOpps.map(id => getOpportunityDetails(id))
          );

          // Create upcoming activities from applied opportunities
          const upcoming = appliedDetails.map(opp => ({
            ...opp,
            type: 'applied',
            date: new Date(opp.date.split(',')[0])
          }));

          // Create recent activity notifications
          const notifications = [
            {
              id: 1,
              type: 'application',
              message: `Aplikimi juaj për "${appliedDetails[0]?.title || 'Community Clean-up'}" u pranua!`,
              date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) // yesterday
            },
            {
              id: 2,
              type: 'profile',
              message: 'Profili juaj u përditësua me sukses',
              date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            },
            {
              id: 3,
              type: 'match',
              message: 'Kemi gjetur 3 mundësi të reja që përputhen me profilin tuaj',
              date: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            }
          ];

          setStats({
            matchedOpportunities: matchCount,
            appliedOpportunities: appliedDetails,
            upcomingActivities: upcoming,
            notifications
          });
        };

        fetchAppliedDetails();

      } catch (error) {
        console.error('Error loading profile or activity data:', error);
      }
    }
  }, [user]);

  const handleProfileUpdate = (updatedProfile) => {
    // Save updated profile to localStorage
    localStorage.setItem(`user_profile_${user?.email}`, JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
    setShowProfileEdit(false);

    // Add profile update to notifications
    setStats(prev => ({
      ...prev,
      notifications: [
        {
          id: Date.now(),
          type: 'profile',
          message: 'Profili juaj u përditësua me sukses',
          date: new Date()
        },
        ...prev.notifications
      ]
    }));
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';

    if (typeof date === 'string') {
      return date;
    }

    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Sot';
    if (diff === 1) return 'Dje';
    if (diff < 7) return `${diff} ditë më parë`;

    return date.toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (date) => {
    if (!date) return '';

    return date.toLocaleTimeString('sq-AL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      {!showProfileEdit ? (
        <>
          <div className="dashboard-header">
            <div className="welcome-section">
              <div className="user-avatar">
                <FaUserCircle size={60} color="#083081" />
              </div>
              <div className="welcome-text">
                <h2>{greeting}, {userProfile?.name || username}!</h2>
                <p>Mirësevini në panelin tuaj personal.</p>
              </div>
              <button
                className="edit-profile-button"
                onClick={() => setShowProfileEdit(true)}
              >
                <FaUserEdit /> Përditëso Profilin
              </button>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="card-icon">
                  <FaClipboardCheck />
                </div>
                <div className="card-content">
                  <h3>Mundësitë e Përputhura</h3>
                  <p>{stats.matchedOpportunities} mundësi që përputhen me profilin tuaj</p>
                  <Link to="/matches" className="card-button">Shiko përputhjet</Link>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <FaCalendarAlt />
                </div>
                <div className="card-content">
                  <h3>Aktivitetet e Ardhshme</h3>
                  <p>Ju keni {stats.upcomingActivities.length} aktivitete të planifikuara</p>
                  <button className="card-button">Shiko kalendarin</button>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <FaBell />
                </div>
                <div className="card-content">
                  <h3>Njoftimet</h3>
                  <p>{stats.notifications.length} njoftime të reja</p>
                  <button className="card-button">Shiko të gjitha</button>
                </div>
              </div>
            </div>

            <div className="dashboard-activity">
              <h3>Aktiviteti i Fundit</h3>
              {stats.notifications.length > 0 ? (
                <div className="activity-list">
                  {stats.notifications.map(notification => (
                    <div className="activity-item" key={notification.id}>
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        <p>
                          {notification.type === 'application' && <FaCheckCircle style={{ color: '#4CAF50', marginRight: '8px' }} />}
                          {notification.type === 'profile' && <FaUserEdit style={{ color: '#2196F3', marginRight: '8px' }} />}
                          {notification.type === 'match' && <FaClipboardCheck style={{ color: '#FF9800', marginRight: '8px' }} />}
                          {notification.message}
                        </p>
                        <span className="activity-time">{formatDate(notification.date)}, {formatTime(notification.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-activity">
                  <FaExclamationCircle style={{ fontSize: '24px', color: '#999', marginBottom: '10px' }} />
                  <p>Nuk keni aktivitete të fundit.</p>
                </div>
              )}
            </div>

            {stats.appliedOpportunities.length > 0 && (
              <div className="dashboard-applications">
                <h3>Aplikime të Bëra</h3>
                <div className="applications-list">
                  {stats.appliedOpportunities.map(application => (
                    <div className="application-item" key={application.id}>
                      <div className="application-info">
                        <h4>{application.title}</h4>
                        <p>{application.organization}</p>
                        <div className="application-date">
                          <FaCalendarAlt style={{ marginRight: '5px' }} />
                          {application.date}
                        </div>
                      </div>
                      <div className="application-status">
                        <span className="status-badge">Pranuar</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="profile-edit-container">
          <h2>Përditëso Profilin Tuaj</h2>
          <ProfileEditForm
            initialData={userProfile}
            userEmail={user?.email}
            onComplete={handleProfileUpdate}
            onCancel={() => setShowProfileEdit(false)}
          />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;