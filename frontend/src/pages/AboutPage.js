// src/pages/AboutPage.js
import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  FaBrain,
  FaHandsHelping,
  FaUsers,
  FaUserFriends,
  FaClock,
  FaCity
} from 'react-icons/fa';

import '../App.css';

function AboutPage() {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero */}
      <section className="about-hero">
        <motion.h1
          className="about-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Rreth Platformës
        </motion.h1>
        <motion.p
          className="about-subtitle"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Platforma jonë përdor inteligjencën artificiale për të ndihmuar qytetarët shqiptarë të gjejnë
          mundësi të përshtatshme vullnetarizmi bazuar në aftësitë dhe interesat e tyre.
        </motion.p>
      </section>

      {/* Platform Info */}
      <section className="features-section">
        <h2 className="features-title">Si Funksionon?</h2>
        <div className="features-grid">
          <motion.div
            className="feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="feature-icon"><FaBrain /></div>
            <h3>Si Ndihmon Inteligjenca Artificiale?</h3>
            <p>
              Duke analizuar të dhënat e profilit tënd, AI jonë rekomandon mundësi që përputhen me përvojën,
              aftësitë dhe interesat që ke shënuar. Kjo rrit shanset për angazhim real dhe ndikon pozitivisht në komunitet.
            </p>
          </motion.div>

          <motion.div
            className="feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="feature-icon"><FaHandsHelping /></div>
            <h3>Pse Vullnetarizmi?</h3>
            <p>
              Vullnetarizmi është një nga mënyrat më të fuqishme për të ndihmuar të tjerët dhe për të zhvilluar aftësitë
              e tua personale e profesionale. Ne e bëjmë më të lehtë për ty të japësh kontributin tënd.
            </p>
          </motion.div>

          <motion.div
            className="feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="feature-icon"><FaUsers /></div>
            <h3>Kush Mund të Përdorë Platformën?</h3>
            <p>
              Platforma është e hapur për të gjithë: studentë, profesionistë, organizata jofitimprurëse dhe këdo që
              dëshiron të bëjë një ndryshim në Shqipëri. Ne besojmë në fuqinë e bashkëpunimit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="stats-section">
        <h2 className="stats-title">Statistika të Deritanishme</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <FaUserFriends className="stat-icon" />
            <div className="stat-number">
              <CountUp end={1200} duration={2} />+
            </div>
            <div className="stat-label">Vullnetarë</div>
            <div className="stat-progress">
              <div className="stat-progress-bar" style={{ width: '80%' }}></div>
            </div>
          </div>

          <div className="stat-box">
            <FaClock className="stat-icon" />
            <div className="stat-number">
              <CountUp end={3500} duration={2} />+
            </div>
            <div className="stat-label">Orë Kontributi</div>
            <div className="stat-progress">
              <div className="stat-progress-bar" style={{ width: '95%' }}></div>
            </div>
          </div>

          <div className="stat-box">
            <FaCity className="stat-icon" />
            <div className="stat-number">
              <CountUp end={25} duration={2} />+
            </div>
            <div className="stat-label">Qytete</div>
            <div className="stat-progress">
              <div className="stat-progress-bar" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AboutPage;
