import React, { useMemo } from 'react';
import styled from 'styled-components';

const ButtonsWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.small};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }
`;

const FilterButton = styled.button`
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ theme, active }) => (active ? theme.colors.onPrimary : theme.colors.text)};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
  }
`;

const getUniqueValues = (items, key) => {
  if (!items) return [];
  const valueMap = new Map();

  items.forEach(item => {
    if (item[key]) {
      if (Array.isArray(item[key])) {
        item[key].forEach(val => {
          if (!valueMap.has(val)) valueMap.set(val, val);
        });
      } else {
        if (!valueMap.has(item[key])) valueMap.set(item[key], item[key]);
      }
    }
  });

  const sortedValues = Array.from(valueMap.values());
  sortedValues.sort((a, b) => String(a).localeCompare(String(b)));
  return sortedValues;
};

const MobileFilterButtons = ({ filters, setters, allCocktails }) => {
  const uniqueFlavorProfiles = useMemo(() => getUniqueValues(allCocktails, 'flavor_profile'), [allCocktails]);

  const handleMultiSelectChange = (setter, currentValues, value) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setter(newValues);
  };

  if (!filters || !setters) {
    return null;
  }

  return (
    <ButtonsWrapper>
      {uniqueFlavorProfiles.map(flavor => (
        <FilterButton
          key={flavor}
          active={filters.flavorProfile.includes(flavor)}
          onClick={() => handleMultiSelectChange(setters.setFlavorProfile, filters.flavorProfile, flavor)}
        >
          {flavor}
        </FilterButton>
      ))}
    </ButtonsWrapper>
  );
};

export default MobileFilterButtons;
