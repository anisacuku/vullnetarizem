import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaClipboardCheck, FaCalendarAlt, FaBell, FaUserEdit } from 'react-icons/fa';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import '../App.css';

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('Mirësevini');
  const [username, setUsername] = useState('Vullnetar');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

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
    }

    // Load user profile from localStorage
    try {
      const savedProfile = localStorage.getItem(`user_profile_${user?.email}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [user]);

  const handleProfileUpdate = (updatedProfile) => {
    // Save updated profile to localStorage
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
                <h2>{greeting}, {username}!</h2>
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
                  <h3>Mundësitë e Përshtatshme</h3>
                  <p>5 mundësi të reja që përputhen me profilin tuaj</p>
                  <button className="card-button">Shiko tani</button>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <FaCalendarAlt />
                </div>
                <div className="card-content">
                  <h3>Aktivitetet e Ardhshme</h3>
                  <p>Ju keni 2 aktivitete të planifikuara këtë javë</p>
                  <button className="card-button">Shiko kalendarin</button>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-icon">
                  <FaBell />
                </div>
                <div className="card-content">
                  <h3>Njoftimet</h3>
                  <p>3 njoftime të reja që kërkojnë vëmendjen tuaj</p>
                  <button className="card-button">Shiko të gjitha</button>
                </div>
              </div>
            </div>

            <div className="dashboard-activity">
              <h3>Aktiviteti i Fundit</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p><strong>Aplikimi i pranuar</strong> - Community Clean-up</p>
                    <span className="activity-time">Sot, 14:30</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p><strong>Profili përditësuar</strong> - Shtuat aftësi të reja</p>
                    <span className="activity-time">Dje, 10:15</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p><strong>Aplikuat</strong> për mundësinë "Teaching Assistant"</p>
                    <span className="activity-time">2 ditë më parë</span>
                  </div>
                </div>
              </div>
            </div>
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