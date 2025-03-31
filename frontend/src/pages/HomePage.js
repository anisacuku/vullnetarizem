import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollFadeIn from '../components/common/ScrollFadeIn';
import '../App.css';

function HomePage() {
  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Seksioni Hero */}
      <motion.section
        className="hero-section"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content floating">
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
        <section className="how-it-works">
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
        <section className="features-section">
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
                desc: "Monitoro ndikimin që po bën në komunitetin tënd me mjetet tona të raportimit."
              },
              {
                title: "Ndërtimi i Komunitetit",
                desc: "Lidhu me vullnetarë dhe organizata të tjera që po ndryshojnë Shqipërinë."
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
