import React from 'react';
import styled from 'styled-components';
import { useBar } from '../contexts/BarContext';
import barSpecificData from '../data/bar_specific_data.json'; // For curated menu names

const SelectorWrapper = styled.div`
  margin-left: ${props => props.theme.spacing.medium}; // Add some spacing if in Navbar

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
  const { selectedBar, viewingCuratedMenu, selectBar, viewCuratedMenu } = useBar();

  const barOptions = [
    { value: 'all', label: 'View All Cocktails (No Bar)' },
    { value: 'bar1_stock', label: 'View Bar 1 Full Stock' },
    { value: 'bar2_stock', label: 'View Bar 2 Full Stock' },
  ];

  const curatedMenuOptions = Object.keys(barSpecificData).map(barKey => ({
    value: `${barKey}_curated`,
    label: `${barSpecificData[barKey].barName}: ${barSpecificData[barKey].curatedMenuName}`,
    barId: barKey // Store original barId for selection
  }));

  const allOptions = [...barOptions, ...curatedMenuOptions];

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === 'all') {
      selectBar('all'); // This also clears curated menu via context logic
    } else if (value === 'bar1_stock') {
      selectBar('bar1');
    } else if (value === 'bar2_stock') {
      selectBar('bar2');
    } else if (value.endsWith('_curated')) {
      viewCuratedMenu(value); // This also sets the corresponding bar via context logic
    }
  };

  // Determine current value for the select dropdown
  let currentValue = 'all';
  if (viewingCuratedMenu) {
    currentValue = viewingCuratedMenu;
  } else if (selectedBar !== 'all') {
    currentValue = `${selectedBar}_stock`;
  }

  return (
    <SelectorWrapper>
      <select value={currentValue} onChange={handleChange}>
        {allOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SelectorWrapper>
  );
};

export default BarSelector;
