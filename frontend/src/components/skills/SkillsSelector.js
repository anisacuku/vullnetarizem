import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSkillsList } from '../services/skillsService';
import '../styles/SkillsSelector.css';

function SkillsSelector({ selectedSkills = [], onChange, limit = 10 }) {
  const { t } = useTranslation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch available skills
  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);
        const skillsData = await getSkillsList();
        setSkills(skillsData);
      } catch (err) {
        setError('Failed to load skills');
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  // Filter skills based on search term
  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle skill selection
  function handleSkillToggle(skillId) {
    const isSelected = selectedSkills.includes(skillId);

    if (isSelected) {
      // Remove skill if already selected
      const newSelectedSkills = selectedSkills.filter(id => id !== skillId);
      onChange(newSelectedSkills);
    } else if (selectedSkills.length < limit) {
      // Add skill if under limit
      const newSelectedSkills = [...selectedSkills, skillId];
      onChange(newSelectedSkills);
    }
  }

  if (loading) return createElement('div', { className: 'loading' }, t('common.loading'));
  if (error) return createElement('div', { className: 'error' }, error);

  return createElement('div', { className: 'skills-selector' },
    createElement('div', { className: 'skills-search' },
      createElement('input', {
        type: 'text',
        placeholder: t('skills.searchPlaceholder'),
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value)
      })
    ),

    createElement('div', { className: 'selected-count' },
      `${selectedSkills.length}/${limit} ${t('skills.selected')}`
    ),

    createElement('div', { className: 'skills-list' },
      filteredSkills.length === 0
        ? createElement('p', { className: 'no-results' }, t('skills.noResults'))
        : filteredSkills.map(skill =>
            createElement('div', {
              key: skill.id,
              className: `skill-item ${selectedSkills.includes(skill.id) ? 'selected' : ''}`,
              onClick: () => handleSkillToggle(skill.id)
            },
              createElement('span', { className: 'skill-name' }, skill.name),
              selectedSkills.includes(skill.id) &&
                createElement('span', { className: 'checkmark' }, '✓')
            )
          )
    )
  );
}

export default SkillsSelector;