// src/pages/HomePage.js
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import ScrollFadeIn from '../components/common/ScrollFadeIn';
import ProfileSetupForm from '../components/profile/ProfileSetupForm';
import RecommendedOpportunities from '../components/opportunities/RecommendedOpportunities';
import { findRecommendations } from '../services/profileMatchingService';
import { FaArrowRight, FaCheckCircle, FaHandsHelping, FaUsers, FaHeart } from 'react-icons/fa';
import '../App.css';

function HomePage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const username = user?.email ? user.email.split('@')[0] : '';

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const profileKey = `user_profile_${user.email}`;
      const recKey = `user_recommendations_${user.email}`;
      const completedKey = `profile_completed_${user.email}`;

      const storedProfile = JSON.parse(localStorage.getItem(profileKey));
      const storedRecommendations = JSON.parse(localStorage.getItem(recKey));
      const completed = localStorage.getItem(completedKey) === 'true';

      setHasCompletedProfile(completed);
      setProfileData(storedProfile || null);

      if (storedRecommendations) {
        setRecommendations(storedRecommendations);
      } else if (storedProfile) {
        generateRecommendations(storedProfile);
      }
    }
  }, [isAuthenticated, user]);

  const generateRecommendations = async (profile) => {
    try {
      const recommendationsData = await findRecommendations(profile);
      setRecommendations(recommendationsData);
      localStorage.setItem(`user_recommendations_${user.email}`, JSON.stringify(recommendationsData));
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const handleProfileComplete = (formData, newRecommendations) => {
    setProfileData(formData);
    setHasCompletedProfile(true);
    if (newRecommendations) setRecommendations(newRecommendations);
    setProfileCompleted(true);
  };

  if (isAuthenticated) {
    return (
      <motion.div className="home-page full-width" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        {!hasCompletedProfile ? (
          <>
            <section className="welcome-banner full-width" style={{ textAlign: 'center' }}>
              <div className="welcome-container" style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
                >
                  Mirësevini, {username}!
                </motion.h1>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  style={{ fontSize: '1.2rem', lineHeight: '1.6' }}
                >
                  Ju lutemi plotësoni profilin tuaj për të filluar.
                </motion.p>
              </div>
            </section>

            <section className="profile-setup-section">
              <div className="profile-setup-container">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Plotësoni Profilin Tuaj</h2>
                <ProfileSetupForm onComplete={handleProfileComplete} userEmail={user.email} />
              </div>
            </section>
          </>
        ) : (
          <>
            {profileCompleted && (
              <motion.div
                className="profile-success-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '1.2rem' }}
              >
                <FaCheckCircle className="success-icon" />
                <p>Profili juaj u kompletua me sukses! Ja ku janë disa mundësi të rekomanduara për ju.</p>
              </motion.div>
            )}

            <section className="welcome-banner full-width">
              <div className="welcome-container" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '0 20px' }}>
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
                >
                  Mirësevini, {profileData?.name || username}!
                </motion.h1>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  style={{ fontSize: '1.2rem', lineHeight: '1.6' }}
                >
                  Faleminderit që jeni pjesë e platformës sonë të vullnetarizmit.
                </motion.p>
              </div>
            </section>

            <section className="recommendations-section full-width" style={{ padding: '3rem 1.5rem' }}>
              <div className="recommendations-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem', color: '#083081' }}>Mundësi të Rekomanduara për Ju</h2>
                <p className="recommendations-description" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', color: '#555' }}>
                  Bazuar në profilin, aftësitë dhe interesat tuaja, ju kemi gjetur këto mundësi vullnetarizmi.
                </p>
                <RecommendedOpportunities recommendations={recommendations} />
                <div className="view-all-opportunities" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <Link to="/opportunities" className="view-all-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#083081', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease' }}>
                    Shiko të Gjitha Mundësitë <FaArrowRight className="button-icon" />
                  </Link>
                </div>
              </div>
            </section>

            <section className="impact-section full-width" style={{ background: '#f5f8ff', padding: '4rem 1.5rem' }}>
              <div className="impact-container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ color: '#083081', marginBottom: '2.5rem', fontSize: '2rem' }}>Ndikimi Juaj</h2>
                <div className="impact-stats" style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem', flexWrap: 'wrap' }}>
                  {[
                    { number: 0, label: 'Mundësi të Plotësuara', icon: <FaHandsHelping /> },
                    { number: 0, label: 'Orë Vullnetarizmi', icon: <FaUsers /> },
                    { number: 0, label: 'Njerëz të Ndihmuar', icon: <FaHeart /> },
                  ].map((item, idx) => (
                    <div className="impact-stat" key={idx} style={{ flex: '1', minWidth: '210px', background: 'white', padding: '2rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                      <div style={{ fontSize: '2rem', color: '#083081', marginBottom: '10px' }}>{item.icon}</div>
                      <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#083081', marginBottom: '0.5rem' }}>{item.number}</div>
                      <div className="stat-label" style={{ color: '#555', fontSize: '1rem' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <p className="impact-message" style={{ color: '#555', fontStyle: 'italic', marginTop: '2rem', fontSize: '1.1rem' }}>
                  Filloni vullnetarizmin për të parë ndikimin tuaj në rritje!
                </p>
              </div>
            </section>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div className="home-page full-width" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.section
        className="hero-section full-width"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ padding: '5rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
      >
        <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.2rem', color: '#083081' }}>Sistemi Inteligjent i Vullnetarizmit</h1>
          <p style={{ fontSize: '1.5rem', color: '#555', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Gjej mundësinë perfekte të vullnetarizmit që përputhet me aftësitë dhe interesat e tua
          </p>
          <div className="cta-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '0 auto' }}>
            <Link to="/register" className="button primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Nis Tani</Link>
            <Link to="/about" className="button secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Mëso Më Shumë</Link>
          </div>
        </div>
      </motion.section>

      <ScrollFadeIn>
        <section className="how-it-works full-width" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#083081' }}>Si Funksionon?</h2>
          <div className="steps-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {["Krijo Profilin", "Merr Përputhje", "Fillo Vullnetarizmin"].map((title, idx) => (
              <ScrollFadeIn delay={idx * 0.2} key={idx}>
                <div className="step" style={{ background: '#f8f9fa', padding: '2.5rem', borderRadius: '16px', width: '300px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                  <div className="step-number" style={{ background: '#083081', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>{idx + 1}</div>
                  <h3 style={{ fontSize: '1.4rem', color: '#083081', marginBottom: '1rem' }}>{title}</h3>
                  <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
                    {idx === 0 && "Regjistrohu dhe na trego për aftësitë dhe interesat e tua."}
                    {idx === 1 && "AI jonë analizon profilin tënd dhe gjen mundësitë ideale për ty."}
                    {idx === 2 && "Apliko për mundësi dhe ndiko pozitivisht në komunitetin tënd."}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      </ScrollFadeIn>

      <ScrollFadeIn>
        <section className="features-section full-width" style={{ padding: '5rem 2rem', background: '#f5f8ff', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#083081' }}>Veçoritë Kryesore</h2>
          <div className="features-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {[
              {
                title: "Përputhje me AI",
                desc: "Algoritmet tona të avancuara të ndihmojnë të gjesh mundësi të përshtatshme për profilin tënd."
              },
              {
                title: "Njohja e Aftësive",
                desc: "Ne identifikojmë dhe përdorim aftësitë e tua për të gjetur vullnetarizmin më të përshtatshëm."
              },
              {
                title: "Ndjekja e Ndikimit",
                desc: "Monitoro ndikimin që po bën në komunitetin tënd me mjetet tona të raportimit."
              },
              {
                title: "Ndërtimi i Komunitetit",
                desc: "Lidhu me vullnetarë dhe organizata të tjera që po ndryshojnë Shqipërinë."
              },
            ].map((feature, idx) => (
              <ScrollFadeIn delay={idx * 0.2} key={idx}>
                <div className="feature" style={{
                  background: 'white',
                  padding: '2.5rem',
                  borderRadius: '16px',
                  width: '280px',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#083081', marginBottom: '1rem' }}>{feature.title}</h3>
                  <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>{feature.desc}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      </ScrollFadeIn>
    </motion.div>
  );
}

export default HomePage;