import React from 'react';
import styled from 'styled-components';
import { useBar } from '../contexts/BarContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SelectorWrapper = styled.div`
  margin-left: ${props => props.theme.spacing.medium};

  select {
    padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
    border-radius: ${props => props.theme.borderRadius};
    border: 1px solid ${props => props.theme.colors.border};
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fonts.main};
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const BarSelector = () => {
  const { selectedBarId, selectBar } = useBar();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const options = [
    { value: 'all', label: t('navigation.allCocktails') },
    { value: 'bar1', label: t('navigation.levelOne') },
    { value: 'bar2', label: t('navigation.theGlitch') },
  ];

  const barIdToPath = {
    'bar1': '/bar/level-one',
    'bar2': '/bar/the-glitch',
    'all': '/categories/all'
  };

  const handleChange = (event) => {
    const newBarId = event.target.value;
    selectBar(newBarId);

    const path = barIdToPath[newBarId];
    if (path) {
      navigate(path);
    }
  };

  return (
    <SelectorWrapper>
      <select value={selectedBarId} onChange={handleChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SelectorWrapper>
  );
};

export default BarSelector;
