// src/pages/HomePage.js
import React, { useState, useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import ScrollFadeIn from "../components/common/ScrollFadeIn";
import ProfileSetupForm from "../components/profile/ProfileSetupForm";
import RecommendedOpportunities from "../components/opportunities/RecommendedOpportunities";
import { findRecommendations } from "../services/profileMatchingService";
import {
  FaArrowRight,
  FaCheckCircle,
  FaHandsHelping,
  FaUsers,
  FaHeart,
} from "react-icons/fa";
import "../App.css";

function HomePage() {
  const { user, isAuthenticated } = useContext(AuthContext);

  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const username = user?.email ? user.email.split("@")[0] : "";

  const styles = useMemo(() => {
    const primary = "#083081";
    const ink = "#0a2a43";
    const muted = "#555";
    const softBg = "#f5f8ff";

    return {
      page: {
        width: "100%",
      },

      // Common containers
      container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
      },

      // Buttons
      btnRow: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap",
      },
      btnPrimary: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: primary,
        color: "white",
        padding: "12px 24px",
        borderRadius: 12,
        textDecoration: "none",
        fontWeight: 700,
        boxShadow: "0 12px 28px rgba(8,48,129,0.22)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      },
      btnSecondary: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: "transparent",
        color: primary,
        padding: "12px 24px",
        borderRadius: 12,
        textDecoration: "none",
        fontWeight: 700,
        border: `2px solid ${primary}`,
        transition: "transform 0.2s ease",
      },

      // Headings
      h1: {
        fontSize: "3.6rem",
        marginBottom: "1.2rem",
        color: primary,
        lineHeight: 1.08,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontSize: "2.5rem",
        marginBottom: "3rem",
        color: primary,
        letterSpacing: "-0.02em",
      },
      pLead: {
        fontSize: "1.45rem",
        color: muted,
        marginBottom: "2.5rem",
        lineHeight: 1.65,
      },

      // Premium Hero (public)
      hero: {
        padding: "6rem 2rem",
        textAlign: "center",
        background:
          "radial-gradient(1100px 420px at 50% 0%, rgba(8,48,129,0.13), transparent 60%)",
      },
      heroCard: {
        maxWidth: "860px",
        margin: "0 auto",
      },
      pill: {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        borderRadius: 999,
        background: "rgba(8,48,129,0.08)",
        color: primary,
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        marginBottom: "18px",
      },
      heroStats: {
        marginTop: "3rem",
        display: "flex",
        justifyContent: "center",
        gap: "2.5rem",
        flexWrap: "wrap",
      },
      heroStat: {
        minWidth: 180,
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: "14px 16px",
      },
      heroStatVal: {
        fontSize: "1.55rem",
        fontWeight: 900,
        color: ink,
      },
      heroStatLbl: {
        marginTop: 6,
        color: "rgba(10,42,67,0.65)",
        fontSize: 13,
      },

      // Sections
      section: {
        padding: "5rem 2rem",
        textAlign: "center",
      },
      sectionAlt: {
        padding: "5rem 2rem",
        background: softBg,
        textAlign: "center",
      },

      // Cards grid
      grid: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2.2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      },
      card: {
        background: "white",
        padding: "2.2rem 2rem",
        borderRadius: 16,
        width: 300,
        boxShadow: "0 10px 28px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      },
      cardNumber: {
        background: primary,
        color: "white",
        width: 52,
        height: 52,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1.4rem",
        fontWeight: 900,
        fontSize: "1.4rem",
      },
      cardTitle: {
        fontSize: "1.35rem",
        color: primary,
        marginBottom: "0.8rem",
        fontWeight: 900,
      },
      cardText: {
        fontSize: "1rem",
        color: muted,
        lineHeight: 1.65,
        margin: 0,
      },

      // Auth banners
      welcome: {
        padding: "4rem 1.5rem",
        textAlign: "center",
        background:
          "radial-gradient(900px 360px at 50% 0%, rgba(8,48,129,0.10), transparent 60%)",
      },
      welcomeBox: {
        maxWidth: 750,
        margin: "0 auto",
        padding: "0 20px",
      },

      // Recommendations section
      recSection: {
        padding: "3rem 1.5rem",
      },

      // Success message
      success: {
        textAlign: "center",
        padding: "1.1rem 1.2rem",
        background: "rgba(46, 125, 50, 0.08)",
        border: "1px solid rgba(46, 125, 50, 0.18)",
        color: "#1b5e20",
        borderRadius: 14,
        maxWidth: 900,
        margin: "18px auto 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      },
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const profileKey = `user_profile_${user.email}`;
      const recKey = `user_recommendations_${user.email}`;
      const completedKey = `profile_completed_${user.email}`;

      const storedProfile = JSON.parse(localStorage.getItem(profileKey));
      const storedRecommendations = JSON.parse(localStorage.getItem(recKey));
      const completed = localStorage.getItem(completedKey) === "true";

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
      localStorage.setItem(
        `user_recommendations_${user.email}`,
        JSON.stringify(recommendationsData)
      );
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
  };

  const handleProfileComplete = (formData, newRecommendations) => {
    setProfileData(formData);
    setHasCompletedProfile(true);
    if (newRecommendations) setRecommendations(newRecommendations);
    setProfileCompleted(true);
  };

  // =========================
  // AUTHENTICATED VIEW
  // =========================
  if (isAuthenticated) {
    return (
      <motion.div
        className="home-page full-width"
        style={styles.page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {!hasCompletedProfile ? (
          <>
            <section className="welcome-banner full-width" style={styles.welcome}>
              <div style={styles.welcomeBox}>
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ ...styles.h2, marginBottom: "0.8rem" }}
                >
                  Mirësevini, {username}!
                </motion.h1>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  style={{ fontSize: "1.15rem", lineHeight: "1.7", color: "#555" }}
                >
                  Ju lutemi plotësoni profilin tuaj për të filluar.
                </motion.p>
              </div>
            </section>

            <section className="profile-setup-section" style={{ padding: "3.2rem 1.5rem" }}>
              <div style={{ ...styles.container, maxWidth: 900 }}>
                <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#083081" }}>
                  Plotësoni Profilin Tuaj
                </h2>
                <ProfileSetupForm onComplete={handleProfileComplete} userEmail={user.email} />
              </div>
            </section>
          </>
        ) : (
          <>
            {profileCompleted && (
              <motion.div
                className="profile-success-message"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={styles.success}
              >
                <FaCheckCircle />
                <span>Profili juaj u kompletua me sukses! Ja ku janë disa mundësi të rekomanduara për ju.</span>
              </motion.div>
            )}

            <section className="welcome-banner full-width" style={styles.welcome}>
              <div style={styles.welcomeBox}>
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ ...styles.h2, marginBottom: "0.9rem" }}
                >
                  Mirësevini, {profileData?.name || username}!
                </motion.h1>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  style={{ fontSize: "1.15rem", lineHeight: "1.7", color: "#555" }}
                >
                  Faleminderit që jeni pjesë e platformës sonë të vullnetarizmit.
                </motion.p>
              </div>
            </section>

            <section className="recommendations-section full-width" style={styles.recSection}>
              <div style={styles.container}>
                <h2 style={{ textAlign: "center", marginBottom: "1.1rem", fontSize: "2rem", color: "#083081" }}>
                  Mundësi të Rekomanduara për Ju
                </h2>
                <p
                  className="recommendations-description"
                  style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 2rem", color: "#555", lineHeight: 1.7 }}
                >
                  Bazuar në profilin, aftësitë dhe interesat tuaja, ju kemi gjetur këto mundësi vullnetarizmi.
                </p>

                <RecommendedOpportunities recommendations={recommendations} />

                <div className="view-all-opportunities" style={{ textAlign: "center", marginTop: "2.5rem" }}>
                  <Link to="/opportunities" style={styles.btnPrimary}>
                    Shiko të Gjitha Mundësitë <FaArrowRight className="button-icon" />
                  </Link>
                </div>
              </div>
            </section>

            <section className="impact-section full-width" style={{ ...styles.sectionAlt, padding: "4.5rem 1.5rem" }}>
              <div style={{ ...styles.container, maxWidth: 900 }}>
                <h2 style={{ color: "#083081", marginBottom: "2.2rem", fontSize: "2rem" }}>
                  Ndikimi Juaj
                </h2>

                <div
                  className="impact-stats"
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    gap: "1.6rem",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { number: 0, label: "Mundësi të Plotësuara", icon: <FaHandsHelping /> },
                    { number: 0, label: "Orë Vullnetarizmi", icon: <FaUsers /> },
                    { number: 0, label: "Njerëz të Ndihmuar", icon: <FaHeart /> },
                  ].map((item, idx) => (
                    <div
                      className="impact-stat"
                      key={idx}
                      style={{
                        flex: "1",
                        minWidth: "220px",
                        background: "white",
                        padding: "2rem 1.6rem",
                        borderRadius: "16px",
                        boxShadow: "0 10px 28px rgba(0, 0, 0, 0.06)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <div style={{ fontSize: "2rem", color: "#083081", marginBottom: 10 }}>
                        {item.icon}
                      </div>
                      <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "#083081", marginBottom: "0.4rem" }}>
                        {item.number}
                      </div>
                      <div style={{ color: "#555", fontSize: "1rem" }}>{item.label}</div>
                    </div>
                  ))}
                </div>

                <p style={{ color: "#555", fontStyle: "italic", marginTop: "2rem", fontSize: "1.05rem" }}>
                  Filloni vullnetarizmin për të parë ndikimin tuaj në rritje!
                </p>
              </div>
            </section>
          </>
        )}
      </motion.div>
    );
  }

  // =========================
  // PUBLIC LANDING VIEW
  // =========================
  return (
    <motion.div
      className="home-page full-width"
      style={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* HERO */}
      <motion.section
        className="hero-section full-width"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={styles.hero}
      >
        <div style={styles.heroCard}>
          <div style={styles.pill}>AI Powered Volunteer Matching</div>

          <h1 style={styles.h1}>Sistemi Inteligjent i Vullnetarizmit</h1>

          <p style={styles.pLead}>
            Gjej mundësinë perfekte të vullnetarizmit që përputhet me aftësitë dhe interesat e tua.
          </p>

          <div className="cta-buttons" style={styles.btnRow}>
            <Link to="/register" style={styles.btnPrimary}>
              Nis Tani
            </Link>

            <Link to="/about" style={styles.btnSecondary}>
              Mëso Më Shumë
            </Link>
          </div>

          <div style={styles.heroStats}>
            {[
              { value: "AI", label: "Përputhje Inteligjente" },
              { value: "Smart", label: "Rekomandime të Personalizuara" },
              { value: "Fast", label: "Proces i Shpejtë" },
            ].map((s) => (
              <div key={s.label} style={styles.heroStat}>
                <div style={styles.heroStatVal}>{s.value}</div>
                <div style={styles.heroStatLbl}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <ScrollFadeIn>
        <section className="how-it-works full-width" style={styles.section}>
          <h2 style={styles.h2}>Si Funksionon?</h2>

          <div className="steps-container" style={styles.grid}>
            {["Krijo Profilin", "Merr Përputhje", "Fillo Vullnetarizmin"].map((title, idx) => (
              <ScrollFadeIn delay={idx * 0.2} key={idx}>
                <div
                  className="step"
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 14px 34px rgba(0, 0, 0, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = "0 10px 28px rgba(0, 0, 0, 0.06)";
                  }}
                >
                  <div style={styles.cardNumber}>{idx + 1}</div>
                  <h3 style={styles.cardTitle}>{title}</h3>
                  <p style={styles.cardText}>
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

      {/* FEATURES */}
      <ScrollFadeIn>
        <section className="features-section full-width" style={styles.sectionAlt}>
          <h2 style={styles.h2}>Veçoritë Kryesore</h2>

          <div className="features-grid" style={styles.grid}>
            {[
              {
                title: "Përputhje me AI",
                desc: "Algoritmet tona të avancuara të ndihmojnë të gjesh mundësi të përshtatshme për profilin tënd.",
              },
              {
                title: "Njohja e Aftësive",
                desc: "Ne identifikojmë dhe përdorim aftësitë e tua për të gjetur vullnetarizmin më të përshtatshëm.",
              },
              {
                title: "Ndjekja e Ndikimit",
                desc: "Monitoro ndikimin që po bën në komunitetin tënd me mjetet tona të raportimit.",
              },
              {
                title: "Ndërtimi i Komunitetit",
                desc: "Lidhu me vullnetarë dhe organizata të tjera që po ndryshojnë Shqipërinë.",
              },
            ].map((feature, idx) => (
              <ScrollFadeIn delay={idx * 0.2} key={idx}>
                <div
                  className="feature"
                  style={{ ...styles.card, width: 280, minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 14px 34px rgba(0, 0, 0, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = "0 10px 28px rgba(0, 0, 0, 0.06)";
                  }}
                >
                  <h3 style={styles.cardTitle}>{feature.title}</h3>
                  <p style={styles.cardText}>{feature.desc}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>

          <div style={{ marginTop: "3rem" }}>
            <Link to="/register" style={styles.btnPrimary}>
              Krijo Llogari <FaArrowRight />
            </Link>
          </div>
        </section>
      </ScrollFadeIn>
    </motion.div>
  );
}

export default HomePage;