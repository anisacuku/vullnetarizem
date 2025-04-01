import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import ScrollFadeIn from '../components/common/ScrollFadeIn';
import ProfileSetupForm from '../components/profile/ProfileSetupForm';
import RecommendedOpportunities from '../components/opportunities/RecommendedOpportunities';
import { findRecommendations } from '../services/profileMatchingService';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
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
            <section className="welcome-banner full-width">
              <div className="welcome-container">
                <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                  Mirësevini, {username}!
                </motion.h1>
                <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  Ju lutemi plotësoni profilin tuaj për të filluar.
                </motion.p>
              </div>
            </section>

            <section className="profile-setup-section">
              <div className="profile-setup-container">
                <h2>Plotësoni Profilin Tuaj</h2>
                <ProfileSetupForm onComplete={handleProfileComplete} userEmail={user.email} />
              </div>
            </section>
          </>
        ) : (
          <>
            {profileCompleted && (
              <motion.div className="profile-success-message" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <FaCheckCircle className="success-icon" />
                <p>Profili juaj u kompletua me sukses! Ja ku janë disa mundësi të rekomanduara për ju.</p>
              </motion.div>
            )}

            <section className="welcome-banner full-width">
              <div className="welcome-container">
                <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                  Mirësevini, {profileData?.name || username}!
                </motion.h1>
                <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  Faleminderit që jeni pjesë e platformës sonë të vullnetarizmit.
                </motion.p>
              </div>
            </section>

            <section className="recommendations-section full-width">
              <div className="recommendations-container">
                <h2>Mundësi të Rekomanduara për Ju</h2>
                <p className="recommendations-description">
                  Bazuar në profilin, aftësitë dhe interesat tuaja, ju kemi gjetur këto mundësi vullnetarizmi.
                </p>
                <RecommendedOpportunities recommendations={recommendations} />
                <div className="view-all-opportunities">
                  <Link to="/opportunities" className="view-all-button">
                    Shiko të Gjitha Mundësitë <FaArrowRight className="button-icon" />
                  </Link>
                </div>
              </div>
            </section>

            <section className="impact-section full-width">
              <div className="impact-container">
                <h2>Ndikimi Juaj</h2>
                <div className="impact-stats">
                  {[
                    { number: 0, label: 'Mundësi të Plotësuara' },
                    { number: 0, label: 'Orë Vullnetarizmi' },
                    { number: 0, label: 'Njerëz të Ndihmuar' },
                  ].map((item, idx) => (
                    <div className="impact-stat" key={idx}>
                      <div className="stat-number">{item.number}</div>
                      <div className="stat-label">{item.label}</div>
                    </div>
                  ))}
                </div>
                <p className="impact-message">Filloni vullnetarizmin për të parë ndikimin tuaj në rritje!</p>
              </div>
            </section>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div className="home-page full-width" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.section className="hero-section full-width" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
        <div className="hero-content">
          <h1>Sistemi Inteligjent i Vullnetarizmit</h1>
          <p>Gjej mundësinë perfekte të vullnetarizmit që përputhet me aftësitë dhe interesat e tua</p>
          <div className="cta-buttons">
            <Link to="/register" className="button primary">Nis Tani</Link>
            <Link to="/about" className="button secondary">Mëso Më Shumë</Link>
          </div>
        </div>
      </motion.section>

      <ScrollFadeIn>
        <section className="how-it-works full-width">
          <h2>Si Funksionon?</h2>
          <div className="steps-container">
            {["Krijo Profilin", "Merr Përputhje", "Fillo Vullnetarizmin"].map((title, idx) => (
              <ScrollFadeIn delay={idx * 0.2} key={idx}>
                <div className="step">
                  <div className="step-number">{idx + 1}</div>
                  <h3>{title}</h3>
                  <p>
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
        <section className="features-section full-width">
          <h2>Veçoritë Kryesore</h2>
          <div className="features-grid">
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
                desc: "Monitoro ndikimin që po bën në komunitetin tënd me mjetet tona të raportimit"
              },
              {
                title: "Ndërtimi i Komunitetit",
                desc: "Lidhu me vullnetarë dhe organizata të tjera që po ndryshojnë Shqipërinë"
              },
            ].map((feature, idx) => (
              <ScrollFadeIn delay={idx * 0.2} key={idx}>
                <div className="feature">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
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
