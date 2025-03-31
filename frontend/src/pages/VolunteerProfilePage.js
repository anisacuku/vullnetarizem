import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVolunteerProfile } from '../services/profileService';
import '../App.css';

function VolunteerProfilePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      birthDate: ''
    },
    skills: [],
    availability: {
      weekdays: false,
      weekends: false,
      mornings: false,
      afternoons: false,
      evenings: false
    },
    interests: []
  });

  const steps = [
    { title: 'Personal Information' },
    { title: 'Skills' },
    { title: 'Availability' },
    { title: 'Interests' },
    { title: 'Review & Submit' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleInputChange = (section, field, value) => {
    setProfileData({
      ...profileData,
      [section]: {
        ...profileData[section],
        [field]: value
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await createVolunteerProfile(profileData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      // Handle error with user feedback
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content personal-info">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={profileData.personal.firstName}
                onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={profileData.personal.lastName}
                onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={profileData.personal.phone}
                onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={profileData.personal.address}
                onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={profileData.personal.city}
                onChange={(e) => handleInputChange('personal', 'city', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="step-content skills">
            <h3>Your Skills</h3>
            <p>Select the skills you'd like to contribute (placeholder for skill selection component)</p>
            {/* Placeholder for SkillsSelector component */}
          </div>
        );

      case 2:
        return (
          <div className="step-content availability">
            <h3>When are you available?</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={profileData.availability.weekdays}
                  onChange={(e) => handleInputChange('availability', 'weekdays', e.target.checked)}
                />
                Weekdays
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={profileData.availability.weekends}
                  onChange={(e) => handleInputChange('availability', 'weekends', e.target.checked)}
                />
                Weekends
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={profileData.availability.mornings}
                  onChange={(e) => handleInputChange('availability', 'mornings', e.target.checked)}
                />
                Mornings
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={profileData.availability.afternoons}
                  onChange={(e) => handleInputChange('availability', 'afternoons', e.target.checked)}
                />
                Afternoons
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={profileData.availability.evenings}
                  onChange={(e) => handleInputChange('availability', 'evenings', e.target.checked)}
                />
                Evenings
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content interests">
            <h3>Your Interests</h3>
            <p>Select the causes you're passionate about (placeholder for interest selection)</p>
            {/* Placeholder for InterestsSelector component */}
          </div>
        );

      case 4:
        return (
          <div className="step-content review">
            <h3>Review Your Profile</h3>
            <div className="review-section">
              <h4>Personal Information</h4>
              <p>Name: {profileData.personal.firstName} {profileData.personal.lastName}</p>
              <p>Phone: {profileData.personal.phone}</p>
              <p>Location: {profileData.personal.city}</p>
            </div>
            <div className="review-section">
              <h4>Skills</h4>
              <p>{profileData.skills.length > 0 ? profileData.skills.join(', ') : 'No skills selected'}</p>
            </div>
            <div className="review-section">
              <h4>Availability</h4>
              <p>
                {Object.entries(profileData.availability)
                  .filter(([_, value]) => value)
                  .map(([key]) => key)
                  .join(', ') || 'No availability selected'}
              </p>
            </div>
            <div className="review-section">
              <h4>Interests</h4>
              <p>{profileData.interests.length > 0 ? profileData.interests.join(', ') : 'No interests selected'}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-wizard">
      <div className="wizard-progress">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            {step.title}
          </div>
        ))}
      </div>
      <div className="wizard-content">
        {renderStepContent()}
        <div className="button-group">
          {currentStep > 0 && (
            <button type="button" className="back" onClick={handleBack}>
              Back
            </button>
          )}
          <button type="button" className="next" onClick={handleNext}>
            {currentStep < steps.length - 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VolunteerProfilePage;