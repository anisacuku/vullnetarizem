import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import ScrollFadeIn from '../components/common/ScrollFadeIn';
import ProfileSetupForm from '../components/profile/ProfileSetupForm';
import '../App.css';

function HomePage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(true);

  // Extract username from email (before the @ symbol)
  const username = user?.email ? user.email.split('@')[0] : '';

  // Check if user has completed profile
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, you would check if the user has completed their profile
      // For now, we'll simulate this with localStorage
      const profileCompleted = localStorage.getItem(`profile_completed_${user.email}`);
      setHasCompletedProfile(profileCompleted === 'true');
    }
  }, [isAuthenticated, user]);

  const handleProfileComplete = () => {
    // Mark profile as completed
    localStorage.setItem(`profile_completed_${user.email}`, 'true');
    setHasCompletedProfile(true);
  };

  // Render different content for logged-in vs. non-logged-in users
  if (isAuthenticated) {
    return (
      <motion.div
        className="home-page full-width"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Personalized greeting for logged-in users */}
        <section className="welcome-banner full-width">
          <div className="welcome-container">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Mirësevini, {username}!
            </motion.h1>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {hasCompletedProfile
                ? 'Faleminderit që jeni pjesë e platformës sonë të vullnetarizmit.'
                : 'Ju lutemi plotësoni profilin tuaj për të filluar.'}
            </motion.p>
          </div>
        </section>

        {/* First-time profile setup form */}
        {!hasCompletedProfile ? (
          <section className="profile-setup-section">
            <div className="profile-setup-container">
              <h2>Plotësoni Profilin Tuaj</h2>
              <ProfileSetupForm onComplete={handleProfileComplete} userEmail={user.email} />
            </div>
          </section>
        ) : (
          // Content for users who have already completed their profile
          <>
            {/* Recommended opportunities section */}
            <section className="recommendations-section full-width">
              <div className="recommendations-container">
                <h2>Mundësi të Rekomanduara për Ju</h2>
                <div className="opportunities-grid">
                  {/* Example opportunities - in a real app, these would be personalized */}
                  <div className="opportunity-card">
                    <h3>Pastrim i Parkut</h3>
                    <p>Ndihmoni në pastrimin e parqeve lokale.</p>
                    <Link to="/opportunities/1" className="button secondary">Shiko Detajet</Link>
                  </div>
                  <div className="opportunity-card">
                    <h3>Mentor për Fëmijë</h3>
                    <p>Ndihmoni fëmijët me detyrat e shtëpisë.</p>
                    <Link to="/opportunities/2" className="button secondary">Shiko Detajet</Link>
                  </div>
                  <div className="opportunity-card">
                    <h3>Ndihmë për të Moshuarit</h3>
                    <p>Ofroni shoqëri dhe ndihmë për të moshuarit.</p>
                    <Link to="/opportunities/3" className="button secondary">Shiko Detajet</Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent activities section */}
            <section className="activities-section full-width">
              <div className="activities-container">
                <h2>Aktivitetet e Fundit</h2>
                <div className="activities-list">
                  <div className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-info">
                      <h3>Profili përditësuar</h3>
                      <p>Ju keni përditësuar profilin tuaj para 2 ditësh</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">🔍</div>
                    <div className="activity-info">
                      <h3>Kërkime të reja</h3>
                      <p>Ju keni kërkuar për mundësi në fushën e mjedisit</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </motion.div>
    );
  }

  // Default homepage for non-logged-in users
  return (
    <motion.div
      className="home-page full-width"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <motion.section
        className="hero-section full-width"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <h1>Sistemi Inteligjent i Vullnetarizmit</h1>
          <p>Gjej mundësinë perfekte të vullnetarizmit që përputhet me aftësitë dhe interesat e tua</p>
          <div className="cta-buttons">
            <Link to="/register" className="button primary">Nis Tani</Link>
            <Link to="/about" className="button secondary">Mëso Më Shumë</Link>
          </div>
        </div>
      </motion.section>

      {/* Si Funksionon */}
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

      {/* Veçoritë */}
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