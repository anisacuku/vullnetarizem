import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaBriefcase, FaHeart, FaTools, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { findRecommendations } from '../../services/profileMatchingService';
import './ProfileSetupForm.css';

// List of professions for the dropdown
const PROFESSIONS = [
  "Inxhinier",
  "Mjek",
  "Mësues",
  "Programues",
  "Student",
  "Avokat",
  "Arkitekt",
  "Ekonomist",
  "Psikolog",
  "Punonjës Social",
  "Marketing",
  "Financier",
  "Tjetër"
];

// List of interests for the checkboxes
const INTERESTS = [
  "Edukim",
  "Mjedis",
  "Shëndetësi",
  "Arte",
  "Sport",
  "Teknologji",
  "Kafshë",
  "Kuzhinë",
  "Të Moshuarit",
  "Fëmijë",
  "Komuniteti",
  "Turizëm",
  "Gjuhë të huaja",
  "Ndihma humanitare",
  "Bamirësi",
  "Histori",
  "Film"
];

// List of skills for the checkboxes
const SKILLS = [
  "Programim",
  "Dizajn",
  "Mësimdhënie",
  "Komunikim",
  "Menaxhim Projektesh",
  "Përkthim",
  "Kujdes Shëndetësor",
  "Fotografi",
  "Video Editing",
  "Kuzhinë",
  "Organizim Eventesh",
  "Punë fizike",
  "Menaxhim fëmijësh",
  "Punë në ekip",
  "Organizim",
  "Empati",
  "Gjuhë të huaja",
  "Marketing",
  "Kujdes për kafshët",
  "Kopshtari",
  "Njohuri mjedisore"
];

// List of cities for the dropdown
const CITIES = [
  "Tiranë",
  "Durrës",
  "Vlorë",
  "Shkodër",
  "Elbasan",
  "Korçë",
  "Fier",
  "Berat",
  "Lushnjë",
  "Gjirokastër",
  "Sarandë",
  "Pogradec",
  "Kavajë",
  "Lezhë",
  "Krujë",
  "Kukës",
  "Tjetër"
];

