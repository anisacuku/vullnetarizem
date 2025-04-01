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
      {/* Hero Section */}
      <section className="about-hero" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <motion.h1
          className="about-title"
          style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a237e' }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Rreth Platformës
        </motion.h1>
        <motion.p
          className="about-subtitle"
          style={{ fontSize: '1.125rem', color: '#444', maxWidth: '800px', margin: '1rem auto' }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Platforma jonë përdor inteligjencën artificiale për të ndihmuar qytetarët shqiptarë të gjejnë
          mundësi të përshtatshme vullnetarizmi bazuar në aftësitë dhe interesat e tyre.
        </motion.p>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ padding: '3rem 1rem', backgroundColor: '#f9f9f9' }}>
        <h2 className="features-title" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', color: '#1a237e' }}>
          Si Funksionon?
        </h2>
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {[
            {
              icon: <FaBrain />,
              title: "Si Ndihmon Inteligjenca Artificiale?",
              desc: "Duke analizuar të dhënat e profilit tënd, AI jonë rekomandon mundësi që përputhen me përvojën, aftësitë dhe interesat që ke shënuar."
            },
            {
              icon: <FaHandsHelping />,
              title: "Pse Vullnetarizmi?",
              desc: "Vullnetarizmi është një nga mënyrat më të fuqishme për të ndihmuar të tjerët dhe për të zhvilluar aftësitë personale e profesionale."
            },
            {
              icon: <FaUsers />,
              title: "Kush Mund të Përdorë Platformën?",
              desc: "Platforma është e hapur për studentë, profesionistë dhe organizata që dëshirojnë të kontribuojnë në komunitet."
            }
          ].map((feature, i) => (
            <motion.div
              className="feature"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 + i * 0.2 }}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}
            >
              <div className="feature-icon" style={{
                fontSize: '2rem',
                color: '#1e88e5',
                marginBottom: '1rem'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1a237e' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#555', marginTop: '0.5rem' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 className="stats-title" style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1a237e' }}>
          Statistika të Deritanishme
        </h2>
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {[
            { icon: <FaUserFriends />, label: "Vullnetarë", end: 1200, bar: '80%' },
            { icon: <FaClock />, label: "Orë Kontributi", end: 3500, bar: '95%' },
            { icon: <FaCity />, label: "Qytete", end: 25, bar: '60%' }
          ].map((stat, i) => (
            <div className="stat-box" key={i} style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '1rem',
              boxShadow: '0 6px 15px rgba(0,0,0,0.05)'
            }}>
              <div className="stat-icon" style={{ fontSize: '2rem', color: '#1e88e5', marginBottom: '0.5rem' }}>
                {stat.icon}
              </div>
              <div className="stat-number" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333' }}>
                <CountUp end={stat.end} duration={2} />+
              </div>
              <div className="stat-label" style={{ fontSize: '0.95rem', color: '#666', margin: '0.5rem 0' }}>
                {stat.label}
              </div>
              <div className="stat-progress" style={{
                height: '8px',
                background: '#eee',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div className="stat-progress-bar" style={{
                  width: stat.bar,
                  background: '#1e88e5',
                  height: '100%'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default AboutPage;
