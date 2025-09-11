import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import SurpriseMeButton from './SurpriseMeButton';

const SidebarWrapper = styled.aside`
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  min-width: 250px; // Example width
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.text};

  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.small};
  }

  label {
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textOffset};
    font-family: ${({ theme }) => theme.fonts.main};
  }

  select, input[type="text"], .checkbox-group {
    width: 100%;
    padding: ${props => props.theme.spacing.small};
    border-radius: ${props => props.theme.borderRadius};
    border: 1px solid ${props => props.theme.colors.border};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.main};
    margin-bottom: ${props => props.theme.spacing.medium};
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px rgba(${props => props.theme.colors.primary}, 0.2);
      outline: none;
    }
  }
  
  .checkbox-group {
    max-height: 150px;
    overflow-y: auto;
    position: relative;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    margin-bottom: ${props => props.theme.spacing.xs};
  }

  .checkbox-item input[type="checkbox"] {
    margin-right: ${props => props.theme.spacing.small};
    width: auto;
    margin-bottom: 0;
    accent-color: ${props => props.theme.colors.primary};
  }

  .checkbox-item label {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0;
    font-weight: normal;
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const StickySearchInput = styled.input`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.surface || '#fff'};
  z-index: 10;
  width: calc(100% - 2 * ${({ theme }) => theme.spacing.small});
  padding: ${({ theme }) => theme.spacing.small};
  margin: 0 auto ${({ theme }) => theme.spacing.small} auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: block;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(${props => props.theme.colors.primaryRGB || '0,123,255'}, 0.2);
    outline: none;
  }