function ProfileSetupForm({ onComplete, userEmail }) {
  // Initial form state with all required fields
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    email: userEmail || '',
    profession: '',
    city: '',
    interests: [],
    skills: [],
    availability: {
      weekdays: false,
      weekends: false,
      mornings: false,
      afternoons: false,
      evenings: false
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // Form step (1: Personal info, 2: Skills, 3: Interests, 4: Availability)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        [category]: [...formData[category], value]
      });
    } else {
      setFormData({
        ...formData,
        [category]: formData[category].filter(item => item !== value)
      });
    }

    // Clear error when field is edited
    if (errors[category]) {
      setErrors({
        ...errors,
        [category]: ''
      });
    }
  };

  const handleAvailabilityChange = (e) => {
    const { name, checked } = e.target;

    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [name]: checked
      }
    });
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      // Validate personal information
      if (!formData.name.trim()) newErrors.name = 'Emri është i detyrueshëm';
      if (!formData.surname.trim()) newErrors.surname = 'Mbiemri është i detyrueshëm';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Numri i telefonit është i detyrueshëm';

      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Numri i telefonit nuk është i vlefshëm';
      }

      if (!formData.email.trim()) newErrors.email = 'Email është i detyrueshëm';
      if (!formData.profession) newErrors.profession = 'Zgjidhni një profesion';
      if (!formData.city) newErrors.city = 'Zgjidhni një qytet';
    }
    else if (stepNumber === 2) {
      // Validate skills
      if (formData.skills.length === 0) newErrors.skills = 'Zgjidhni të paktën një aftësi';
    }
    else if (stepNumber === 3) {
      // Validate interests
      if (formData.interests.length === 0) newErrors.interests = 'Zgjidhni të paktën një interes';
    }
    else if (stepNumber === 4) {
      // Validate availability
      const hasAnyAvailability = Object.values(formData.availability).some(value => value);
      if (!hasAnyAvailability) {
        newErrors.availability = 'Zgjidhni të paktën një disponueshmëri';
      }
    }

    return newErrors;
  };

  const nextStep = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setStep(step + 1);
    setErrors({});
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save profile data to localStorage
      localStorage.setItem(`user_profile_${userEmail}`, JSON.stringify(formData));

      // Find recommendations based on profile
      const recommendationsData = await findRecommendations(formData);

      // Save recommendations
      localStorage.setItem(`user_recommendations_${userEmail}`, JSON.stringify(recommendationsData));

      // Mark profile as completed
      localStorage.setItem(`profile_completed_${userEmail}`, 'true');

      // Call onComplete with both profile and recommendations
      onComplete(formData, recommendationsData);

    } catch (error) {
      console.error('Error processing profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different form steps
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          // Step 1: Personal Information
          <>
            <h3 className="step-title">Informacion Personal</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser className="form-icon" /> Emri
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="surname">
                  <FaUser className="form-icon" /> Mbiemri
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className={errors.surname ? 'error' : ''}
                />
                {errors.surname && <span className="error-message">{errors.surname}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phoneNumber">
                  <FaPhone className="form-icon" /> Numri i Telefonit
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={errors.phoneNumber ? 'error' : ''}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="form-icon" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  readOnly
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="profession">
                  <FaBriefcase className="form-icon" /> Profesioni
                </label>
                <select
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className={errors.profession ? 'error' : ''}
                >
                  <option value="">Zgjidhni profesionin tuaj</option>
                  {PROFESSIONS.map(profession => (
                    <option key={profession} value={profession}>{profession}</option>
                  ))}
                </select>
                {errors.profession && <span className="error-message">{errors.profession}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="city">
                  <FaMapMarkerAlt className="form-icon" /> Qyteti
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                >
                  <option value="">Zgjidhni qytetin tuaj</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>
          </>
        );

      case 2:
        return (
          // Step 2: Skills
          <>
            <h3 className="step-title">Aftësitë Tuaja</h3>
            <p className="step-description">
              Zgjidhni aftësitë që dëshironi të përdorni gjatë vullnetarizmit. Kjo do të na ndihmojë të gjejmë mundësi që përputhen me aftësitë tuaja.
            </p>

            <div className="form-group">
              <label>
                <FaTools className="form-icon" /> Aftësitë
              </label>
              <div className="checkbox-grid">
                {SKILLS.map(skill => (
                  <div key={skill} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`skill-${skill}`}
                      name="skills"
                      value={skill}
                      checked={formData.skills.includes(skill)}
                      onChange={(e) => handleCheckboxChange(e, 'skills')}
                    />
                    <label htmlFor={`skill-${skill}`}>{skill}</label>
                  </div>
                ))}
              </div>
              {errors.skills && <span className="error-message">{errors.skills}</span>}
            </div>
          </>
        );

      case 3:
        return (
          // Step 3: Interests
          <>
            <h3 className="step-title">Interesat Tuaja</h3>
            <p className="step-description">
              Cilat fusha ju interesojnë më shumë për vullnetarizëm? Zgjidhni interesat tuaja për të marrë rekomandime më të përshtatura.
            </p>

            <div className="form-group">
              <label>
                <FaHeart className="form-icon" /> Interesat
              </label>
              <div className="checkbox-grid">
                {INTERESTS.map(interest => (
                  <div key={interest} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`interest-${interest}`}
                      name="interests"
                      value={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={(e) => handleCheckboxChange(e, 'interests')}
                    />
                    <label htmlFor={`interest-${interest}`}>{interest}</label>
                  </div>
                ))}
              </div>
              {errors.interests && <span className="error-message">{errors.interests}</span>}
            </div>
          </>
        );

      case 4:
        return (
          // Step 4: Availability
          <>
            <h3 className="step-title">Disponueshmëria Juaj</h3>
            <p className="step-description">
              Kur jeni të disponueshëm për vullnetarizëm? Kjo do të na ndihmojë të gjejmë mundësi që përshtaten me orarin tuaj.
            </p>

            <div className="form-group">
              <label>
                <FaClock className="form-icon" /> Disponueshmëria
              </label>

              <div className="availability-section">
                <h4>Ditët e javës</h4>
                <div className="availability-options">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="weekdays"
                      name="weekdays"
                      checked={formData.availability.weekdays}
                      onChange={handleAvailabilityChange}
                    />
                    <label htmlFor="weekdays">Ditët e punës (E hënë - E premte)</label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="weekends"
                      name="weekends"
                      checked={formData.availability.weekends}
                      onChange={handleAvailabilityChange}
                    />
                    <label htmlFor="weekends">Fundjavë (E shtunë - E diel)</label>
                  </div>
                </div>
              </div>

              <div className="availability-section">
                <h4>Orari</h4>
                <div className="availability-options">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="mornings"
                      name="mornings"
                      checked={formData.availability.mornings}
                      onChange={handleAvailabilityChange}
                    />
                    <label htmlFor="mornings">Mëngjes (8:00 - 12:00)</label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="afternoons"
                      name="afternoons"
                      checked={formData.availability.afternoons}
                      onChange={handleAvailabilityChange}
                    />
                    <label htmlFor="afternoons">Pasdite (12:00 - 17:00)</label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="evenings"
                      name="evenings"
                      checked={formData.availability.evenings}
                      onChange={handleAvailabilityChange}
                    />
                    <label htmlFor="evenings">Mbrëmje (17:00 - 22:00)</label>
                  </div>
                </div>
              </div>

              {errors.availability && <span className="error-message">{errors.availability}</span>}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-setup-form">
      <div className="form-progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span className="step-label">Profili</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span className="step-label">Aftësitë</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-label">Interesat</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <span className="step-label">Disponueshmëria</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-step-container">
          {renderFormStep()}
        </div>

        <div className="form-actions">
          {step > 1 && (
            <button
              type="button"
              className="back-button"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Prapa
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              className="next-button"
              onClick={nextStep}
            >
              Vazhdo
            </button>
          ) : (
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Duke Përpunuar...' : 'Përfundo Profilin'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProfileSetupForm;