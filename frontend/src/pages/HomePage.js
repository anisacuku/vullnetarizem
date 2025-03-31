import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollFadeIn from '../components/common/ScrollFadeIn'; // Adjust path if needed
import '../App.css';

function HomePage() {
  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero section */}
      <motion.section
        className="hero-section"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content floating">
          <h1>AI-Powered Volunteer Matching</h1>
          <p>Find the perfect volunteering opportunity that matches your skills and interests</p>
          <div className="cta-buttons">
            <Link to="/register" className="button primary">Get Started</Link>
            <Link to="/about" className="button secondary">Learn More</Link>
          </div>
        </div>
      </motion.section>

      {/* How it works */}
      <ScrollFadeIn>
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-container">
            {["Create Your Profile", "Get Matched", "Start Volunteering"].map((title, idx) => (
              <ScrollFadeIn delay={idx * 0.2} key={idx}>
                <div className="step">
                  <div className="step-number">{idx + 1}</div>
                  <h3>{title}</h3>
                  <p>
                    {idx === 0 && "Sign up and tell us about your skills and interests"}
                    {idx === 1 && "Our AI analyzes your profile and finds the perfect opportunities"}
                    {idx === 2 && "Apply to opportunities and make a difference in your community"}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      </ScrollFadeIn>

      {/* Features */}
      <ScrollFadeIn>
        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            {[
              {
                title: "AI-Powered Matching",
                desc: "Our advanced algorithms ensure you find opportunities that match your unique profile"
              },
              {
                title: "Skills Recognition",
                desc: "We identify and leverage your skills to find the most suitable volunteer work"
              },
              {
                title: "Impact Tracking",
                desc: "Monitor the difference you make in your community through our tracking tools"
              },
              {
                title: "Community Building",
                desc: "Connect with other volunteers and organizations making a difference in Albania"
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
