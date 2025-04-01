import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaUserCircle,
  FaClipboardCheck,
  FaCalendarAlt,
  FaUserEdit,
} from 'react-icons/fa';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import '../App.css';

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('Mirësevini');
  const [username, setUsername] = useState('');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [stats, setStats] = useState({
    matchedOpportunities: 0,
    appliedOpportunities: [],
    upcomingActivities: [],
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Mirëmëngjes');
    else if (hour < 18) setGreeting('Mirëdita');
    else setGreeting('Mirëmbrëma');

    if (user && user.email) {
      const extractedName = user.email.split('@')[0];
      setUsername(extractedName);

      try {
        const savedProfile = localStorage.getItem(`user_profile_${user.email}`);
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile));
        }

        const recommendationsData = localStorage.getItem(`user_recommendations_${user.email}`);
        let matchCount = 0;
        if (recommendationsData) {
          matchCount = JSON.parse(recommendationsData).length;
        }

        const appliedOpps = JSON.parse(localStorage.getItem(`applied_${user.email}`) || '[]');

        const getOpportunityDetails = async (id) => {
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

          const upcoming = appliedDetails.map(opp => ({
            ...opp,
            type: 'applied',
            date: new Date(opp.date.split(',')[0])
          }));

          setStats({
            matchedOpportunities: matchCount,
            appliedOpportunities: appliedDetails,
            upcomingActivities: upcoming,
          });
        };

        fetchAppliedDetails();

      } catch (error) {
        console.error('Error loading profile or activity data:', error);
      }
    }
  }, [user]);

  const handleProfileUpdate = (updatedProfile) => {
    localStorage.setItem(`user_profile_${user?.email}`, JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
    setShowProfileEdit(false);
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
              {/* Matched Opportunities */}
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

              {/* Upcoming Activities */}
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
            </div>

            {/* Applied Opportunities */}
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