`;

const Button = styled.button`
  font-family: ${({ theme }) => theme.fonts.main};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.small};
  font-weight: 600;
  text-transform: uppercase;

  &.primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border: 1px solid transparent;
    &:hover, &:focus {
      background-color: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.onSecondary};
      box-shadow: ${({ theme }) => theme.shadows.small};
      outline: 2px solid ${({ theme }) => theme.colors.secondary};
      outline-offset: 2px;
    }
  }

  &.reset {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    &:hover, &:focus {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.onPrimary};
      box-shadow: ${({ theme }) => theme.shadows.small};
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }
`;

const getUniqueValues = (items, key, subKey = null) => {
  if (!items) return [];
  const valueMap = new Map();

  items.forEach(item => {
    if (subKey && item[key]) {
      item[key].forEach(subItem => {
        if (subKey === 'name' && subItem && subItem.id && subItem.name) {
          if (!valueMap.has(subItem.id)) {
            valueMap.set(subItem.id, { id: subItem.id, name: subItem.name });
          }
        } else if (subItem && subItem[subKey]) {
           if (!valueMap.has(subItem[subKey])) {
            valueMap.set(subItem[subKey], subItem[subKey]);
           }
        }
      });
    } else if (item[key]) {
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
  if (subKey === 'name') {
    if (sortedValues.every(val => typeof val === 'object' && val !== null && 'name' in val)) {
      sortedValues.sort((a, b) => a.name.localeCompare(b.name));
    }
  } else {
    try {
      sortedValues.sort((a, b) => String(a).localeCompare(String(b)));
    } catch (e) {
    }
  }
  return sortedValues;
};


const FilterSidebar = ({
  allCocktails, // from cocktails.json
  categories, // from categories.json
  thematicCategories, // New prop for thematic categories
  filters, // { baseSpirit, includeIngredients, ... } from useCocktailFilter
  setters, // { setBaseSpirit, setIncludeIngredients, ... } from useCocktailFilter
  resetFilters, // from useCocktailFilter
  filteredCocktailsForSurprise,
  id
}) => {
  const [includeIngredientSearchTerm, setIncludeIngredientSearchTerm] = useState('');
  const [excludeIngredientSearchTerm, setExcludeIngredientSearchTerm] = useState('');

  const uniqueIngredients = useMemo(() => getUniqueValues(allCocktails, 'ingredients', 'name'), [allCocktails]);
  const uniqueFlavorProfiles = useMemo(() => getUniqueValues(allCocktails, 'flavor_profile'), [allCocktails]);
  const uniqueTags = useMemo(() => getUniqueValues(allCocktails, 'tags'), [allCocktails]);
  const uniqueGlassTypes = useMemo(() => getUniqueValues(allCocktails, 'glass'), [allCocktails]);
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleMultiSelectChange = (setter, currentValues, value) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setter(newValues);
  };
  
  if (!filters || !setters || !resetFilters) {
    console.warn("FilterSidebar: filters, setters, or resetFilters prop is missing.");
    return null; 
  }


  return (
    <SidebarWrapper id={id}>
      <h3>Filter Cocktails</h3>

      <FilterSection>
        <label htmlFor="baseSpirit">Base Spirit/Category:</label>
        <select
          id="baseSpirit"
          value={filters.baseSpirit}
          onChange={(e) => setters.setBaseSpirit(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories && categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection>
        <label htmlFor="includeIngredients">Include Ingredients:</label>
        <div className="checkbox-group">
          <StickySearchInput
            type="text"
            id="includeIngredientSearch"
            placeholder="Search to include..."
            value={includeIngredientSearchTerm}
            onChange={(e) => setIncludeIngredientSearchTerm(e.target.value)}
          />
          {uniqueIngredients
            .filter(ingObj => ingObj.name.toLowerCase().includes(includeIngredientSearchTerm.toLowerCase()))
            .map(ingObj => (
            <div key={ingObj.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`include-${ingObj.id}`}
                value={ingObj.id}
                checked={filters.includeIngredients.includes(ingObj.id)}
                onChange={() => handleMultiSelectChange(setters.setIncludeIngredients, filters.includeIngredients, ingObj.id)}
              />
              <label htmlFor={`include-${ingObj.id}`}>{ingObj.name}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label htmlFor="excludeIngredients">Exclude Ingredients:</label>
         <div className="checkbox-group">
          <StickySearchInput
            type="text"
            id="excludeIngredientSearch"
            placeholder="Search to exclude..."
            value={excludeIngredientSearchTerm}
            onChange={(e) => setExcludeIngredientSearchTerm(e.target.value)}
          />
          {uniqueIngredients
            .filter(ingObj => ingObj.name.toLowerCase().includes(excludeIngredientSearchTerm.toLowerCase()))
            .map(ingObj => (
            <div key={ingObj.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`exclude-${ingObj.id}`}
                value={ingObj.id}
                checked={filters.excludeIngredients.includes(ingObj.id)}
                onChange={() => handleMultiSelectChange(setters.setExcludeIngredients, filters.excludeIngredients, ingObj.id)}
              />
              <label htmlFor={`exclude-${ingObj.id}`}>{ingObj.name}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label>Flavor Profile:</label>
        <div className="checkbox-group">
          {uniqueFlavorProfiles.map(flavor => (
            <div key={flavor} className="checkbox-item">
              <input
                type="checkbox"
                id={`flavor-${flavor}`}
                value={flavor}
                checked={filters.flavorProfile.includes(flavor)}
                onChange={() => handleMultiSelectChange(setters.setFlavorProfile, filters.flavorProfile, flavor)}
              />
              <label htmlFor={`flavor-${flavor}`}>{flavor}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={filters.difficulty}
          onChange={(e) => setters.setDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          {difficulties.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection>
        <label>Tags:</label>
        <div className="checkbox-group">
          {uniqueTags.map(tag => (
            <div key={tag} className="checkbox-item">
              <input
                type="checkbox"
                id={`tag-${tag}`}
                value={tag}
                checked={filters.tags.includes(tag)}
                onChange={() => handleMultiSelectChange(setters.setTags, filters.tags, tag)}
              />
              <label htmlFor={`tag-${tag}`}>{tag}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label>Thematic Categories:</label>
        {thematicCategories && thematicCategories.length > 0 && (
          <div className="checkbox-group">
            {thematicCategories.map(theme => (
              <div key={theme.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`theme-${theme.id}`}
                  value={theme.id}
                  checked={filters.thematic && filters.thematic.includes(theme.id)}
                  onChange={() => handleMultiSelectChange(setters.setThematic, filters.thematic || [], theme.id)}
                />
                <label htmlFor={`theme-${theme.id}`}>{theme.name}</label>
              </div>
            ))}
          </div>
        )}
      </FilterSection>

      <FilterSection>
        <label htmlFor="glassType">Glass Type:</label>
        <select
          id="glassType"
          value={filters.glassType}
          onChange={(e) => setters.setGlassType(e.target.value)}
        >
          <option value="">All Glass Types</option>
          {uniqueGlassTypes.map(glass => (
            <option key={glass} value={glass}>{glass}</option>
          ))}
        </select>
      </FilterSection>

      <Button type="button" className="reset" onClick={resetFilters}>
        Reset Filters
      </Button>
      <SurpriseMeButton 
        filteredCocktails={filteredCocktailsForSurprise} 
      />
    </SidebarWrapper>
  );
};

export default FilterSidebar;
