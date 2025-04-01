import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaBriefcase, FaHeart, FaTools } from 'react-icons/fa';
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
  "Komuniteti"
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
  "Organizim Eventesh"
];

function ProfileSetupForm({ onComplete, userEmail }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    email: userEmail || '',
    profession: '',
    interests: [],
    skills: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Emri është i detyrueshëm';
    if (!formData.surname.trim()) newErrors.surname = 'Mbiemri është i detyrueshëm';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Numri i telefonit është i detyrueshëm';

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Numri i telefonit nuk është i vlefshëm';
    }

    if (!formData.email.trim()) newErrors.email = 'Email është i detyrueshëm';
    if (!formData.profession) newErrors.profession = 'Zgjidhni një profesion';
    if (formData.interests.length === 0) newErrors.interests = 'Zgjidhni të paktën një interes';
    if (formData.skills.length === 0) newErrors.skills = 'Zgjidhni të paktën një aftësi';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to save profile data
    setTimeout(() => {
      console.log('Profile data submitted:', formData);

      // Save profile data to localStorage (in a real app, this would be sent to backend)
      localStorage.setItem(`user_profile_${userEmail}`, JSON.stringify(formData));

      setIsSubmitting(false);
      // Call the onComplete callback to notify parent component
      onComplete();
    }, 1500);
  };

  return (
    <div className="profile-setup-form">
      <form onSubmit={handleSubmit}>
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

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Duke Dërguar...' : 'Përfundo Profilin'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSetupForm;